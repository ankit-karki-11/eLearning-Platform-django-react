from rest_framework import serializers
from payments.models import Payment
from main.serializers import CourseListSerializer
from users.serializers import UserAccountListSerializer
from users.models import UserAccount
from main.models import Course
from django.conf import settings

class PaymentSerializer(serializers.ModelSerializer):
    payment_gateway = serializers.ChoiceField(choices=Payment.PaymentGatewayChoices, default="khalti")

    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source="course",
        write_only=True,
        error_messages={
            "does_not_exist": "Course does not exist.",
            "required": "Course is required.",
        },
    )
    student = UserAccountListSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=UserAccount.objects.filter(role="student"),
        source="student",
        write_only=True,
        error_messages={
            "does_not_exist": "Student does not exist.",
            "required": "Student is required.",
        },
    )
    class Meta:
        model = Payment
        fields = [
            "id", 
            "transaction_id",
            "pidx",
            "student_id",
            "student",
            "course_id",
            "course",
            "amount",
            "payment_gateway",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "pidx",
            "status",
            "created_at",
            "updated_at",
           
        ]
    
