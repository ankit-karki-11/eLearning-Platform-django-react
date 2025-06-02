from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from django.db import IntegrityError
from django.db.models import Sum
from django.db.models.functions import TruncMonth
import calendar
import requests
from django.conf import settings
from main.models import Course,Enrollment


from .models import Payment
from .serializers import PaymentSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class PaymentViewSet(ModelViewSet):
    """
    ViewSet to manage Payment model operations:
    - Students can create payments.
    - Admins can view payments, earnings, and student spending.
    - Custom actions for completing payments and analytics.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_permissions(self):
        """
        Assign permissions based on action:
        - Only admins can list or retrieve all payments.
        - Any authenticated user can create a payment.
        """
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        else:
            # For other custom actions, default to authenticated users
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        """
        Handle payment creation.
        Catch IntegrityError if duplicate (e.g., same user-course).
        """
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={"detail": "Duplicate Entry."}
            )

    @action(detail=False, methods=["PATCH"], permission_classes=[IsAuthenticated])
    def complete_payment(self, request):
        """
        Mark a payment as completed using pidx (Khalti transaction ID).
        """
        pidx = request.data.get("pidx")
        if not pidx:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"detail": "pidx is required in the request body."}
            )

        payments = Payment.objects.filter(pidx=pidx)
        if not payments.exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Payment with given pidx not found."}
            )

        payments.update(status="completed")

        return Response(
            status=status.HTTP_200_OK,
            data={"detail": "Payment marked as completed."}
        )

    @action(detail=False, methods=["GET"], permission_classes=[IsAdminUser])
    def get_details(self, request):
        """
        Returns monthly earnings summary for admin dashboard charts.
        Format: [{month: "January", earning: 1000}, ...]
        """
        # Initialize a dictionary for all months with 0 earning
        months = {month: 0 for month in calendar.month_name if month}

        # Group payments by month and sum their amounts
        payments = (
            Payment.objects.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(earning=Sum("amount"))
            .order_by("month")
        )

        for payment in payments:
            month_name = calendar.month_name[payment["month"].month]
            months[month_name] = payment["earning"]

        chart_data = [{"month": month, "earning": earning} for month, earning in months.items()]

        return Response(chart_data)
    
    @action(detail=False, methods=["POST"], permission_classes=[IsAuthenticated])
    def initiate_khalti_payment(self, request):
        try:
            amount = request.data.get("amount")
            if not amount:
                return Response({"detail": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # amount = int(float(amount) * 100)
                amount = int(float(amount))
            except ValueError:
                return Response({"detail": "Invalid amount format."}, status=status.HTTP_400_BAD_REQUEST)

            purchase_order_id = request.data.get("purchase_order_id", "order123")
            purchase_order_name = request.data.get("purchase_order_name", "Course Payment")

            payload = {
                "return_url": request.data.get("return_url", "http://localhost:5173/payment-success"),
                "website_url": "http://localhost:5173",
                "amount": amount,
                "purchase_order_id": purchase_order_id,
                "purchase_order_name": purchase_order_name,
            }

            headers = {
                "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
                "Content-Type": "application/json"
            }

            response = requests.post(
                "https://a.khalti.com/api/v2/epayment/initiate/",
                json=payload,
                headers=headers
            )

            if response.status_code == 200:
                data = response.json()
                return Response(data, status=status.HTTP_200_OK)
            else:
                # Try to parse Khalti error details to return to client
                try:
                    error_data = response.json()
                except Exception:
                    error_data = {"detail": response.text}

                return Response(
                    {
                        "detail": "Failed to initiate payment with Khalti.",
                        "khalti_error": error_data,
                    },
                    status=response.status_code
                )

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[IsAuthenticated])
    def verify_khalti_payment(self, request):
        """
        Verifies a Khalti payment using the pidx received from frontend.
        If payment is completed, mark as completed in your database.
        """
        pidx = request.data.get("pidx")
        if not pidx:
            return Response({"detail": "pidx is required."}, status=status.HTTP_400_BAD_REQUEST)

        url = "https://a.khalti.com/api/v2/epayment/lookup/"
        headers = {
            "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
            "Content-Type": "application/json",
        }

        payload = {"pidx": pidx}
        try:
            response = requests.post(url, json=payload, headers=headers)

            if response.status_code != 200:
                return Response(
                    {"detail": "Failed to verify payment with Khalti.", "khalti_error": response.json()},
                    status=response.status_code,
                )

            data = response.json()
            payment_status = data.get("status")

            if payment_status == "completed":
                payment=Payment.objects.get(pidx=pidx)
                payment.status = "completed"
                payment.save()
                
                # create a new enrollment record
                enrollment, created = Enrollment.objects.get_or_create(
                    student=payment.student,
                    course=payment.course,
                    # enrollment_date=payment.created_at,
                    defaults={'status':'in_progress',
                              'created_at': payment.created_at }
                )
                    
                return Response({"detail": "Payment verified and marked as completed."}, status=status.HTTP_200_OK)

            return Response({"detail": f"Payment not completed. Current status: {payment_status}"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
