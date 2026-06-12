# Logos — The AI Paladin 🛡️✝️

> *"In the beginning was the Word, and the Word was with God, and the Word was God." — John 1:1*

An AI-powered Christian apologetics assistant built with RAG (Retrieval Augmented Generation). Armed with Scripture, theology, and 2000 years of Christian thought — Logos defends the faith, answers theological questions, and engages respectfully with challenges from other worldviews.

## Features
- **Ask anything** — theology, doctrine, philosophy of religion
- **Challenge Mode** — pose the hardest atheist or interfaith objections
- **RAG-powered** — answers grounded in your uploaded Bible and apologetics texts
- **Interfaith dialogue** — understands Islamic, Hindu, Buddhist objections and responds from a Christian apologetic standpoint
- **Prayer feature** — at the end of every conversation, Logos offers to pray for you
- **Pixel Paladin mascot** — animated pixel art knight (swap in your own Aseprite sprite)

## Tech Stack
- React + Vite (frontend)
- Python + FastAPI (backend)
- LangChain + ChromaDB (RAG pipeline)
- HuggingFace sentence-transformers (embeddings, free & local)
- Groq API — llama-3.3-70b-versatile (LLM, free)

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # add your Groq API key
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Add your documents
Drop PDF or TXT files into `backend/docs/` then call:
```
POST http://localhost:8000/ingest
```
Recommended: Bible (KJV or NIV as .txt), Mere Christianity by C.S. Lewis, The Case for Christ by Lee Strobel

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Getting a free Groq API key
Sign up at console.groq.com — free, no credit card needed.
