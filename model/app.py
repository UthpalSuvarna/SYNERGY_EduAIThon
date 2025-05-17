from flask import Flask, request, jsonify
import pdfplumber
import requests
from flask_cors import CORS
import os
import google.generativeai as genai
import re
from io import BytesIO

# Set your API key
GOOGLE_API_KEY = 'Your_api_key'  # Replace with your real key
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

app = Flask(__name__)
CORS(app, origins=["http://localhost:4040", "https://73a0-103-213-211-203.ngrok-free.app"])

@app.route('/upload', methods=['POST'])
def upload_pdf_url():
    data = request.get_json()
    pdf_url = data.get('pdfUrl')

    if not pdf_url:
        return jsonify({'error': 'No PDF URL provided'}), 400

    try:
        # Download the PDF file from the URL
        response = requests.get(pdf_url)
        response.raise_for_status()
        pdf_file = BytesIO(response.content)

        with pdfplumber.open(pdf_file) as pdf:
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

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    topic = data.get('topic')
    pdf_url = data.get('pdfUrl')

    if not topic:
        return jsonify({'error': 'No topic provided'}), 400
    if not pdf_url:
        return jsonify({'error': 'No PDF URL provided'}), 400

    try:
        # Download and extract content from the PDF
        response = requests.get(pdf_url)
        response.raise_for_status()
        pdf_file = BytesIO(response.content)

        with pdfplumber.open(pdf_file) as pdf:
            content = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())

        # Limit content length for the prompt
        content_excerpt = content[:3000]

        quiz_prompt = f"""
        Based on the topic "{topic}" and the following content, generate 10 multiple-choice questions.

        Content:
        {content_excerpt}

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

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=4040)
