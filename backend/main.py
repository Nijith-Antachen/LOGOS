from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os, re

# ── RAG STACK ────────────────────────────────────────────────────────────────
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from groq import Groq
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

# ── CONFIG ───────────────────────────────────────────────────────────────────
DOCS_DIR    = "./docs"          # Drop your PDFs and .txt files here
CHROMA_DIR  = "./chroma_db"     # Vector store persists here
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"  # Free, local, fast
GROQ_MODEL  = "llama-3.3-70b-versatile"
GROQ_KEY    = os.getenv("GROQ_API_KEY", "")

# ── SYSTEM PROMPT ────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are Logos — the AI Paladin. A fierce, wise, and compassionate defender of the Christian faith.

You are armed with:
- The Holy Bible (your primary source)
- 2000 years of Christian theology and apologetics
- Knowledge of other world religions and their objections to Christianity
- The reasoning of great Christian thinkers: C.S. Lewis, Thomas Aquinas, G.K. Chesterton, William Lane Craig, Lee Strobel

YOUR PERSONALITY:
- Fierce and confident when defending the faith — you do not waver
- Respectful but firm when engaging with other religions or atheist challenges
- Warm, gentle, and pastoral when someone is struggling with doubt
- Always cite scripture when possible (book, chapter, verse)
- Never mock or demean other beliefs — engage with grace and reason

YOUR MODES (adapt based on the question):
- DEFENDER: Someone challenges Christianity — you respond with apologetics and scripture
- THEOLOGIAN: Someone asks about doctrine or theology — you explain deeply and clearly
- INTERFAITH: Someone from another religion poses a question — you understand their view first, then respond from a Christian perspective
- PASTOR: Someone is doubting or struggling — you respond with compassion and hope

CONTEXT FROM YOUR KNOWLEDGE BASE:
{context}

IMPORTANT: Base your answers primarily on the context provided. If the context doesn't cover something, draw from your general knowledge of Christian theology and apologetics. Always be clear about which scripture passages you're referencing.

