# 🛡️ NoteBoost 
### **Real-Time Social Threat Intelligence & Automated Triage Engine**

**NoteBoost** is a cybersecurity dashboard that monitors social media signals for coordinated disinformation campaigns, zero-day exploit leaks, and brand reputation threats.

Unlike traditional monitors that rely solely on keywords, NoteBoost uses a **Hybrid Intelligence Engine**:

1. **Speed:** A deterministic heuristic formula filters noise in microseconds.
2. **Intelligence:** A **Gemini 2.0 Flash** agent verifies high-risk threats against ground-truth data (arXiv, CVE databases, internal logs).

---

## 🚀 Key Features

* **Live Threat Monitor (simulated ingestion):** Serves a fixed demo feed through an async pipeline; dashboard metrics (posts scanned, high-risk count, reviews completed, active reviews) are computed from that feed and from live review activity, not hardcoded display values.
* **Mathematical Risk Scoring:** Deterministic S/V/E heuristic runs on every post — see [The Logic](#-the-logic-risk-formula).
* **Agentic Triage:** Clicking "Review" sends the post text to Gemini 2.0 Flash, which returns a verdict, a confidence score, and a one-sentence justification, alongside the underlying S/V/E breakdown and the measured response latency.
* **Dark-Mode Dashboard UI:** Slide-down triage panels per post.
* **Context-aware verification:** Gemini's read is independent of the heuristic score — it can flag something the formula scored low, or clear something it scored high, based on what the text actually says (e.g. recognizing "killing the server" as DevOps shorthand rather than a threat).

---

## 🏗️ Technical Architecture

### **1. The Ingestion Layer (FastAPI)**

* Built on **FastAPI** + **AsyncIO** for non-blocking, high-throughput signal processing.
* Normalizes unstructured social data into a strict JSON schema.
* Simulates "Firehose" velocity with background worker tasks.

### **2. The Detection Layer (Heuristic Engine)**

* **TextBlob NLP:** Calculates Sentiment Polarity (`S`).
* **Velocity Logic:** Tracks interactions per minute (`V`).
* **Evidence Scoring:** Counts links found via regex (`E`) — this is a link-count heuristic, not domain-trust verification; any URL counts the same regardless of the domain.

### **3. The Verification Layer (Generative AI)**

* **Google Gemini 2.0 Flash:** Given the raw post text and a system prompt (no external dataset lookup — it's a single zero-shot call), returns a verdict (`Safe` / `Suspect` / `Malicious`), a confidence score, and a one-sentence justification.
* Escalation is manual: a post only reaches Gemini when someone clicks "Review" in the UI. There's no automatic score threshold that triggers it.

### **4. The Resolution Layer (Next.js)**

* **Next.js 16, React 19:** Client-rendered dashboard.
* **Tailwind CSS 4:** Dark-mode aesthetic.
* **Single fetch, no polling:** The dashboard fetches `/test-feed` once on page load. There is no polling loop or WebSocket — the "live" badges in the UI are static, not a real connection.

---

## 🧮 The Logic: Risk Formula

Threats are prioritized using this risk formula:

```
R = (S × V) / E
```

* **`S` (Sentiment Risk):** TextBlob polarity remapped so hostile/negative text scores near `1.0` and positive/neutral text scores near `0.0`.
* **`V` (Velocity Risk):** `(likes + retweets) / minutes_since_posted`, normalized against an assumed "peak virality" of 50 interactions/minute, capped at `1.0`.
* **`E` (Evidence factor):** Starts at `0.5`, `+0.25` per URL found in the text (any `http(s)://` match), capped at `1.0`. This counts links — it does not check whether a linked domain is trustworthy. Since `E` is the denominator, more links pull the score down and fewer links push it up.

---

## Getting started

### Prerequisites

* Node.js 18+
* Python 3.10+ (the backend uses `str | None` union syntax that requires it)
* A Google Gemini API key — required for `/analyze-threat` to return real results; without it, that endpoint returns a 500

### 1. Clone the repository

```bash
git clone https://github.com/san7iya/NoteBoost.git
cd NoteBoost

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

`/test-feed` includes three fixed posts. Every score below comes straight from the formula — nothing is overridden:

1. **`@DeepNet_Ops`** — claims a zero-day exploit with a Pastebin link, 1,270 likes/retweets combined within 2 minutes. Scores `~1.0`, capped — driven almost entirely by velocity (far past the formula's 50/min "peak" assumption). The link in the text has no `http://` prefix, so it isn't picked up by the evidence regex; `E` sits at its 0.5 baseline. Sentiment (`S`) reads only mildly negative.
2. **`@DevTeam_Lead`** — says "we are killing the old auth server," using violent-sounding words in a routine DevOps context. TextBlob reads this text as close to sentiment-neutral, and engagement is low, so the heuristic itself already scores it low (`~0.02`) — it does not produce a false positive here. It's included in the demo to show Gemini's independent, context-aware read via manual "Review," not to show the heuristic being fooled.
3. **`@Tech_Daily`** — a neutral post about using the product. Scores `~0.0`.

Clicking "Review" on any post sends its text to a live Gemini call — the verdict, confidence, and justification depend on what the model returns at request time, not a fixed script.

---

## License

MIT License. Built for the AI Hackathon 2026.
