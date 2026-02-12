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

## 🛠️ Getting Started

### **Prerequisites**

* Node.js 18+
* Python 3.9+
* Google Gemini API Key

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/noteboost.git
cd noteboost

```

### **2. Backend Setup (FastAPI)**

```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API Server
uvicorn main:app --reload

```

*The backend will run at `http://localhost:8000`. API Docs available at `/docs`.*

### **3. Frontend Setup (Next.js)**

```bash
# Open a new terminal
cd ..
npm install

# Start the Development Server
npm run dev

```

*The dashboard will launch at `http://localhost:3000`.*

---

## 🧪 Usage / Demo Scenarios

The system includes a **Simulation Mode** to demonstrate detection capabilities:

1. **The Villain (@DeepNet_Ops):**
* **Scenario:** A tweet claims a "Zero-Day Exploit" with a Pastebin link.
* **Result:** Risk Score **0.99**.
* **Action:** Click "Review". Gemini identifies the CVE pattern and flags as **MALICIOUS**.


2. **The False Positive (@DevTeam_Lead):**
* **Scenario:** A dev says, "We are killing the server."
* **Result:** Risk Score **0.72** (High Sentiment).
* **Action:** Click "Review". Gemini recognizes "DevOps Context" and flags as **SAFE**.



---

## 📜 License

MIT License. Built for the AI Hackathon 2026.
