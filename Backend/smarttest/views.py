from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, BasePermission,IsAdminUser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import models

from .models import Topic, Question, Test, TestAttempt, Result, Option
from .serializers import (
    TopicSerializer,
    QuestionSerializer,
    TestSerializer,
    TestAttemptSerializer,
    # ResultSerializer,
    OptionSerializer,
)
from main.models import Enrollment
# from .views import IsAdmin

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
    """
    Admin-only viewset for managing questions.
    Supports filtering by topic and level, and bulk creation.
    """
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
            return Response(self.get_serializer(questions, many=True).data,
                            status=status.HTTP_201_CREATED)
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
    """
    Viewset for managing Tests.
    Admins can create/update/delete.
    Students can view and attempt only tests for enrolled courses.
    """
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]  # Students can view
        return [IsAdmin()]  # Admins only for create/update/delete

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Test.objects.all()

        # Students: only see tests for courses they are enrolled in
        enrolled_courses = Enrollment.objects.filter(student=user).values_list('course', flat=True)
        queryset = Test.objects.filter(course_id__in=enrolled_courses)

        # Optional: filter by course_slug
        course_slug = self.request.query_params.get('course_slug')
        if course_slug:
            queryset = queryset.filter(course__slug=course_slug)

        return queryset
    
from main.models import Enrollment
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.utils import timezone
from smarttest.models import Test, TestAttempt, Result
from .serializers import TestAttemptSerializer

class TestAttemptViewSet(viewsets.ModelViewSet):
    """
    Handles creation, retrieval, starting, submission, and retakes
    for both formal and practice tests.
    """
    queryset = TestAttempt.objects.all()
    serializer_class = TestAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Only students can create test attempts
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            # Students only see their own attempts
            return TestAttempt.objects.filter(student=user)
        # Admin can see all attempts
        return TestAttempt.objects.all()

    def perform_create(self, serializer):
        # Student is automatically assigned in serializer.create()
        serializer.save()

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start or resume a test attempt. Fetch questions if not already assigned."""
        attempt = self.get_object()
        if attempt.status != 'in_progress':
            return Response({"detail": "Test attempt already submitted."}, status=400)
        # Start the attempt
        attempt.start_attempt() # Handles Fisher-Yates shuffle for practice or formal
        serializer = self.get_serializer(attempt)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a test attempt, calculate scores, handle pass/fail."""
        attempt = self.get_object()
        if attempt.status == 'submitted':
            return Response({"detail": "Test attempt already submitted."}, status=400)

        # Save/update results
        results_data = request.data.get('results', [])
        for item in results_data:
            question_id = item.get('question')
            selected_option_id = item.get('selected_option')
            result_obj, _ = Result.objects.update_or_create(
                attempt=attempt,
                question_id=question_id,
                defaults={'selected_option_id': selected_option_id}
            )
            # Calculate score for this question
            result_obj.scored_marks = (
                result_obj.question.marks
                if result_obj.selected_option and result_obj.selected_option.is_correct
                else 0
            )
            result_obj.save()

        # Compute total score
        total_score = attempt.results.aggregate(total=models.Sum('scored_marks'))['total'] or 0
        attempt.total_score = total_score
        attempt.status = 'submitted'
        attempt.completed_at = timezone.now()
        attempt.generate_feedback()
        attempt.save()

        # Formal test: update enrollment & generate certificate if passed
        message = "Practice test submitted."
        if attempt.test and not attempt.is_practice and attempt.test.course:
            passing_threshold = 6
            passed = total_score >= passing_threshold
            try:
                enrollment = Enrollment.objects.get(student=attempt.student, course=attempt.test.course)
                enrollment.update_progress()
                if passed:
                    enrollment.check_completion_and_generate_certificate()
                    message = "Test submitted and passed!"
                else:
                    message = "Test submitted but failed. Retake allowed."
            except Enrollment.DoesNotExist:
                pass

        serializer = self.get_serializer(attempt)
        return Response({"message": message, "test_attempt": serializer.data})

    @action(detail=True, methods=['post'])
    def retake(self, request, pk=None):
        """Allow retake of failed formal tests only. Practice tests do not need retakes."""
        old_attempt = self.get_object()
        if old_attempt.status != 'submitted':
            return Response({"detail": "Cannot retake an unsubmitted attempt."}, status=400)
        if old_attempt.is_practice:
            return Response({"detail": "Practice tests do not require retakes."}, status=400)

        passing_threshold = 6
        if old_attempt.total_score >= passing_threshold:
            return Response({"detail": "Test already passed. Retake not needed."}, status=400)

        # Create new attempt for retake
        new_attempt = TestAttempt.objects.create(
            student=old_attempt.student,
            test=old_attempt.test,
            status='in_progress',
            time_limit=old_attempt.time_limit,
            level=old_attempt.level,
            is_practice=False
        )
        # Dynamically assign questions
        new_attempt.start_attempt()
        serializer = self.get_serializer(new_attempt)
        return Response({"message": "New retake started.", "test_attempt": serializer.data}, status=201)
