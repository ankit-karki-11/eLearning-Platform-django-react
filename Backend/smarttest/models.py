from django.db import models
from users.models import UserAccount
from django.utils import timezone
import random

class Topic(models.Model):
    title= models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
    
    
class Question(models.Model):
    LevelChoices = [
        ('basic', 'Basic'),
        ('medium', 'Medium'),  
        ('hard', 'Hard'),
    ]

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions', default=1)
    question_text = models.TextField()
    level = models.CharField(max_length=10, choices=LevelChoices, default='basic')
    marks = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.topic.title} - Q{self.id}"

    class Meta:
        # ordering = ['id']
        pass

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question.id} - Option: {self.option_text[:50]}"

COURSE_LEVEL_TO_QUESTION_LEVEL= {
    'beginner':'basic',
    'intermediate':'medium',
    'advanced':'hard'
}
from main.models import Course
class Test(models.Model):
    LEVEL_CHOICES = [
        ('basic', 'Basic'),
        ('medium', 'Medium'),  
        ('hard', 'Hard'),
    ]
    
    
    title = models.CharField(max_length=255)    
    course=models.ForeignKey(Course, on_delete=models.CASCADE, related_name='tests' , null=True, blank=True)
    # topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='tests')
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, help_text="Level of the questions in this test")
    time_limit = models.PositiveIntegerField(default=20, help_text="Time limit in minutes")
    created_by = models.ForeignKey(
        UserAccount, 
        on_delete=models.SET_NULL, 
        null=True, 
        limit_choices_to={'role': 'admin'}
    )
    is_practice = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
    #    auto set level for formal course tests
        if self.course and not self.level:
            self.level=COURSE_LEVEL_TO_QUESTION_LEVEL.get(self.course.level,'basic')
        super().save(*args, **kwargs)

    def __str__(self):
        # return f"{self.title} - {self.topic.title} ({self.level})"
        if self.is_practice:
                # return f"Practice Test: {self.title}"
                return f"{self.title} - ({self.level})"
        return f"Course Test: {self.title} ({self.course.title if self.course else 'No course'})"
    
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import UserAccount
from .models import Topic, Question
from .utils import get_shuffled_questions 

class TestAttempt(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
    ]

    title = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    student = models.ForeignKey(UserAccount, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})

    # Test and practice configuration
    test = models.ForeignKey('Test', on_delete=models.CASCADE, null=True, blank=True)
    topic = models.ForeignKey('Topic', on_delete=models.SET_NULL, null=True, blank=True)
    level = models.CharField(max_length=10, choices=Question.LevelChoices, null=True, blank=True)
    is_practice = models.BooleanField(default=False)

    time_limit = models.PositiveIntegerField(
        null=False,
        blank=True,
        default=20,
        help_text="Time limit in minutes (applies to both practice and formal tests)"
    )
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)

    selected_questions = models.ManyToManyField('Question', blank=True)
    total_score = models.FloatField(default=0.0)
    feedback = models.TextField(blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        if self.is_practice:
            return f"{self.student.full_name}'s Practice: {self.topic.title if self.topic else 'No Topic'}"
        return f"{self.student.full_name} - {self.test.title if self.test else 'No Test'}"

    def clean(self):
        if self.is_practice:
            if not (self.topic and self.level):
                raise ValidationError("Practice tests require both topic and level")
            if self.test:
                raise ValidationError("Practice tests cannot be linked to formal tests")
        else: 
            if not self.test:
                raise ValidationError("Formal tests must be linked to a Test object")
            if self.test.course and not self.level:
                self.level = self.test.level

    def start_attempt(self):
        """Initialize test attempt and assign randomized questions"""
        if not self.selected_questions.exists():
            # Calling the utility function from smartest/utils.py
            questions = get_shuffled_questions(self)
            self.selected_questions.set(questions)
        self.save()

    def time_remaining(self):
        """Return remaining time in minutes"""
        if not self.time_limit or not self.started_at:
            return None
        elapsed = (timezone.now() - self.started_at).total_seconds() / 60
        return max(0, self.time_limit - elapsed)
    
    def is_submitted(self):
        return self.status == 'submitted'

    def generate_feedback(self):
        if not self.feedback:
            self.feedback = (
                "Excellent! Perfect score!" if self.total_score >= 90 else
                "Good job! You passed." if self.total_score >= 70 else
                "Keep practicing! Review the material and try again."
            )
        self.save()


from django.core.exceptions import ValidationError
class Result(models.Model):
    attempt=models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='results')
    question=models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    scored_marks = models.FloatField(default=0)
    
    def __str__(self):
        return f"Result by {self.attempt.student.full_name} - Q: {self.question.id}"
    def clean(self):
        if self.attempt.is_submitted():
            raise ValidationError("Cannot modify answers after test submission")
    
    def save(self, *args, **kwargs):
        self.clean()  # Call validation before saving
        super().save(*args, **kwargs)
        
