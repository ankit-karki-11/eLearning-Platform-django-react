
import google.generativeai as genai
import os
import requests
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel("gemini-2.5-pro")


# API_URL = f"{BASE_URL}/models/{MODEL}:generateMessage"
# def generate_questions_via_api(topic_title, level, num_questions=5):
#     prompt = (
#         f"Generate {num_questions} subjective questions on the topic "
#         f"'{topic_title}' with difficulty level '{level}'. "
#         "For each question, provide the question text and a correct answer. "
#         "Format each question as follows:\n"
#         "Question: [text]\nAnswer: [correct answer]\n\n"
#     )
#     try:
#         response = model.generate_content(prompt)
#         data = response.text.strip()
#         print(f"Raw Gemini response: {data}")  # Debug
#         questions = []
#         current_question = {}
#         lines = data.split('\n')
#         for i, line in enumerate(lines):
#             if line.startswith('Question:'):
#                 current_question = {'text': line.replace('Question:', '').strip()}
#             elif line.startswith('Answer:'):
#                 current_question['answer'] = line.replace('Answer:', '').strip()
#                 questions.append(current_question)
#                 current_question = {}
#             elif line.strip() and current_question and 'answer' not in current_question:
#                 # Handle multi-line questions
#                 current_question['text'] += ' ' + line.strip()
#             elif line.strip() and 'answer' in current_question:
#                 # Handle multi-line answers
#                 current_question['answer'] += ' ' + line.strip()
#         print(f"Parsed questions: {questions}")  # Debug
#         if len(questions) < num_questions:
#             # Pad with fallback questions if needed
#             questions.extend([
#                 {'text': f"Fallback question {i+1} on {topic_title}", 'answer': 'Please review the topic.'}
#                 for i in range(len(questions), num_questions)
#             ])
#         return questions[:num_questions]
#     except Exception as e:
#         print(f"LLM error: {e}")
#         return [{'text': f"Error generating question: {str(e)}", 'answer': ''} for _ in range(num_questions)]
    
def generate_questions_via_api(topic_title, level, num_questions=5):
    prompt = (
        f"Generate {num_questions} subjective questions on the topic "
        f"'{topic_title}' with difficulty level '{level}'. "
        "For each question, provide the question text and a correct answer. "
        "Format each question as follows:\n"
        "Question: [text]\nAnswer: [correct answer]\n\n"
    )
    try:
        response = model.generate_content(prompt)
        data = response.text.strip()
        print(f"Raw Gemini response: {data}")  # Debug

        questions = []
        current_question = {}
        lines = data.split('\n')

        for line in lines:
            if line.startswith('Question:'):
                current_question = {'question_text': line.replace('Question:', '').strip()}
            elif line.startswith('Answer:'):
                current_question['answer'] = line.replace('Answer:', '').strip()
                if 'question_text' in current_question and current_question['question_text']:
                    # Save only valid question-answer pairs
                    questions.append({
                        'question_text': current_question['question_text'],
                        'answer': current_question['answer']
                    })
                current_question = {}
            elif line.strip() and 'answer' not in current_question and 'text' in current_question:
                current_question['question_text'] += ' ' + line.strip()
            elif line.strip() and 'answer' in current_question:
                current_question['answer'] += ' ' + line.strip()

        # Fill with fallback questions if not enough were parsed
        while len(questions) < num_questions:
            questions.append({
                'question_text': f"Fallback question {len(questions) + 1} on {topic_title}",
                'answer': 'Please review the topic.'
            })

        print(f"Parsed questions: {questions}")  # Debug
        return questions[:num_questions]

    except Exception as e:
        print(f"LLM error: {e}")
        return [{
            'question_text': f"Error generating question: {str(e)}",
            'answer': ''
        } for _ in range(num_questions)]

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
        text = response.text
        print(f"Raw score response: {type(text)} - {text}")  # Debug
        if isinstance(text, tuple):
            print(f"Received tuple: {text}")  # Debug
            text = text[0] if text and len(text) > 0 else ""
        if not isinstance(text, str):
            print(f"Unexpected response type: {type(text)} - {text}")  # Debug
            text = str(text)  # Fallback
        text = text.strip()
        if not text:
            raise ValueError("Empty response from AI")
        lines = text.split('\n')
        score_str = lines[0].strip() if lines else ""
        try:
            score = min(2.0, max(0.0, float(score_str)))
        except ValueError:
            print(f"Invalid score format: {score_str}")  # Debug
            score = 0.0
        comment = '\n'.join(lines[1:]).strip() if len(lines) > 1 else "No additional feedback provided."
        return score, comment
    except Exception as e:
        print(f"Scoring error: {e}")
        return 0.0, f"Could not evaluate this answer: {str(e)}"

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
        prompt += f"\nUnanswered Questions:\n" + "\n".join(f"- {q}" for q in unanswered_questions)

    try:
        response = model.generate_content(prompt)
        text = response.text
        print(f"Raw feedback response: {type(text)} - {text}")  # Debug
        if isinstance(text, tuple):
            print(f"Received tuple: {text}")  # Debug
            text = text[0] if text and len(text) > 0 else ""
        if not isinstance(text, str):
            print(f"Unexpected response type: {type(text)} - {text}")  # Debug
            text = str(text)
        return text.strip()
    except Exception as e:
        print(f"Feedback generation error: {e}")
        return f"Could not generate detailed feedback: {str(e)}"