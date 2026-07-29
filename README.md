# NoteBoost

**A two-stage triage pipeline for social media posts: a fast heuristic score, followed by LLM-based verification on demand.**

NoteBoost scores incoming posts for coordinated-disinformation / exploit-leak / brand-risk signals using a deterministic heuristic formula, then lets an analyst escalate any post to a Gemini 2.0 Flash call for a second opinion that accounts for context the heuristic can't (e.g. "killing the server" is DevOps slang, not a threat).

---

## How it works

**Stage 1 — Heuristic score (always computed, runs in milliseconds).**
Every post gets an `S` (sentiment), `V` (velocity), and `E` (evidence) score from `calculate_sve_score()` in [backend/main.py](backend/main.py), combined into a single risk score. See [The scoring formula](#the-scoring-formula) below.

**Stage 2 — Gemini verification (triggered manually, per post).**
Clicking "Review" on a post sends its text to `POST /analyze-threat`, which calls **Gemini 2.0 Flash** with a system prompt asking for a verdict (`Safe` / `Suspect` / `Malicious`), a confidence score, and a one-sentence justification. The response is rendered in the triage panel. This is a real model call — it requires a `GEMINI_API_KEY` to function, and the verdict is whatever Gemini actually returns, not a canned response.

There's no automatic threshold that triggers Stage 2 — escalation is a manual, per-post action in the UI.

---

## What's real vs. what's simulated

This is a demo-scoped project, and some pieces stand in for infrastructure that isn't in place. To be specific about which is which:

| Component | Status |
|---|---|
| SVE heuristic formula | **Real.** Runs on every post, computed from the actual post text/engagement numbers. |
| Gemini 2.0 Flash verification | **Real**, given a valid API key — a live model call, not a canned response. |
| `/fetch-following` (Xpoz integration) | **Real.** Calls an external MCP service to fetch a user's X/Twitter following graph. Not currently wired into the dashboard UI. |
| The feed itself (`/test-feed`) | **Simulated.** Serves a fixed, hardcoded set of three posts written to walk through specific scenarios — not a live social media firehose. |
| Two of those three posts' risk scores | **Manually overridden.** The heuristic runs on them, but their S/V/E outputs are then forced to fixed demo values (0.99 and 0.72) regardless of what the formula computes, so the walkthrough is reproducible. Only the third post uses its raw computed score. |
| "Live" feed loading | **Not live.** The dashboard fetches `/test-feed` once on page load. There is no polling loop and no WebSocket. |
| Background console log ("ingestion" simulator) | **Simulated**, and cosmetic — a background `asyncio` task in `main.py` prints randomized log lines to the server's own terminal for effect. It isn't exposed through any API. |
| "Live Log" panels in the UI (Sidebar, RightPanel, LiveLogs) | **Static.** These render hardcoded sample text — they are not connected to the backend's log task or to any real data. |

---

## The scoring formula

Implemented in `calculate_sve_score()`:

* **S (sentiment risk)** — TextBlob polarity, remapped so hostile/negative text scores near `1.0` and positive/neutral text scores near `0.0`: `S = (1 - polarity) / 2`.
* **V (velocity risk)** — `(likes + retweets) / minutes_since_posted`, normalized against an assumed "peak virality" of 50 interactions/minute and capped at `1.0`.
* **E (evidence factor)** — starts at `0.5`, `+0.25` per URL found in the text (any `http(s)://` match), capped at `1.0`. This is a **link-count heuristic, not domain verification** — it doesn't check whether a linked domain is trustworthy (e.g. a Pastebin link scores the same as a CVE database link).

Final score:

```
R = min((S × V) / E, 1.0)
```

`E` sits in the denominator, so a post with more links pulls the score down, and a post with high sentiment/velocity but no links pulls it up.

---

## Architecture

**Backend — FastAPI + AsyncIO**
* `GET /test-feed` — returns the fixed three-post demo dataset with computed SVE scores (see overrides above).
* `POST /analyze-threat` — sends post text to Gemini 2.0 Flash, returns `{ verdict, confidence, explanation }`.
* `GET /fetch-following` — calls the Xpoz MCP service to resolve a user's X/Twitter following list (polls an async operation ID until it completes). Standalone; not called from the current frontend.
* A background task prints simulated ingestion log lines to the server console on startup (cosmetic, see above).

**Frontend — Next.js 16, React 19, Tailwind CSS 4**
* Dashboard fetches `/test-feed` once on mount and renders each post as a `ThreatCard`.
* Clicking "Review" on a card calls `/analyze-threat` and renders the result in a `GeminiTriagePanel`.
* Metric tiles (tweets scanned, high-risk flags, RAG tasks) are hardcoded display values, not fetched from the backend.

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

`/test-feed` includes three fixed posts designed to exercise the two-stage pipeline:

1. **`@DeepNet_Ops`** — claims a zero-day exploit with a Pastebin link. Heuristic score is overridden to `0.99` (high). Clicking "Review" sends the text to Gemini for a live verdict.
2. **`@DevTeam_Lead`** — says "we are killing the old auth server," using violent-sounding words in a routine DevOps context. Heuristic score is overridden to `0.72` (elevated, since sentiment analysis alone reads "killing"/"dead" as hostile). This is the scenario that motivates Stage 2: Gemini has the context to recognize DevOps language, which the sentiment heuristic doesn't.
3. **`@Tech_Daily`** — a neutral post about using the product. Uses its raw computed score, not an override.

Since Gemini verification is now a live call, the exact verdict/confidence/explanation for each post depends on what the model returns at request time, not a fixed script.

---

## License

MIT License. Built for the VIT AI Hackathon by SCOPE, 2026.
