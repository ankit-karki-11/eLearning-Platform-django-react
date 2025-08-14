
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from unittest.mock import patch
from .models import Topic, Test, Question, TestAttempt, Answer

User = get_user_model()

class SmartTestAPITest(TestCase):
    def setUp(self):
        # Create a test student user
        self.student = User.objects.create_user(username='student1', password='pass1234', role='student')
        self.client = APIClient()
        self.client.force_authenticate(user=self.student)

        # Create topic
        self.topic = Topic.objects.create(title="Sample Topic", description="Topic description")

        # Create a test linked to topic
        self.test = Test.objects.create(
            title="Sample Test",
            topic=self.topic,
            level="basic",
            time_limit=10,
            created_by=self.student
        )

        # Create some questions manually for the test
        self.question1 = Question.objects.create(test=self.test, question_text="Q1?", marks=2)
        self.question2 = Question.objects.create(test=self.test, question_text="Q2?", marks=2)

        # Create test attempt
        self.attempt = TestAttempt.objects.create(student=self.student, test=self.test)

    @patch('smarttest.utils.generate_ai_comment')
    def test_create_answer_and_ai_comment(self, mock_generate_ai_comment):
        # Mock AI comment return value
        mock_generate_ai_comment.return_value = "Good attempt."

        # Create answer for question1
        response = self.client.post('/api/v1/smarttest/answers/', data={
            "attempt": self.attempt.id,
            "question": self.question1.id,
            "response": "My answer to Q1"
        }, format='json')

        self.assertEqual(response.status_code, 201)
        answer = Answer.objects.get(id=response.data['id'])
        self.assertEqual(answer.ai_comment, "Good attempt.")
        self.assertEqual(answer.scored_marks, 0)  # Default until updated

    @patch('smarttest.utils.generate_feedback')
    def test_submit_test_attempt_feedback(self, mock_generate_feedback):
        # Create answers for all questions first
        Answer.objects.create(attempt=self.attempt, question=self.question1, response="Answer 1", scored_marks=2)
        Answer.objects.create(attempt=self.attempt, question=self.question2, response="Answer 2", scored_marks=1.5)

        mock_generate_feedback.return_value = "Well done, keep it up!"

        # Call submit action on TestAttemptViewSet
        url = f'/api/v1/smarttest/attempts/{self.attempt.id}/submit/'
        response = self.client.post(url)

        self.assertEqual(response.status_code, 200)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.feedback, "Well done, keep it up!")
        self.assertIsNotNone(self.attempt.completed_at)
        self.assertIn("Test submitted successfully.", response.data['message'])

    def test_submit_attempt_with_missing_answers(self):
        # Only one answer submitted
        Answer.objects.create(attempt=self.attempt, question=self.question1, response="Answer 1", scored_marks=2)

        url = f'/api/v1/smarttest/attempts/{self.attempt.id}/submit/'
        response = self.client.post(url)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Please answer all questions before submitting", response.data['detail'])

