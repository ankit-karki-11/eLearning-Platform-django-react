# utils.py
import random
from .models import Question

def fisher_yates_shuffle(question_list):
    """
    Applies the Fisher-Yates shuffle algorithm to a list in place.
    Although Python's random.shuffle uses Fisher-Yates internally,
    this explicit function makes the intent clear and allows for
    potential future modifications or logging.
    Args:
        question_list (list): A list of Question model instances.
    Returns:
        list: The shuffled list (same object, modified in place).
    """
    # Implementation of the modern Fisher-Yates shuffle
    for i in range(len(question_list) - 1, 0, -1):
        j = random.randint(0, i)
        question_list[i], question_list[j] = question_list[j], question_list[i]
    return question_list

def get_random_questions(topic, level, count=10):
    """
    Selects a specified number of random questions for a given topic and level.
    Args:
        topic (Topic): The Topic instance.
        level (str): The difficulty level (e.g., 'basic', 'medium', 'hard').
        count (int): The number of questions to select. Defaults to 10.
    Returns:
        list: A list of 'count' randomly selected Question instances.
    Raises:
        ValueError: If not enough questions are available.
    """
    questions_queryset = Question.objects.filter(topic=topic, level=level)
    questions_list = list(questions_queryset)

    if len(questions_list) < count:
        raise ValueError(f"Not enough questions available for {topic.title} - {level}. Found {len(questions_list)}, need at least {count}.")

    # Apply Fisher-Yates shuffle
    fisher_yates_shuffle(questions_list)

    # Select the first 'count' questions
    return questions_list[:count]

# Make sure to import the Question model if you put this in utils
# You might need to adjust the import depending on your project structure
# e.g., from .models import Question
# For now, we'll handle the import in the viewset to avoid circular imports for this example.