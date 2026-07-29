import asyncio
import httpx
import json
import os
import re
import random
from textblob import TextBlob
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

try:
    from google import genai as gemini_client
    USE_GENAI = True
except ImportError:
    import google.generativeai as gemini_client
    USE_GENAI = False

load_dotenv()
XPOZ_TOKEN = os.getenv("XPOZ_API_TOKEN")
XPOZ_URL = "https://mcp.xpoz.ai/mcp"

app = FastAPI()

# --- 1. CONFIGURATION: ENABLE CORS ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "NoteBoost backend is running."}

def calculate_sve_score(text, likes, retweets, mins_ago):
    # 1. S (Sentiment): Normalized 0 to 1 (1.0 = Highly Negative)
    blob = TextBlob(text)
    # TextBlob polarity is -1 to 1. We shift it so -1 is 1 and 1 is 0.
    s = (1 - blob.sentiment.polarity) / 2
    
    # 2. V (Velocity): (Likes + Retweets) per minute
    interactions = likes + retweets
    # We use mins_ago to get rate. +1 to avoid division by zero.
    v_raw = interactions / (mins_ago + 1)
    # Normalize: Assume 50 interactions/min is "Peak Velocity" (1.0)
    v = min(v_raw / 50, 1.0)
    
    # 3. E (Evidence): Based on links found
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)
    # Base evidence is 0.5. Each link adds 0.25. Max 1.0.
    e = min(0.5 + (len(links) * 0.25), 1.0)
    
    # Formula: R = (S * V) / E
    r_context = (s * v) / e
    return {
        "s": round(s, 2),
        "v": round(v, 2),
        "e": round(e, 2),
        "score": round(min(r_context, 1.0), 2) # Cap at 1.0 for UI
    }

# In backend/main.py

@app.get("/test-feed")
async def test_feed():
    # THE NARRATIVE CAST (Villain, False Positive, Bystander)
    narrative_data = [
        {
            "user": "@DeepNet_Ops",
            "text": "🚨 WARNING: Zero-Day in NoteBoost auth protocol. Logic flaw allows bypass of 2FA. Proof-of-concept code: pastebin.com/raw/explo... #Infosec #BugBounty",
            "likes": 850,     # High V
            "retweets": 420,
            "mins_ago": 2,
            "avatar": "Felix" 
        },
        {
            "user": "@DevTeam_Lead",
            "text": "We are finally killing the old auth server tonight! It's dead. Long live the new v2 system. 💀🔥 #Deployment #DevOps",
            "likes": 12,      # Low V
            "retweets": 0,
            "mins_ago": 12,
            "avatar": "Aneka"
        },
        {
            "user": "@Tech_Daily",
            "text": "Integrating @NoteBoost into our workflow today. The latency is incredible. Has anyone found a way to customize the sentinel weights yet?",
            "likes": 45,      # Normal V
            "retweets": 5,
            "mins_ago": 45,
            "avatar": "Marco"
        }
    ]

    processed = []
    for item in narrative_data:
        stats = calculate_sve_score(item["text"], item["likes"], item["retweets"], item["mins_ago"])

        processed.append({
            "username": item["user"],
            "text": item["text"],
            "timestamp": f"{item['mins_ago']}m ago",
            "riskScore": stats["score"],
            "s_val": stats["s"],
            "v_val": stats["v"],
            "e_val": stats["e"],
            "avatarUrl": f"https://api.dicebear.com/7.x/avataaars/svg?seed={item['avatar']}"
        })
    return processed

class ThreatAnalysisRequest(BaseModel):
    tweet_text: str

