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
    topic_title = serializers.CharField(source='topic.title', read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = [
            'id', 'title', 'topic', 'topic_id','topic_title',
            'level', 'time_limit', 'created_by', 'created_at', 'updated_at', 'questions'
        ]
        read_only_fields = ['created_by']

class ResultSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    class Meta:
        model = Result
        fields = ['id', 'attempt', 'question', 'question_text','response','ai_comment', 'scored_marks']
        read_only_fields = ['ai_comment', 'scored_marks']

class TestAttemptSerializer(serializers.ModelSerializer):
    results = ResultSerializer(many=True, read_only=True)
    test = TestSerializer(read_only=True)
    test_id = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), source='test', write_only=True
    )
    # student = serializers.PrimaryKeyRelatedField(
    #     read_only=True,
    #     default=serializers.CurrentUserDefault()
    # )

    class Meta:
        model = TestAttempt
        fields = [
            'id', 'test', 'test_id','feedback_generated',
            'started_at','status', 'completed_at', 'total_score', 'feedback', 'answers'
        ]
        read_only_fields = ['student','status', 'started_at', 'total_score', 'feedback']