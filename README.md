# 🛡️ NoteBoost 
### **Real-Time Social Threat Intelligence & Automated Triage Engine**

**NoteBoost** is a next-generation cybersecurity dashboard that monitors social media signals for coordinated disinformation campaigns, zero-day exploit leaks, and brand reputation threats.

Unlike traditional monitors that rely solely on keywords, Sentinel uses a **Hybrid Intelligence Engine**:

1. **Speed:** A deterministic heuristic formula () filters noise in microseconds.
2. **Intelligence:** A **Gemini 2.0 Flash** agent verifies high-risk threats against ground-truth data (arXiv, CVE databases, internal logs).

---

## 🚀 Key Features

* **Live Threat Monitor:** Asynchronous ingestion pipeline processing high-velocity social signals.
* **Mathematical Risk Scoring:** Custom  algorithm to detect viral anomalies instantly.
* **Agentic Triage:** "Review & Block" triggers a Gemini Agent that performs deep-dive forensic analysis (Context Check, Source Verification, Cross-Referencing).
* **"Mission Impossible" UI:** Dark-mode dashboard with slide-down forensic packets and live ingestion logs.
* **False Positive Protection:** Distinguishes between actual threats (e.g., "Zero-Day Exploit") and benign technical jargon (e.g., "Killing a server").

---

## 🏗️ Technical Architecture

### **1. The Ingestion Layer (FastAPI)**

* Built on **FastAPI** + **AsyncIO** for non-blocking, high-throughput signal processing.
* Normalizes unstructured social data into a strict JSON schema.
* Simulates "Firehose" velocity with background worker tasks.

### **2. The Detection Layer (Heuristic Engine)**

* **TextBlob NLP:** Calculates Sentiment Polarity ().
* **Velocity Logic:** Tracks interactions per minute ().
* **Evidence Scoring:** Regex-based domain verification ().

### **3. The Verification Layer (Generative AI)**

* **Google Gemini 2.0 Flash:** Acts as the "Level 2 Analyst."
* Receives the JSON payload and cross-references claims against trusted datasets.
* Returns a structured "Triage Packet" with a Verdict (Safe/Malicious) and Confidence Score.

### **4. The Resolution Layer (Next.js)**

* **Next.js 14:** Server-side rendering for performance.
* **Tailwind CSS:** "Cyber-Sentinel" aesthetic with Framer Motion animations.
* **Polling Architecture:** Simulates real-time WebSocket updates.

---

## 🧮 The Logic:  Formula

Threats are prioritized using our proprietary risk formula:

* **(Sentiment Risk):** Derived from NLP polarity. High hostility = High .
* **(Velocity Risk):** Rate of spread (Likes/Retweets per minute). Viral = High .
* **(Evidence Credibility):** Domain trust score. Unverified links (Pastebin) = Low  (which increases Risk).

---

## Getting started

### Prerequisites

* Node.js 18+
* Python 3.10+ (the backend uses `str | None` union syntax that requires it)
* A Google Gemini API key — required for `/analyze-threat` to return real results; without it, that endpoint returns a 500

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/noteboost.git
cd noteboost

```

### 2. Backend setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Add your key(s) to a .env file in backend/:
#   GEMINI_API_KEY=your-key-here
#   XPOZ_API_TOKEN=your-token-here   # only needed for /fetch-following

uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`. API docs at `/docs`.

### 3. Frontend setup (Next.js)

```bash
# From the repo root, in a new terminal
cd frontend
npm install
npm run dev
```

The dashboard runs at `http://localhost:3000`.

---

## Demo scenarios

`/test-feed` includes three fixed posts designed to exercise the two-stage pipeline:

1. **`@DeepNet_Ops`** — claims a zero-day exploit with a Pastebin link. Heuristic score is overridden to `0.99` (high). Clicking "Review" sends the text to Gemini for a live verdict.
2. **`@DevTeam_Lead`** — says "we are killing the old auth server," using violent-sounding words in a routine DevOps context. Heuristic score is overridden to `0.72` (elevated, since sentiment analysis alone reads "killing"/"dead" as hostile). This is the scenario that motivates Stage 2: Gemini has the context to recognize DevOps language, which the sentiment heuristic doesn't.
3. **`@Tech_Daily`** — a neutral post about using the product. Uses its raw computed score, not an override.

Since Gemini verification is now a live call, the exact verdict/confidence/explanation for each post depends on what the model returns at request time, not a fixed script.

---

## License

MIT License. Built for the AI Hackathon 2026.
