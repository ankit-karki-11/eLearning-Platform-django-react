
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
    prompt = f"Student has completed the test '{test_title}'. Evaluate their performance based on the answers and provide constructive feedback.\n\n"
    for idx, item in enumerate(answers_with_scores, 1):
        prompt += (
            f"Question {idx}: {item['question']}\n"
            f"Answer: {item['response']}\n"
            f"Marks: {item['score']} out of {item['total']}\n\n"
        )
    prompt += "Provide a brief, helpful feedback in 2-4 sentences."

    response = model.generate_text(prompt=prompt, temperature=0.7, max_output_tokens=512)
    return response.text


# def generate_ai_comment(question, response_text):
#     prompt = (
#         f"Here is a student's answer to the following question:\n"
#         f"Q: {question}\n"
#         f"A: {response_text}\n"
#         f"Provide constructive feedback on the answer. Be concise and helpful."
#     )
#     response = model.generate_text(prompt=prompt, temperature=0.7, max_output_tokens=256)
#     return response.text

def generate_ai_score_and_comment(question, response_text):
    prompt = (
        f"Question: {question}\n"
        f"Student's answer: {response_text}\n"
        "Score this answer from 0 to 2, where 0=incorrect, 1=partially correct, and 2=fully correct. "
        "You can use decimal scores like 0.5 or 1.5 to reflect partial credit. "
        "Provide only the numeric score followed by a short constructive comment explaining the score."
    )

    response = model.generate_text(prompt=prompt, temperature=0.5, max_output_tokens=64)
    text = response.text.strip()

    # Parse the score from AI's response, assume format: "2\nGood answer..."
    try:
        lines = text.split('\n')
        score = float(lines[0].strip())
        comment = "\n".join(lines[1:]).strip()
    except Exception:
        score = 0.0
        comment = "Could not evaluate answer."

    return score, comment
