from rest_framework import serializers
from .models import Topic, Question, Option, Test, TestAttempt, Result

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'title', 'description']

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'option_text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'topic', 'question_text', 'level', 'marks', 'options']

    def validate_options(self, value):
        if len(value) != 4:
            raise serializers.ValidationError("Exactly 4 options are required.")
        correct_options = [opt for opt in value if opt.get('is_correct')]
        if len(correct_options) != 1:
            raise serializers.ValidationError("Exactly one option must be marked as correct.")
        return value

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
        return question


class TestSerializer(serializers.ModelSerializer):
    topic = TopicSerializer(read_only=True)
    topic_id = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), source='topic', write_only=True
    )
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Test
        fields = [
            'id', 'title', 'topic', 'topic_id', 'level', 
            'time_limit', 'is_public', 'created_by', 'created_at'
        ]

class ResultSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    selected_option_text = serializers.CharField(source='selected_option.option_text', read_only=True)

    class Meta:
        model = Result
        fields = [
            'id', 'attempt', 'question', 'question_text',
            'selected_option', 'selected_option_text', 'scored_marks'
        ]
        read_only_fields = ['scored_marks']

class TestAttemptSerializer(serializers.ModelSerializer):
    level = serializers.ChoiceField(choices=Question.LevelChoices, write_only=True, required=False)
    results = ResultSerializer(many=True, read_only=True)
    test = TestSerializer(read_only=True)
    test_id = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), source='test', write_only=True, required=False
    )
    topic = TopicSerializer(read_only=True)
    topic_id = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), source='topic', write_only=True, required=False
    )
    selected_questions = QuestionSerializer(many=True, read_only=True)
    time_remaining = serializers.SerializerMethodField()

    class Meta:
        model = TestAttempt
        fields = [
            'id', 'title', 'status', 'is_practice',
            'test', 'test_id', 'topic', 'topic_id', 'level',
            'time_limit', 'time_remaining', 'started_at', 'completed_at',
            'selected_questions', 'total_score', 'feedback', 'results'
        ]
        read_only_fields = [
            'status', 'started_at', 'is_practice', 'time_remaining',
            'selected_questions', 'total_score', 'feedback'
        ]

    def get_time_remaining(self, obj):
        return obj.time_remaining() if obj.time_limit else None

    # def validate(self, data):
    #     request = self.context.get('request')

    #     if request and request.method == 'POST':
    #         is_practice = 'topic_id' in data and 'level' in data
    #         test_id = data.get('test_id')

    #         if is_practice and test_id:
    #             raise serializers.ValidationError("Cannot specify both practice test parameters and formal test ID")
    #         if not is_practice and not test_id:
    #             raise serializers.ValidationError("Must specify either practice parameters (topic_id+level) or test_id")

    #         data['is_practice'] = is_practice

    #     return data
    
    def validate(self, data):
        request = self.context.get('request')

        test = data.get('test')
        topic = data.get('topic')
        level = data.get('level')

        if test and (topic or level):
            raise serializers.ValidationError("Cannot specify both test and practice parameters")
        
        if not test and (not topic or not level):
            raise serializers.ValidationError("Must specify either practice parameters (topic + level) or test")

        data['is_practice'] = not bool(test)

        return data


    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['student'] = request.user

        if validated_data.get('is_practice'):
            validated_data['title'] = f"Practice: {validated_data['topic'].title} - {validated_data['level']}"

        attempt = super().create(validated_data)
        attempt.start_attempt()  # assign randomized questions
        return attempt

class TestAttemptCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAttempt
        fields = ['test_id', 'topic_id', 'level']

    def validate(self, data):
        if 'test_id' in data and ('topic_id' in data or 'level' in data):
            raise serializers.ValidationError("Cannot specify both test and practice parameters")
        if 'topic_id' in data and 'level' not in data:
            raise serializers.ValidationError("Practice tests require both topic_id and level")
        return data
