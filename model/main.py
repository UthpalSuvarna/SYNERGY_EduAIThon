import os
import fitz  # PyMuPDF
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize app and models
app = Flask(__name__)
embedder = SentenceTransformer("all-MiniLM-L6-v2")
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# ---- Helper Functions ----

def extract_text_from_pdf(file_stream) -> str:
    try:
        doc = fitz.open(stream=file_stream.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        raise ValueError(f"Failed to process PDF: {str(e)}")

def chunk_text(text: str, max_words=500):
    words = text.split()
    return [" ".join(words[i:i + max_words]) for i in range(0, len(words), max_words)]

def get_chunk_titles(chunks, max_len=15):
    titles = []
    for chunk in chunks:
        first_sentence = chunk.split(".")[0]
        if len(first_sentence.split()) > max_len:
            title = " ".join(first_sentence.split()[:max_len]) + "..."
        else:
            title = first_sentence
        titles.append(title)
    return titles

def generate_flashcards(subtopic_text: str, n=10):
    prompt = f"""
You are a helpful assistant. Generate {n} flashcards for the following subtopic from a PDF. 
Each flashcard should be a question and answer pair, formatted as:
Q: <question>
A: <answer>

Subtopic:
{subtopic_text}
"""
    response = gemini_model.generate_content(prompt)
    flashcards = []
    lines = response.text.strip().split("\n")
    q, a = None, None
    for line in lines:
        if line.startswith("Q:"):
            q = line[2:].strip()
        elif line.startswith("A:"):
            a = line[2:].strip()
            if q and a:
                flashcards.append({"question": q, "answer": a})
                q, a = None, None
    return flashcards

# ---- Flask Routes ----

@app.route("/generate_flashcards", methods=["POST"])
def generate_flashcards_route():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    pdf = request.files['pdf']
    chunk_index = int(request.form.get("chunk_index", 0))
    n = int(request.form.get("n", 10))

    if not pdf.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported."}), 400

    try:
        text = extract_text_from_pdf(pdf)
        chunks = chunk_text(text)

        if chunk_index >= len(chunks) or chunk_index < 0:
            return jsonify({"error": "Invalid chunk index."}), 400

        selected_chunk = chunks[chunk_index]
        flashcards = generate_flashcards(selected_chunk, n)

        return jsonify({
            "chunk_index": chunk_index,
            "chunk_preview": selected_chunk[:200] + "...",
            "flashcards": flashcards
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_chunks", methods=["POST"])
def get_chunks_route():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    pdf = request.files['pdf']
    if not pdf.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported."}), 400

    try:
        text = extract_text_from_pdf(pdf)
        chunks = chunk_text(text)
        titles = get_chunk_titles(chunks)
        return jsonify({"total_chunks": len(chunks), "titles": titles})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Entry Point ----

if __name__ == "__main__":
    app.run(debug=True, port=8000)
