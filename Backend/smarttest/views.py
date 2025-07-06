from django.shortcuts import render
import os
import requests
from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone

from rest_framework.permissions import BasePermission

# from .utils import generate_questions_via_api, generate_feedback,generate_ai_comment 
from .utils import generate_questions_via_api,generate_ai_score_and_comment, generate_feedback

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'student'
    
class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'
    

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAdminUser]

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated, IsStudent]
    
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        test = serializer.save(created_by=self.request.user)
        
        topic_title=test.topic.title
        level=test.level
        
        #Generate AI questions
        questions_texts= generate_questions_via_api(topic_title,level,num_questions=5)
        for single_question_text in questions_texts:
            Question.objects.create(
                test=test,
                question_text=single_question_text,
                marks=2
            )
            
        headers= self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsStudent]

from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class TestAttemptViewSet(viewsets.ModelViewSet):
    queryset = TestAttempt.objects.all()
    serializer_class = TestAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return TestAttempt.objects.all()
        return TestAttempt.objects.filter(student=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        test_attempt = self.get_object()
        answers = Answer.objects.filter(attempt=test_attempt)

        # Check if all questions are answered
        total_questions = test_attempt.test.questions.count()
        if answers.count() < total_questions:
            return Response(
                {"detail": "Please answer all questions before submitting."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Prepare answer data
        answer_data = [
            {
                "question": answer.question.question_text,
                "response": answer.response,
                "score": answer.scored_marks,
                "total": answer.question.marks,
            }
            for answer in answers
        ]

        # Generate AI feedback
        feedback_text = generate_feedback(test_attempt.test.title, answer_data)

        # Save feedback and completion time
        test_attempt.feedback = feedback_text
        test_attempt.completed_at = timezone.now()
        test_attempt.save()

        return Response({
            "message": "Test submitted successfully.",
            "feedback": feedback_text
        }, status=status.HTTP_200_OK)


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        answer_id = response.data.get('id')
        answer = Answer.objects.get(id=answer_id)

        # Generate AI comment for this single answer
        score, comment = generate_ai_score_and_comment(
            question=answer.question.question_text,
            response=answer.response
        )
        answer.scored_marks = score
        answer.ai_comment = comment
        answer.save()

        # After saving comment, check if test is fully answered
        attempt = answer.attempt
        total_questions = attempt.test.questions.count()
        answered_count = attempt.answers.count()

        if answered_count == total_questions:
            total_score = attempt.answers.aggregate(models.Sum('scored_marks'))['scored_marks__sum'] or 0
            attempt.total_score = total_score

            # You can call a feedback generator here too if needed
            feedback = f"Test completed. You scored {total_score} out of {total_questions * 2}."
            attempt.feedback = feedback
            attempt.completed_at = timezone.now()
            attempt.save()

        return response
