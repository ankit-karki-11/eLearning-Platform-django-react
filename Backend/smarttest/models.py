from django.db import models
from users.models import UserAccount
# from django.utils import timezone

# Create your models here.
class Topic(models.Model):
    title= models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
    
class Test(models.Model):
    LevelChoices = [
        ('basic', 'Basic'),
        ('medium', 'Medium'),  
        ('hard', 'Hard'),
    ]
    
    title= models.CharField(max_length=255)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='tests')
    level= models.CharField(max_length=10, choices=LevelChoices, default='basic')
    time_limit = models.PositiveIntegerField(default=10,help_text="Time limit in minutes")
    created_by= models.ForeignKey(UserAccount, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'admin'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    marks=models.PositiveIntegerField(default=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.test.title} - Q{self.id}"
    
class TestAttempt(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    student = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='test_attempts', limit_choices_to={'role': 'student'})
    test=models.ForeignKey(Test, on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    total_score = models.FloatField(default=0.0)
    feedback = models.TextField(blank=True) #feedback for full test attempt
 
    def __str__(self):
        return f"{self.student.full_name} - {self.test.title}"
    
from django.core.exceptions import ValidationError
class Answer(models.Model):
    attempt=models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='answers')
    question=models.ForeignKey(Question, on_delete=models.CASCADE)
    response= models.TextField()
    scored_marks = models.FloatField(default=0) #marks on each question
    ai_comment = models.TextField(null=True, blank=True)
     
    def __str__(self):
        return f"Answer by {self.attempt.student.full_name} - Q: {self.question.id}"
    def clean(self):
        if self.attempt.is_submitted():
            raise ValidationError("Cannot modify answers after test submission")
    
    def save(self, *args, **kwargs):
        self.clean()  # Call validation before saving
        super().save(*args, **kwargs)
        
    # option AI recommendation model