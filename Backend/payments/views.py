from urllib import request
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
from main.models import Course, Enrollment
from .models import Payment
from .serializers import PaymentSerializer
from django.contrib.auth import get_user_model
from .serializers import KhaltiInitiatePaymentSerializer

import uuid

User = get_user_model()

class PaymentViewSet(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={"detail": "Duplicate Entry."}
            )

    @action(detail=False, methods=["PATCH"], permission_classes=[IsAuthenticated])
    def complete_payment(self, request):
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
        months = {month: 0 for month in calendar.month_name if month}
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

    # initiate the payment with khalti
    @action(detail=False, methods=["POST"], permission_classes=[IsAuthenticated])
     
    def initiate_khalti_payment(self, request):
        serializer = KhaltiInitiatePaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        amount = data["amount"]
        course = data["course_id"]
        transaction_id = f"khalti_{uuid.uuid4().hex[:10]}"
        try:
            # # Generate a unique transaction ID
            # transaction_id = f"khalti_{uuid.uuid4().hex[:10]}"
            
            # # Convert amount to integer
            # amount = int(request.data.get("amount"))
            
            # 1. Create Payment record
            # payment = Payment.objects.create(
            #     student=request.user,
            #     course_id=request.data.get("course_id"),
            #     amount=amount,  
            #     status="pending",
            #     payment_gateway="khalti", 
            #     transaction_id=transaction_id, 
            #     purchase_order_id=request.data.get("purchase_order_id"),
            # )
            payment = Payment.objects.create(
            student=request.user,
            course=course,
            amount=amount,
            status="pending",
            payment_gateway="khalti",
            transaction_id=transaction_id,
            purchase_order_id=data["purchase_order_id"],
        )
        
            # 2. Call Khalti API
            payload = {
                "return_url": f"{request.data.get('return_url')}?pidx={payment.id}",
                "website_url": "http://localhost:5173",
                "amount": amount, 
                "purchase_order_id": transaction_id,
                "purchase_order_name": request.data.get("purchase_order_name", "Course Payment"),
            }
            headers = {"Authorization": f"Key {settings.KHALTI_SECRET_KEY}"}

            response = requests.post(
                "https://a.khalti.com/api/v2/epayment/initiate/",
                json=payload,
                headers=headers,
            )

            if response.status_code == 200:
                khalti_data = response.json()
                payment.pidx = khalti_data.get("pidx")
                payment.save()
                return Response(khalti_data, status=200)
            
            # Error handling
            payment.delete()
            # error_detail = response.json().get("detail", "Payment initiation failed")
            # return Response(
            #     {
            #         "detail": f"Khalti error: {error_detail}",
            #         "raw_response": response.json()
            #     },
            #     status=response.status_code
            # )
            try:
                error_detail = response.json().get("detail", "Payment initiation failed")
            except ValueError:
                error_detail = response.text
            return Response(
                    {
                        "detail": f"Khalti error: {error_detail}",
                        "raw_response": response.text
                    },
                    status=response.status_code
                )
        # except ValueError:
        #     return Response(
        #         {"detail": "Amount must be a valid integer"},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        except Exception as e:
            return Response(
                {"detail": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=False, methods=["POST"], permission_classes=[IsAuthenticated])
    def verify_khalti_payment(self, request):
        pidx = request.data.get("pidx")
        if not pidx:
            return Response({"detail": "pidx is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = Payment.objects.get(pidx=pidx)
        except Payment.DoesNotExist:
            return Response(
                {"detail": "Payment record not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

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

            if payment_status.lower() == "completed":
                payment.status = "completed"
                payment.save()

                enrollment, created = Enrollment.objects.get_or_create(
                    student=payment.student,
                    course=payment.course,
                    defaults={
                        'status': 'in_progress',
                        'created_at': payment.created_at
                    }
                )

                return Response(
                    {"detail": "Payment verified and marked as completed."},
                    status=status.HTTP_200_OK
                )

            return Response(
                {"detail": f"Payment not completed. Current status: {payment_status}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            print(f"[ERROR] Payment verification failed: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)