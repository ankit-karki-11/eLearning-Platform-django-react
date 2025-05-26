from django.db import models
from users.models import UserAccount
from main.models import Course, Enrollment
from django.conf import settings

# Create your models here.
#Payment model
class Payment(models.Model):
    PaymentStatusChoices = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
    ]    
    student=models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
        related_name='payments'
        #  related_name='payments' because student and course can have multiple payments
    )
    
    course=models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="payments"
    )
    
    amount=models.DecimalField(max_digits=8,decimal_places=2)
    payment_date=models.DateTimeField(auto_now_add=True)
    
    payment_method=models.CharField(max_length=50, choices=[
        ("esewa", "eSewa"),
        ("khalti", "Khalti"),
        ("cash", "Cash"),
        ("cheque", "Cheque"),
        ("offline", "Offline"),
    ],
     default="esewa"
    )
    
    transaction_id=models.CharField(max_length=100,unique=True) #orderid or pid
    pidx = models.CharField(max_length=100, null=True, blank=True) # eSewa refId
    status=models.CharField(
        max_length=20,
        choices=PaymentStatusChoices,
        default="pending"
    )
    paid_at = models.DateTimeField(auto_now_add=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.full_name} - {self.course.title} - {self.amount} - {self.status}"
    
    # if payment status is competed then create enrollment for the student in the course
    def save(self,*args,**kwargs):
        if self.status == "completed":
            # Check if the enrollment already exists
            if not Enrollment.objects.filter(student=self.student, course=self.course).exists():
                # Create a new enrollment
                Enrollment.objects.create(student=self.student, course=self.course)
        super().save(*args, **kwargs)
        
    class Meta:
        db_table="payment"
        verbose_name_plural="Payments"
        ordering=["-payment_date"]
        unique_together = ["student", "course"]
    @property
    def esewa_payload(self):
        # """Generate payload for eSewa payment initiation"""
        return {
            "amount": str(self.amount),
            "tax_amount": "0",
            "total_amount": str(self.amount),
            "transaction_uuid": str(self.transaction_id),
            "product_code": str(self.course.id),
            "product_service_charge": "0",
            "product_delivery_charge": "0",
            "success_url": settings.ESEWA_SUCCESS_URL,
            "failure_url": settings.ESEWA_FAILURE_URL,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "signature": self.generate_signature()
        }
    
    def generate_signature(self):
        """Generate SHA256 signature for eSewa"""
        import hashlib
        import hmac
        import base64
        
        secret = settings.ESEWA_SECRET_KEY.encode('utf-8')
        message = f"total_amount={self.amount},transaction_uuid={self.transaction_id},product_code={self.course.id}".encode('utf-8')
        
        dig = hmac.new(secret, message, hashlib.sha256).digest()
        return base64.b64encode(dig).decode() 