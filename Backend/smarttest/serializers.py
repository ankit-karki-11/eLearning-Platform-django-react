from rest_framework import serializers
from .models import Topic, Question, Option, Test, TestAttempt, Result
from .utils import get_shuffled_questions

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'title', 'description']

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'option_text', 'is_correct']
        extra_kwargs = {
            'is_correct': {'write_only': True}  # don't expose correct answer in GET
        }

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
    # topic = TopicSerializer(read_only=True)
    topic = serializers.StringRelatedField(read_only=True)
    # topic_id = serializers.PrimaryKeyRelatedField(
    #     queryset=Topic.objects.all(), source='topic', write_only=True
    # )
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Test
        fields = [
             'id', 'title', 'course', 'level', 'time_limit', 'topic',
            'is_practice', 'is_public', 'created_by', 'created_at'
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

# test attempt serializer:
# used when a student attempts a test
#handles both formal and practice tests
# class TestAttemptSerializer(serializers.ModelSerializer):
#     # for practice test ,student choose topic + level
#     level = serializers.ChoiceField(choices=Question.LevelChoices, write_only=True, required=False)
#     topic = TopicSerializer(read_only=True)
#     topic_id = serializers.PrimaryKeyRelatedField(
#         queryset=Topic.objects.all(), source='topic', write_only=True, required=False
#     )
    
#     # for formal test, student attempts an existing test
#     test = TestSerializer(read_only=True)
#     test_id = serializers.PrimaryKeyRelatedField(
#         queryset=Test.objects.all(), source='test', write_only=True, required=False
#     )
    
#     results = ResultSerializer(many=True, read_only=True)   
#     selected_questions = QuestionSerializer(many=True, read_only=True)
#     time_remaining = serializers.SerializerMethodField()

#     class Meta:
#         model = TestAttempt
#         fields = [
#             'id', 'title', 'status', 'is_practice',
#             'test', 'test_id', 'topic', 'topic_id', 'level',
#             'time_limit', 'time_remaining', 'started_at', 'completed_at',
#             'selected_questions', 'total_score', 'feedback', 'results'
#         ]
#         read_only_fields = [
#             'status', 'started_at', 'is_practice', 'time_remaining',
#             'selected_questions', 'total_score', 'feedback'
#         ]

#     def get_time_remaining(self, obj):
#         return obj.time_remaining() if obj.time_limit else None

#     def validate(self, data):
#         """
#         Validation rules:
#         1. Cannot mix formal test (test_id) and practice test (topic+level)
#         2. Practice test must have both topic_id and level
#         """
#         test = data.get('test')
#         topic = data.get('topic')
#         level = data.get('level')

#         # prevent mixing practice & formal params
#         # cannot provide test + topic/level at same time
#         if test and (topic or level):
#             raise serializers.ValidationError("Cannot specify both test and practice parameters")
#         # must provide either formal test or practice params
#         if not test and (not topic or not level):
#             raise serializers.ValidationError("Must specify either practice parameters (topic + level) or test")

#         # automatically determine if this is a practice test
#         data['is_practice'] = not bool(test)
#         return data

#     def create(self, validated_data):
#         """
#         Create TestAttempt instance:
#         - Formal test: title comes from Test
#         - Practice test: title generated from topic + level
#         - Automatically fetch questions if practice test
#         """
        
#         request = self.context.get('request')
#         validated_data['student'] = request.user # auto-assign student

#         #for practice test, generate title based on topic + level
#         if validated_data.get('is_practice'):
#             validated_data['title'] = f"Practice: {validated_data['topic'].title} - {validated_data['level']}"

#         attempt = super().create(validated_data)
#         attempt.start_attempt()  # fetch shuffled questions from utils.py
#         return attempt

# # Serializer used when a student attempts a test
# # Handles both formal tests (linked to a course test) and practice tests (student chooses topic + level)
# class TestAttemptSerializer(serializers.ModelSerializer):
#     # ---------------- Practice test fields ----------------
#     # Student chooses topic + level
#     level = serializers.ChoiceField(
#         choices=Question.LevelChoices, write_only=True, required=False
#     )
#     topic = TopicSerializer(read_only=True)
#     topic_id = serializers.PrimaryKeyRelatedField(
#         queryset=Topic.objects.all(), source='topic', write_only=True, required=False
#     )

#     # ---------------- Formal test fields ----------------
#     # Student attempts an existing test
#     test = TestSerializer(read_only=True)
#     test_id = serializers.PrimaryKeyRelatedField(
#         queryset=Test.objects.all(), source='test', write_only=True, required=False
#     )

#     # ---------------- Other fields ----------------
#     results = ResultSerializer(many=True, read_only=True)   
#     selected_questions = QuestionSerializer(many=True, read_only=True)
#     time_remaining = serializers.SerializerMethodField()

#     class Meta:
#         model = TestAttempt
#         fields = [
#             'id', 'title', 'status', 'is_practice',
#             'test', 'test_id', 'topic', 'topic_id', 'level',
#             'time_limit', 'time_remaining', 'started_at', 'completed_at',
#             'selected_questions', 'total_score', 'feedback', 'results'
#         ]
#         read_only_fields = [
#             'status', 'started_at', 'is_practice', 'time_remaining',
#             'selected_questions', 'total_score', 'feedback'
#         ]

#     def get_time_remaining(self, obj):
#         return obj.time_remaining() if obj.time_limit else None

#     def validate(self, data):
#         """
#         Validation rules:
#         1. Cannot mix formal test (test_id) and practice test (topic+level)
#         2. Practice test must have both topic_id and level
#         """
#         test = data.get('test')
#         topic = data.get('topic')
#         level = data.get('level')

#         # cannot provide both test and topic/level at same time
#         if test and (topic or level):
#             raise serializers.ValidationError(
#                 "Cannot specify both a formal test and practice test parameters"
#             )

#         # must provide either formal test or practice params
#         if not test and (not topic or not level):
#             raise serializers.ValidationError(
#                 "Must specify either a formal test or practice parameters (topic + level)"
#             )

#         # automatically determine if this is a practice test
#         data['is_practice'] = not bool(test)
#         return data

#     def create(self, validated_data):
#         """
#         Create a TestAttempt instance:
#         - Formal test: title comes from linked Test, questions fetched dynamically from course topics
#         - Practice test: title generated from topic + level, questions fetched dynamically
#         """
#         request = self.context.get('request')
#         validated_data['student'] = request.user  # auto-assign student

#         # ---------------- Practice test ----------------
#         if validated_data.get('is_practice'):
#             validated_data['title'] = f"Practice: {validated_data['topic'].title} - {validated_data['level']}"

#         # ---------------- Formal test ----------------
#         else:
#             validated_data['title'] = validated_data['test'].title

#         # create attempt instance
#         attempt = super().create(validated_data)

#         # dynamically fetch questions based on test type
#         attempt.start_attempt()  # handles both practice and formal tests internally
#         return attempt


# # ---------------- TEST ATTEMPT CREATE ----------------
# class TestAttemptCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TestAttempt
#         fields = ['test_id', 'topic_id', 'level']

#     def validate(self, data):
#         """
#         Ensure that either:
#         1. A formal test is specified via 'test_id' (no topic/level needed)
#         2. A practice test is specified via 'topic_id' + 'level'
#         """
#         test = data.get('test_id')
#         topic = data.get('topic_id')
#         level = data.get('level')
        
#         # For formal tests, topic should NOT be provided
#         if test and (topic or level):
#             raise serializers.ValidationError(
#                 "Cannot specify topic or level for formal tests"
#             )

#         # For practice tests, topic and level must be provided
#         if topic and not level:
#             raise serializers.ValidationError(
#                 "Practice tests require both topic_id and level"
#             )

#         if level and not topic:
#             raise serializers.ValidationError(
#                 "Practice tests require both topic_id and level"
#             )


#         return data

#     def create(self, validated_data):
#         """
#         Create a TestAttempt instance:
#         - If formal test: link test directly
#         - If practice test: generate title from topic + level
#         """
#         user = self.context['request'].user
#         validated_data['student'] = user

#         if 'test_id' in validated_data:
#             # Formal test: title comes from Test
#             validated_data['title'] = validated_data['test'].title
#             validated_data['is_practice'] = False
#         else:
#             # Practice test: generate title from topic + level
#             validated_data['title'] = f"Practice: {validated_data['topic'].title} - {validated_data['level']}"
#             validated_data['is_practice'] = True

#         attempt = super().create(validated_data)
#         attempt.start_attempt()  # Fetch questions dynamically for practice
#         return attempt

# ---------------- TEST ATTEMPT SERIALIZER ----------------
class TestAttemptSerializer(serializers.ModelSerializer):
    # ---------------- Practice test fields ----------------
    level = serializers.ChoiceField(
        choices=Question.LevelChoices, write_only=True, required=False
    )
    topic = TopicSerializer(read_only=True)
    topic_id = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), source='topic', write_only=True, required=False
    )

    # ---------------- Formal test fields ----------------
    test = TestSerializer(read_only=True)
    test_id = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), source='test', write_only=True, required=False
    )

    # ---------------- Other fields ----------------
    results = ResultSerializer(many=True, read_only=True)   
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

    def validate(self, data):
        test = data.get('test')
        topic = data.get('topic')
        level = data.get('level')

        if test and (topic or level):
            raise serializers.ValidationError(
                "Cannot mix formal test and practice test parameters."
            )
        if not test and (not topic or not level):
            raise serializers.ValidationError(
                "Must provide either a formal test or practice parameters (topic + level)."
            )

        data['is_practice'] = not bool(test)
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['student'] = request.user

        # ---------------- Practice test ----------------
        if validated_data.get('is_practice'):
            validated_data['title'] = f"Practice: {validated_data['topic'].title} - {validated_data['level']}"

        # ---------------- Formal test ----------------
        else:
            test_obj = validated_data.pop('test', None) or validated_data.pop('test_id', None)
            validated_data['test'] = test_obj
            validated_data['title'] = test_obj.title
            validated_data['is_practice'] = False

        attempt = super().create(validated_data)
        attempt.start_attempt()  # dynamically fetch questions
        return attempt


# ---------------- TEST ATTEMPT CREATE SERIALIZER ----------------
class TestAttemptCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAttempt
        fields = ['test_id', 'topic_id', 'level']

    def validate(self, data):
        test = data.get('test_id')
        topic = data.get('topic_id')
        level = data.get('level')

        if test and (topic or level):
            raise serializers.ValidationError("Cannot specify topic or level for formal tests.")
        if topic and not level:
            raise serializers.ValidationError("Practice tests require both topic_id and level.")
        if level and not topic:
            raise serializers.ValidationError("Practice tests require both topic_id and level.")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['student'] = user

        # ---------------- Formal test ----------------
        if 'test_id' in validated_data:
            test_obj = validated_data.pop('test_id')
            validated_data['test'] = test_obj
            validated_data['title'] = test_obj.title
            validated_data['is_practice'] = False

        # ---------------- Practice test ----------------
        else:
            validated_data['title'] = f"Practice: {validated_data['topic'].title} - {validated_data['level']}"
            validated_data['is_practice'] = True

        attempt = super().create(validated_data)
        attempt.start_attempt()  # dynamically fetch questions
        return attempt
