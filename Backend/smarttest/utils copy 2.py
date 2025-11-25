import random
from django.core.exceptions import ValidationError
from .models import Question

# Global cooldown for recently used questions
RECENTLY_USED_QUESTIONS = []
MAX_COOLDOWN = 30

# Mapping course level to question level
COURSE_LEVEL_TO_QUESTION_LEVEL = {
    'beginner': 'basic',
    'intermediate': 'medium',
    'advanced': 'hard'
}


def fisher_yates_shuffle(question_list):
    """Shuffles the given list in place using the Fisher-Yates algorithm."""
    for i in range(len(question_list) - 1, 0, -1):
        j = random.randint(0, i)
        question_list[i], question_list[j] = question_list[j], question_list[i]
    return question_list

def get_shuffled_questions(test_attempt):
    # DEBUG: Test if Fisher-Yates actually works
    # test_list = [Question(id=100), Question(id=200), Question(id=300), Question(id=400), Question(id=500)]
    # print(">>> SHUFFLE TEST - Before:", [q.id for q in test_list])
    # fisher_yates_shuffle(test_list)
    # print(">>> SHUFFLE TEST - After: ", [q.id for q in test_list])
    
    """
    Returns a list of 10 shuffled questions for the given TestAttempt.
    
    Handles both practice tests (topic + level) and formal course tests.
    """
    from .models import TestAttempt  # avoid circular import

    if test_attempt.is_practice:
        # ---------------- Practice Test ----------------
        all_questions = list(Question.objects.filter(
            topic=test_attempt.topic,
            level=test_attempt.level
        ).prefetch_related('options'))

        if not all_questions:
            raise ValidationError("No questions available for this topic and level.")

        # Exclude questions used in previous attempts
        previous_attempts = TestAttempt.objects.filter(
            student=test_attempt.student,
            is_practice=True,
            topic=test_attempt.topic,
            level=test_attempt.level
        ).exclude(id=test_attempt.id)

        used_question_ids = set()
        for attempt in previous_attempts:
            used_question_ids.update(attempt.selected_questions.values_list('id', flat=True))

        new_questions = [q for q in all_questions if q.id not in used_question_ids]
        used_questions = [q for q in all_questions if q.id in used_question_ids]

        if len(all_questions) >= 10:
            if len(new_questions) >= 10:
                questions = new_questions
            else:
                questions = new_questions + used_questions[:10 - len(new_questions)]
        else:
            questions = all_questions
        
            # Shuffle selected questions
        fisher_yates_shuffle(questions)
        questions = questions[:10]

    else:
    # ---------------- Formal/Course Test ----------------
        course = test_attempt.test.course
        question_level = COURSE_LEVEL_TO_QUESTION_LEVEL.get(course.level, 'basic') if course else test_attempt.test.level or 'basic'
        course_topics = course.topics.all() if course else []

        all_questions = list(Question.objects.filter(
            topic__in=course_topics,
            level=question_level
        ).prefetch_related('options'))

        if len(all_questions) < 10:
            raise ValidationError("Not enough questions available for this course and level.")

        # Exclude recently used questions
        available_questions = [q for q in all_questions if q.id not in RECENTLY_USED_QUESTIONS]
        # print(">>> DEBUG: available_questions IDs BEFORE shuffle:", [q.id for q in available_questions[:10]] if available_questions else "EMPTY")
        
        # SHUFFLE THE AVAILABLE POOL FIRST
        fisher_yates_shuffle(available_questions)
        # print(">>> DEBUG: available_questions IDs AFTER shuffle:", [q.id for q in available_questions[:10]] if available_questions else "EMPTY")
        # If we have at least 10 unused, take first 10 after shuffle
        if len(available_questions) >= 10:
            questions = available_questions[:10]
            # questions = random.sample(available_questions, 10)
        else:
            # else:
            # print(">>> DEBUG: Falling back to all_questions")
            # print(">>> DEBUG: all_questions IDs BEFORE shuffle:", [q.id for q in all_questions[:10]])
            fisher_yates_shuffle(all_questions)
            # print(">>> DEBUG: all_questions IDs AFTER shuffle:", [q.id for q in all_questions[:10]])
            questions = all_questions[:10]
            # Fallback: shuffle ALL questions (ignore cooldown) and pick 10
            
            fisher_yates_shuffle(all_questions)
            questions = all_questions[:10]
    # Shuffle selected questions
    # fisher_yates_shuffle(questions)
    # questions = questions[:10]    

    # Update global cooldown
    selected_ids = [q.id for q in questions]
    RECENTLY_USED_QUESTIONS.extend(selected_ids)
    if len(RECENTLY_USED_QUESTIONS) > MAX_COOLDOWN:
        del RECENTLY_USED_QUESTIONS[:-MAX_COOLDOWN]

    return questions
