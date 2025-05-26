from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import Payment
from .serializers import PaymentSerializer, PaymentListSerializer
from users.models import UserAccount
import requests
class PaymentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Payment.objects.all().select_related('student', 'course')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        return PaymentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'student':
            return queryset.filter(student=self.request.user)
        return queryset
    
    def perform_create(self, serializer):
        student = get_object_or_404(
            UserAccount, 
            id=self.request.user.id, 
            role='student'
        )
        course = serializer.validated_data['course']
        
        serializer.save(
            student=student,
            amount=course.price,
            status='pending'
        )
    
    @action(detail=False, methods=['post'], url_path='verify-esewa')
    def verify_esewa(self, request):
        """
        Verify eSewa payment callback
        """
        transaction_uuid = request.data.get('transaction_uuid')
        ref_id = request.data.get('ref_id')
        
        if not transaction_uuid or not ref_id:
            return Response(
                {'success': False, 'message': 'Missing transaction parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment = get_object_or_404(Payment, transaction_id=transaction_uuid)
        
        # Verify with eSewa API
        verification_payload = {
            'merchant_id': settings.ESEWA_MERCHANT_ID,
            'transaction_uuid': transaction_uuid,
            'ref_id': ref_id
        }
        
        try:
            response = requests.post(
                settings.ESEWA_VERIFICATION_URL,
                data=verification_payload,
                timeout=10
            )
            
            if response.status_code == 200:
                payment.status = 'completed'
                payment.pidx = ref_id
                payment.save()
                
                serializer = self.get_serializer(payment)
                return Response({
                    'success': True,
                    'payment': serializer.data,
                    'message': 'Payment verified successfully'
                })
            
            payment.status = 'failed'
            payment.save()
            return Response({
                'success': False,
                'message': 'Payment verification failed',
                'error': response.text
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except requests.exceptions.RequestException as e:
            payment.status = 'failed'
            payment.save()
            return Response({
                'success': False,
                'message': 'Error connecting to payment gateway',
                'error': str(e)
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    @action(detail=True, methods=['post'], url_path='retry-esewa')
    def retry_esewa(self, request, pk=None):
        """
        Retry failed eSewa payment with same transaction ID
        """
        payment = self.get_object()
        
        if payment.payment_method != 'esewa':
            return Response(
                {'success': False, 'message': 'Not an eSewa payment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if payment.status != 'failed':
            return Response(
                {'success': False, 'message': 'Payment is not in failed state'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reset payment for retry
        payment.status = 'pending'
        payment.pidx = None
        payment.save()
        
        serializer = self.get_serializer(payment)
        return Response({
            'success': True,
            'payment': serializer.data,
            'message': 'Payment ready for retry',
            'esewa_payload': payment.esewa_payload,
            'payment_url': settings.ESEWA_PAYMENT_URL
        })