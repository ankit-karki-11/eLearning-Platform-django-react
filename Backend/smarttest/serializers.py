from rest_framework import serializers
from .models import *
from users.models import UserAccount


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'title', 'description']
        
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'marks']
        

class TestSerializer(serializers.ModelSerializer):
    topic = TopicSerializer(read_only=True)
    topic_id = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), source='topic', write_only=True
    )
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = [
            'id', 'title', 'topic', 'topic_id',
            'level', 'time_limit', 'created_by', 'created_at', 'updated_at', 'questions'
        ]
        read_only_fields = ['created_by']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'response',' ai_comment', 'scored_marks']


class TestAttemptSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    test = TestSerializer(read_only=True)
    test_id = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), source='test', write_only=True
    )

    class Meta:
        model = TestAttempt
        fields = [
            'id', 'student', 'test', 'test_id',
            'started_at', 'completed_at', 'total_score', 'feedback', 'answers'
        ]
        read_only_fields = ['student', 'started_at', 'total_score', 'feedback']