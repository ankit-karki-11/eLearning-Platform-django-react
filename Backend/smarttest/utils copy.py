
import google.generativeai as genai
import os
import requests
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel("gemini-2.5-pro")


# API_URL = f"{BASE_URL}/models/{MODEL}:generateMessage"
def generate_questions_via_api(topic_title, level, num_questions=5):
    prompt = (
        f"Generate {num_questions} subjective questions on the topic "
        f"'{topic_title}' with difficulty level '{level}'. "
        "For each question, provide the question text and a correct answer. "
        "Format as: Question: [text]\nAnswer: [correct answer]\n"
    )
    try:
        response = model.generate_content(prompt)
        data = response.text
        questions = []
        current_question = {}
        for line in data.split('\n'):
            if line.startswith('Question:'):
                current_question = {'text': line.replace('Question:', '').strip()}
            elif line.startswith('Answer:'):
                current_question['answer'] = line.replace('Answer:', '').strip()
                questions.append(current_question)
        return questions[:num_questions]
    except Exception as e:
        print("LLM error:", e)
        return [{'text': 'Error: API request failed.', 'answer': ''}]

def generate_feedback(test_title, answers_with_scores, unanswered_questions):
    prompt = f"""You are an experienced educator evaluating a student's test performance.

Test: {test_title}
Total Score: {sum(a['score'] for a in answers_with_scores)}/{sum(a['total'] for a in answers_with_scores)}

Provide detailed feedback covering:
1. Overall performance summary, focusing on the quality of answers (accuracy, completeness, clarity).
2. Key strengths demonstrated in answered questions.
3. Main areas needing improvement, including unanswered questions.
4. Specific recommendations for each weak area and unanswered questions (e.g., topics to study, resources to review).
5. Encouraging closing remarks to motivate the student for the next test.

Structure your response with clear sections. Be constructive and supportive.

Question-by-question analysis:
"""
    for idx, item in enumerate(answers_with_scores, 1):
        prompt += f"""
Question {idx}: {item['question']}
- Correct Answer: {item['correct_answer']}
- Student's Answer: {item['response'] or 'Not answered'}
- Score: {item['score']}/{item['total']}
"""
    if unanswered_questions:
        prompt += f"\nUnanswered Questions:\n" + "\n".join(
            f"- {q}" for q in unanswered_questions
        )

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("Feedback generation error:", e)
        return "Could not generate detailed feedback. Please consult your instructor."

def generate_ai_score_and_comment(question, correct_answer, response_text):
    prompt = f"""Evaluate this test answer according to the rubric below:

Question: {question}
Correct Answer: {correct_answer}
Student's Answer: {response_text or 'Not answered'}

Scoring Rubric:
2.0 - Complete, accurate, and demonstrates deep understanding
1.5 - Mostly correct with minor inaccuracies
1.0 - Partially correct but missing key elements
0.5 - Shows some relevant knowledge but largely incorrect
0.0 - Completely incorrect or irrelevant (including unanswered questions)

Provide:
1. Exact score (0.0-2.0 in 0.5 increments) on first line
2. Specific feedback explaining the score on subsequent lines:
- What was done well (if answered)
- What needs improvement (if answered) or why answering is important (if unanswered)
- How to improve for full marks (e.g., study specific topics or concepts)
"""
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        first_line = text.split('\n')[0]
        score = min(2.0, max(0.0, float(first_line)))
        comment = '\n'.join(text.split('\n')[1:]).strip()
        return score, comment
    except Exception as e:
        print("Scoring error:", e)
        return 0.0, "Could not evaluate this answer automatically."