from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db import models

from .models import Topic, Question, Test, TestAttempt, Result, Option
from .serializers import (
    TopicSerializer,
    QuestionSerializer,
    TestSerializer,
    TestAttemptSerializer,
    ResultSerializer,
    OptionSerializer,
)


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'student'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

# Admin views

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]  # Allow read to all authenticated users (students included)
        return [permissions.IsAdminUser()]  # Only admins can POST/PUT/DELETE


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        topic_id = self.request.query_params.get("topic_id")
        level = self.request.query_params.get("level")

        if topic_id:
            queryset = queryset.filter(topic_id=topic_id)
        if level:
            queryset = queryset.filter(level=level)
        return queryset
    
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)

        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)

        if is_many:
            questions = []
            for item in serializer.validated_data:
                question = self.serializer_class().create(item)
                questions.append(question)
            return Response(self.get_serializer(questions, many=True).data, status=status.HTTP_201_CREATED)
        else:
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()

class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]  # Allow read to all authenticated users (students included)
        return [permissions.IsAdminUser()]  # Only admins can POST/PUT/DELETE

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    # Optional: list only public tests or all tests
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Test.objects.all()
        # Students only see public tests
        return Test.objects.filter(is_public=True)


# Student views

class TestAttemptViewSet(viewsets.ModelViewSet):
    queryset = TestAttempt.objects.all()
    serializer_class = TestAttemptSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsStudent()]  # Students can create test attempts
        if self.request.method in ['GET']:
            return [IsAuthenticated()]  # Allow students to view their attempts
        return [IsAuthenticated(), IsAdmin()]  # Only admin can update/delete attempts

    def get_queryset(self):
        # Students only see their own attempts
        return TestAttempt.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start or resume a test attempt"""
        attempt = self.get_object()
        if attempt.status != 'in_progress':
            return Response({"detail": "Test attempt already submitted."}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize questions if not assigned yet
        attempt.start_attempt()
        serializer = self.get_serializer(attempt)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit the test attempt and calculate score"""
        attempt = self.get_object()
        if attempt.status == 'submitted':
            return Response({"detail": "Test attempt already submitted."}, status=status.HTTP_400_BAD_REQUEST)

        # Example: Update results from request.data (depends on your frontend)
        results_data = request.data.get('results', [])
        for item in results_data:
            question_id = item.get('question')
            selected_option_id = item.get('selected_option')

            # Save or update Result for this question
            result_obj, created = Result.objects.update_or_create(
                attempt=attempt,
                question_id=question_id,
                defaults={'selected_option_id': selected_option_id}
            )

            # Calculate scored_marks here as needed
            if result_obj.selected_option and result_obj.selected_option.is_correct:
                result_obj.scored_marks = result_obj.question.marks
            else:
                result_obj.scored_marks = 0
            result_obj.save()

        # Calculate total score
        total_score = attempt.results.aggregate(total=models.Sum('scored_marks'))['total'] or 0
        attempt.total_score = total_score
        attempt.status = 'submitted'
        attempt.completed_at = timezone.now()
        attempt.generate_feedback()
        attempt.save()

        serializer = self.get_serializer(attempt)
        return Response(serializer.data)

