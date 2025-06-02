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
    
    PaymentGatewayChoices=[
        ("khalti", "Khalti"),
        ("esewa", "eSewa"),
        ("manual", "Manual"),
    ]
    payment_gateway=models.CharField(
        max_length=20,
        choices=PaymentGatewayChoices,
        default="khalti"
    )
    
    amount = models.PositiveIntegerField(help_text="Amount in paisa (e.g., 1 Rs = 100 paisa)")
    transaction_id=models.CharField(max_length=100,unique=True) #orderid or pid
    purchase_order_id = models.CharField(max_length=100, blank=True, null=True)
    pidx = models.CharField(max_length=100, null=True, blank=True) # khalti refId
    status=models.CharField(
        max_length=20,
        choices=PaymentStatusChoices,
        default="pending"
    )
    
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
        ordering=["-created_at"]  
        unique_together = ["student", "course"]
   