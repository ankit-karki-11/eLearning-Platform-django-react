from rest_framework import serializers
from payments.models import Payment
from main.serializers import CourseListSerializer
from users.serializers import UserAccountListSerializer
from users.models import UserAccount
from main.models import Course
from django.conf import settings

class PaymentSerializer(serializers.ModelSerializer):
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
    esewa_payload = serializers.SerializerMethodField()
    payment_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            "id",
            "pidx",
            "student_id",
            "student",
            "course_id",
            "course",
            "amount",
            "payment_method",
            "transaction_id",
            "status",
            "esewa_payload",
            "payment_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "pidx",
            "status",
            "created_at",
            "updated_at",
            "esewa_payload",
            "payment_url",
        ]
    
    def get_esewa_payload(self, obj):
        # """Generate eSewa payload if payment method is eSewa"""
        if obj.payment_method == "esewa":
            return {
                "amount": str(obj.amount),
                "tax_amount": "0",
                "total_amount": str(obj.amount),
                "transaction_uuid": str(obj.transaction_id),
                "product_code": str(obj.course.id),
                "product_service_charge": "0",
                "product_delivery_charge": "0",
                "success_url": settings.ESEWA_SUCCESS_URL,
                "failure_url": settings.ESEWA_FAILURE_URL,
                "signed_field_names": "total_amount,transaction_uuid,product_code",
                "signature": self.generate_signature(obj),
            }
        return None
    
    def get_payment_url(self, obj):
        # """Return payment URL based on method"""
        if obj.payment_method == "esewa":
            return settings.ESEWA_PAYMENT_URL
        return None
    
    def generate_signature(self, obj):
        # """Generate SHA256 signature for eSewa"""
        import hashlib
        import hmac
        import base64
        
        secret = settings.ESEWA_SECRET_KEY.encode('utf-8')
        message = f"total_amount={obj.amount},transaction_uuid={obj.transaction_id},product_code={obj.course.id}".encode('utf-8')
        
        dig = hmac.new(secret, message, hashlib.sha256).digest()
        return base64.b64encode(dig).decode()
    
    def validate(self, data):
        # """Validate payment data"""
        if data.get('payment_method') == 'esewa' and not settings.ESEWA_MERCHANT_ID:
            raise serializers.ValidationError("eSewa payment is not configured properly")
        return data

class PaymentListSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    student = UserAccountListSerializer(read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            "id",
            "pidx",
            "student",
            "course",
            "amount",
            "payment_method",
            "payment_method_display",
            "transaction_id",
            "status",
            "status_display",
            "paid_at",
            "created_at",
        ]
        read_only_fields = fields