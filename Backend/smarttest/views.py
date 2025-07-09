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
from rest_framework.decorators import action

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
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated, IsStudent]
    
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.created_by != request.user:
            raise PermissionError("You don't have permission to access this test")
        return super().retrieve(request, *args, **kwargs)
        
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
    
        @action(detail=False, methods=['get'])
        def my_tests(self, request):
            tests = Test.objects.filter(created_by=request.user)
            serializer = self.get_serializer(tests, many=True)
            return Response(serializer.data)
        
from rest_framework import permissions
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

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        test_attempt = self.get_object()
        
        if test_attempt.status == 'submitted':
            return Response(
                {"detail": "This test has already been submitted."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        answers = test_attempt.answers.all()
        total_questions = test_attempt.test.questions.count()
        answered_count = answers.count()

        # Get list of unanswered questions (keeping your original query)
        unanswered_questions = test_attempt.test.questions.exclude(
            id__in=answers.values_list('question_id', flat=True)
        ).values_list('question_text', flat=True)

        # Prepare data for your existing generate_feedback function
        answers_with_scores = [{
            "question": answer.question.question_text,
            "response": answer.response,
            "score": answer.scored_marks or 0,
            "total": answer.question.marks
        } for answer in answers]

        # Generate feedback using your current function
        feedback_text = generate_feedback(
            test_title=test_attempt.test.title,
            answers_with_scores=answers_with_scores
        )

        # Enhance feedback with unanswered questions info
        if unanswered_questions:
            unanswered_section = "\n\nUnanswered Questions:\n" + "\n".join(
                f"- {q}" for q in unanswered_questions[:5]  # Show first 5 unanswered
            )
            feedback_text += unanswered_section

        # Update attempt
        test_attempt.feedback = feedback_text
        test_attempt.completed_at = timezone.now()
        test_attempt.status = 'submitted'
        test_attempt.total_score = sum(a.scored_marks or 0 for a in answers)
        test_attempt.save()

        return Response({
            "message": "Test submitted successfully.",
            "feedback": feedback_text,
            "score": test_attempt.total_score,
            "total_possible": sum(q.marks for q in test_attempt.test.questions.all()),
            "answered": f"{answered_count}/{total_questions}",
            "unanswered_questions": list(unanswered_questions)  # Return in response
        }, status=status.HTTP_200_OK)

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        attempt = serializer.validated_data['attempt']
        if attempt.status == 'submitted':
            raise ValidationError("Cannot add answers to a submitted test")
        serializer.save()

    def perform_update(self, serializer):
        attempt = serializer.instance.attempt
        if attempt.status == 'submitted':
            raise ValidationError("Cannot modify answers in a submitted test")
        serializer.save()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        answer = Answer.objects.get(id=response.data['id'])

        # Generate AI evaluation
        score, comment = generate_ai_score_and_comment(
            question=answer.question.question_text,
            response=answer.response
        )
        answer.scored_marks = score
        answer.ai_comment = comment
        answer.save()

        return response