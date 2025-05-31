from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet
# from .views import InitiateKhaltiPaymentView 
# from .views import success, fail

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payments')

urlpatterns = [
    path('',include(router.urls)),
    # path('initiate_khalti_payment/', views.initiate_khalti_payment, name='payments-initiate-khalti-payment')
]

# urlpatterns += router.urls