@app.post("/analyze-threat")
async def analyze_threat(request: ThreatAnalysisRequest):
    """
    Sends the tweet to Gemini 2.0 Flash for verification: a
    Safe/Suspect/Malicious verdict, a confidence score, and a
    one-sentence justification.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Missing Gemini API key")

    system_instruction = (
        "You are an expert Cybersecurity Analyst for NoteBoost. "
        "Analyze tweets for misinformation, social engineering, or coordinated attacks. "
        "Provide a concise verdict (Safe, Malicious, or Suspect), a confidence score (0-1), "
        "and a 1-sentence justification."
    )

    try:
        if USE_GENAI:
            client = gemini_client.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=request.tweet_text,
                config={
                    "system_instruction": system_instruction,
                    "response_mime_type": "application/json",
                }
            )
            raw_payload = getattr(response, "parsed", None)
            if raw_payload is None:
                raw_text = getattr(response, "text", None)
                if raw_text is None and getattr(response, "candidates", None):
                    raw_text = response.candidates[0].content.parts[0].text
                raw_payload = json.loads(raw_text or "{}")
        else:
            gemini_client.configure(api_key=api_key)
            model = gemini_client.GenerativeModel(
                model_name="gemini-2.0-flash",
                system_instruction=system_instruction
            )
            response = model.generate_content(
                request.tweet_text,
                generation_config={"response_mime_type": "application/json"}
            )
            raw_payload = json.loads(response.text or "{}")

        verdict = raw_payload.get("verdict")
        confidence = raw_payload.get("confidence")
        explanation = raw_payload.get("explanation")
        if verdict is None or confidence is None or explanation is None:
            raise ValueError("Gemini response missing required fields")

        return {
            "verdict": verdict,
            "confidence": confidence,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent analysis failed: {str(e)}")

# --- 3. THE REAL XPOZ LOGIC (Restored) ---
@app.get("/fetch-following")
async def fetch_following(
    username: str | None = None,
    max_results: int = 500,
    connection_type: str = "following",
):
    if not username:
        raise HTTPException(status_code=400, detail="Provide username")
    
    async def call_tool(tool_name: str, arguments: dict):
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {"name": tool_name, "arguments": arguments},
        }
        headers = {
            "Authorization": f"Bearer {XPOZ_TOKEN}",
            "Accept": "application/json, text/event-stream",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(XPOZ_URL, json=payload, headers=headers)
            response.raise_for_status()
            content_type = response.headers.get("content-type", "")
            
            if "application/json" in content_type:
                return response.json()
            else:
                # Stream parsing logic
                import json
                lines = response.text.splitlines()
                for line in reversed(lines):
                    if line.startswith("data:"):
                        return json.loads(line[5:].strip())
                raise HTTPException(status_code=502, detail="Xpoz sent a stream with no data")

    try:
        # Initiate the request
        args = {"username": username, "maxResults": max_results, "connectionType": connection_type}
        data = await call_tool("getTwitterUserConnections", args)
        result = data.get("result", {})

        # Extract operationId
        operation_id = None
        if isinstance(result, dict):
            content = result.get("content", [])
            if content and "text" in content[0]:
                text_blob = content[0]["text"]
                match = re.search(r"operationId:\s*(op_[a-zA-Z0-9_]+)", text_blob)
                if match:
                    operation_id = match.group(1)

        # Polling Loop
        if operation_id:
            print(f"NoteBoost: Background job found. Waiting for data... ID: {operation_id}")
            for i in range(50):
                await asyncio.sleep(5)
                status_data = await call_tool("checkOperationStatus", {"operationId": operation_id})

                status_res = status_data.get("result", {})
                print(f"NoteBoost: Check #{i+1} - Status: {status_res.get('status')}")

                if status_res.get("status") == "completed":
                    final_ids = status_res.get("data", [])
                    return {
                        "status": "success",
                        "following_count": len(final_ids),
                        "following_ids": final_ids
                    }
        
        return {"status": "timeout", "message": "Xpoz is taking too long."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.on_event("startup")
async def startup_event():
    # Run the noise maker in the background
    asyncio.create_task(simulate_high_throughput_logs())

async def simulate_high_throughput_logs():
    actions = [
        "INGEST: Signal received from X Firehose",
        "NORMALIZE: Parsing JSON schema v2.4",
        "FILTER: Dropping low-quality signal (spam)",
        "QUEUE: Pushing to analysis worker #4",
        "DB: Async write committed (12ms)"
    ]
    
    print("--- NoteBoost ingestion simulator started ---")
    
    while True:
        # Pick a random log message
        log = random.choice(actions)
        id = random.randint(10000, 99999)
        
        # Print it to the terminal
        print(f"[ASYNC-WORKER] {log} | ID: {id}")
        
        # Random sleep to make it look organic (fast but variable)
        await asyncio.sleep(random.uniform(0.05, 0.3))