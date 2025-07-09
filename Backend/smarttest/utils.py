
import google.generativeai as genai
import os
import requests
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel("gemini-2.5-pro")


# API_URL = f"{BASE_URL}/models/{MODEL}:generateMessage"
def generate_questions_via_api(topic_title,level,num_questions=5):
    prompt = (
        f"Generate {num_questions} subjective questions on the topic "
        f"'{topic_title}' with difficulty level '{level}'. "
        "Provide questions only. Do not include any other information."
    )
    try:
        response = model.generate_content(prompt)
        data = response.text
        # text = data.get('generated_text', '') or data.get('choices', [{}])[0].get('text', '')
        questions = [q.strip() for q in data.split('\n') if q.strip()]
        return questions[:num_questions]
    except Exception as e:
        print("LLM error:", e)
        return ['Error: API request failed.']

def generate_feedback(test_title, answers_with_scores):
    prompt = f"""You are an experienced educator evaluating a student's test performance.
    
Test: {test_title}
Total Score: {sum(a['score'] for a in answers_with_scores)}/{sum(a['total'] for a in answers_with_scores)}

Provide detailed feedback covering:
1. Overall performance summary
2. Key strengths demonstrated
3. Main areas needing improvement
4. Specific suggestions for each weak area
5. Encouraging closing remarks

Structure your response with clear sections. Be constructive and supportive.

Question-by-question analysis:
"""
    
    for idx, item in enumerate(answers_with_scores, 1):
        prompt += f"""
Question {idx}: {item['question']}
- Student's Answer: {item['response']}
- Score: {item['score']}/{item['total']}
"""
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("Feedback generation error:", e)
        return "Could not generate detailed feedback. Please consult your instructor."


def generate_ai_score_and_comment(question, response_text):
    prompt = f"""Evaluate this test answer according to the rubric below:

    Question: {question}
    Student's Answer: {response_text}

    Scoring Rubric:
    2.0 - Complete, accurate, and demonstrates deep understanding
    1.5 - Mostly correct with minor inaccuracies
    1.0 - Partially correct but missing key elements
    0.5 - Shows some relevant knowledge but largely incorrect
    0.0 - Completely incorrect or irrelevant

    Provide:
    1. Exact score (0.0-2.0 in 0.5 increments) on first line
    2. Specific feedback explaining the score on subsequent lines:
    - What was done well
    - What needs improvement
    - How to improve for full marks

    Example:
    1.5
    Your answer covered the main concepts but missed one key detail about...
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Improved parsing
        first_line = text.split('\n')[0]
        score = min(2.0, max(0.0, float(first_line)))  # Clamp score between 0-2
        comment = '\n'.join(text.split('\n')[1:]).strip()
        
        return score, comment
    except Exception as e:
        print("Scoring error:", e)
        return 0.0, "Could not evaluate this answer automatically."