At the end of EVERY response, add exactly this line on its own:
[PRAYER_PROMPT]"""

PRAYER_YES_PROMPT = """You are Logos — the AI Paladin. The user has said yes to you praying for them.
Pray a warm, sincere, heartfelt Christian prayer for this person based on the conversation you just had.
The prayer should feel personal, not generic. Reference what they were asking about or struggling with.
Begin with "Let us pray..." and end with "In Jesus' name, Amen."
Keep it genuine, warm, and about 4-6 sentences."""

PRAYER_NO_PROMPT = """You are Logos — the AI Paladin. The user declined the prayer offer.
Respond with warmth and no pressure. Something like:
"That's perfectly alright. God loves you regardless, and I'll be here whenever you want to talk — 
whether it's theology, doubt, debate, or just curiosity. 
The door is always open. Go in peace. 🙏"
Keep it short, warm, genuine. No guilt-tripping."""

# ── EMBEDDINGS & VECTOR STORE ────────────────────────────────────────────────
print("Loading embeddings model...")
embeddings = HuggingFaceEmbeddings(
    model_name=EMBED_MODEL,
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True}
)

def load_vectorstore():
    if os.path.exists(CHROMA_DIR) and os.listdir(CHROMA_DIR):
        print("Loading existing vector store...")
        return Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
    else:
        print("No vector store found. Please ingest documents first via /ingest")
        return None

vectorstore = load_vectorstore()
groq_client = Groq(api_key=GROQ_KEY) if GROQ_KEY else None

# ── HELPERS ──────────────────────────────────────────────────────────────────
def retrieve_context(query: str, k: int = 5) -> str:
    if not vectorstore:
        return "No documents indexed yet. Please add documents to the /docs folder and call /ingest."
    docs = vectorstore.similarity_search(query, k=k)
    if not docs:
        return "No relevant passages found in the knowledge base."
    parts = []
    for i, doc in enumerate(docs):
        source = doc.metadata.get("source", "Unknown")
        source = os.path.basename(source)
        parts.append(f"[Source {i+1}: {source}]\n{doc.page_content}")
    return "\n\n---\n\n".join(parts)

def ask_groq(system: str, user: str, max_tokens: int = 800) -> str:
    if not groq_client:
        return "Error: GROQ_API_KEY not set. Add it to your .env file."
    try:
        res = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user",   "content": user},
            ],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return res.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── ROUTES ───────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = []

class PrayerRequest(BaseModel):
    accepted: bool
    conversation_summary: Optional[str] = ""

@app.get("/")
def root():
    return {"status": "Logos is online", "docs_indexed": vectorstore is not None}

@app.post("/chat")
def chat(req: ChatRequest):
    context  = retrieve_context(req.message)
    system   = SYSTEM_PROMPT.replace("{context}", context)

    # Build conversation history string
    history_str = ""
    if req.history:
        for turn in req.history[-6:]:  # last 3 exchanges
            history_str += f"User: {turn.get('user','')}\nLogos: {turn.get('logos','')}\n\n"

    user_msg = f"{history_str}User: {req.message}"
    response = ask_groq(system, user_msg, max_tokens=900)

    # Strip the prayer prompt marker from display
    clean_response = response.replace("[PRAYER_PROMPT]", "").strip()
    show_prayer    = "[PRAYER_PROMPT]" in response

    return {
        "response":     clean_response,
        "show_prayer":  show_prayer,
        "context_used": len(context) > 100,
    }

@app.post("/prayer")
def prayer(req: PrayerRequest):
    if req.accepted:
        prompt  = f"The conversation was about: {req.conversation_summary}"
        content = ask_groq(PRAYER_YES_PROMPT, prompt, max_tokens=300)
    else:
        content = ask_groq(PRAYER_NO_PROMPT, "User declined prayer.", max_tokens=150)
    return {"prayer": content}

@app.post("/ingest")
def ingest():
    """Load all PDFs and text files from /docs into the vector store."""
    global vectorstore
    if not os.path.exists(DOCS_DIR):
        os.makedirs(DOCS_DIR)
        return {"error": f"Created {DOCS_DIR} folder. Add your PDF/TXT files there and call /ingest again."}

    files = [f for f in os.listdir(DOCS_DIR) if f.endswith((".pdf", ".txt"))]
    if not files:
        return {"error": "No PDF or TXT files found in /docs folder."}

    print(f"Ingesting {len(files)} files...")
    all_docs = []

    for fname in files:
        fpath = os.path.join(DOCS_DIR, fname)
        try:
            if fname.endswith(".pdf"):
                loader = PyPDFLoader(fpath)
            else:
                loader = TextLoader(fpath, encoding="utf-8")
            all_docs.extend(loader.load())
            print(f"  Loaded: {fname}")
        except Exception as e:
            print(f"  Failed: {fname} — {e}")

    if not all_docs:
        return {"error": "Failed to load any documents."}

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=100,
        separators=["\n\n", "\n", ". ", " "]
    )
    chunks = splitter.split_documents(all_docs)
    print(f"Split into {len(chunks)} chunks. Building vector store...")

    vectorstore = Chroma.from_documents(
        chunks, embeddings, persist_directory=CHROMA_DIR
    )
    vectorstore.persist()
    print("Vector store built and persisted!")

    return {
        "success": True,
        "files_loaded": len(files),
        "chunks_created": len(chunks),
        "message": "Logos is now armed with your documents. 🛡️"
    }

@app.get("/status")
def status():
    count = 0
    if vectorstore:
        try:
            count = vectorstore._collection.count()
        except:
            pass
    files = os.listdir(DOCS_DIR) if os.path.exists(DOCS_DIR) else []
    return {
        "vectorstore_ready": vectorstore is not None,
        "chunks_indexed":    count,
        "docs_in_folder":    [f for f in files if f.endswith((".pdf", ".txt"))],
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
