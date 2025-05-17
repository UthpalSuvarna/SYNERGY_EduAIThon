from flask import Flask, request, jsonify
import pdfplumber
from flask_cors import CORS
import os
import google.generativeai as genai
import re
from werkzeug.utils import secure_filename

# Set your API key
GOOGLE_API_KEY = 'AIzaSyCTyBBU8fzJ_TQuQkop-beH9IlzyyuVlkc'  # <-- Replace this with your real key
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://90d3-103-117-238-194.ngrok-free.app"])
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    with pdfplumber.open(filepath) as pdf:
        content = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())

    topic_prompt = f"""
    Extract the main topics from the following content and provide a numbered list:

    {content[:3000]}
    """
    response = model.generate_content(topic_prompt)
    topics_text = response.text.strip()
    topics = re.findall(r'\d+\.\s+(.*)', topics_text)

    return jsonify({
        'topics_text': topics_text,
        'topics': topics
    })

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    topic = data.get('topic')
    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    quiz_prompt = f"""
    Generate 10 multiple-choice questions based on the topic: {topic}

    For each question, provide:
    - The question text
    - Four options labeled A, B, C, and D
    - Indicate the correct answer

    Format:

    Q1. Question text?
    A. Option A
    B. Option B
    C. Option C
    D. Option D
    Answer: B
    """
    quiz_response = model.generate_content(quiz_prompt)
    quiz_text = quiz_response.text.strip()

    return jsonify({'quiz': quiz_text})

if __name__ == '__main__':
    app.run(port=4040)
