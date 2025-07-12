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
    permission_classes = [IsAuthenticated]  # Allow students to create tests
    
    
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
        
        # Generate AI questions with correct answers
        questions_data= generate_questions_via_api(topic_title,level,num_questions=5)
        for q_data in questions_data:
            Question.objects.create(
                test=test,
                question_text=q_data,
                correct_answer=q_data['answer'],
                marks=2
            )
        print(f"Questions created for test {test.id}: {test.questions.count()}")  # Debug    
        serializer = self.get_serializer(test)
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

# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import TestAttempt, Question, Answer
from .serializers import TestAttemptSerializer
from .utils import generate_feedback, generate_ai_score_and_comment

class TestAttemptViewSet(viewsets.ModelViewSet):
    queryset = TestAttempt.objects.all()
    serializer_class = TestAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TestAttempt.objects.filter(student=self.request.user)

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
        print(f"Answers for attempt {test_attempt.id}: {answered_count}")  # Debug
        print(f"Answer details: {list(answers.values('question_id', 'response'))}")  # Debug

        unanswered_questions = test_attempt.test.questions.exclude(
            id__in=answers.values_list('question_id', flat=True)
        ).values_list('question_text', flat=True)

        test_attempt.completed_at = timezone.now()
        test_attempt.status = 'submitted'
        test_attempt.save()

        return Response({
            "message": "Test submitted successfully.",
            "total_possible": sum(q.marks for q in test_attempt.test.questions.all()),
            "answered": f"{answered_count}/{total_questions}",
            "unanswered_questions": list(unanswered_questions)
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        test_attempt = self.get_object()
        print(f"Fetching results for attempt {pk}")  # Debug
        if test_attempt.status != 'submitted':
            return Response(
                {"detail": "This test has not been submitted yet."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Answer objects for unanswered questions
        answered_question_ids = test_attempt.answers.values_list('question_id', flat=True)
        unanswered_questions = test_attempt.test.questions.exclude(id__in=answered_question_ids)
        for question in unanswered_questions:
            Answer.objects.create(
                attempt=test_attempt,
                question=question,
                response='',
                scored_marks=0.0,
                ai_comment=f"You did not answer this question. Study {test_attempt.test.topic.title}."
            )

        # Generate AI feedback for answers
        total_score = 0
        for answer in test_attempt.answers.all():
            if not answer.ai_comment or answer.scored_marks is None:
                feedback = generate_ai_score_and_comment(
                    answer.question.question_text,
                    answer.response,
                    answer.question.correct_answer
                )
                # answer.ai_comment = feedback['comment']
                # answer.scored_marks = feedback['score']
                answer.ai_comment = comment
                answer.scored_marks = score
                answer.save()
                total_score += answer.scored_marks

        # Generate overall feedback
        test_attempt.feedback = generate_feedback(test_attempt)
        test_attempt.total_score = total_score
        test_attempt.save()

        serializer = self.get_serializer(test_attempt)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    # def perform_create(self, serializer):
    #     attempt = serializer.validated_data['attempt']
    #     if attempt.status == 'submitted':
    #         raise ValidationError("Cannot add answers to a submitted test")
    #     serializer.save()

    # def perform_update(self, serializer):
    #     attempt = serializer.instance.attempt
    #     if attempt.status == 'submitted':
    #         raise ValidationError("Cannot modify answers in a submitted test")
    #     serializer.save()

    def create(self, request, *args, **kwargs):
        print(f"Creating answer with data: {request.data}")  # Debug
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answer = serializer.save()
        print(f"Created answer: {answer.id} for attempt {answer.attempt.id}")  # Debug
        return Response(serializer.data, status=status.HTTP_201_CREATED)