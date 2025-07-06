from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import UserAccountViewSet

router = DefaultRouter()
router.register("", UserAccountViewSet, basename="user")

urlpatterns = [
    path('profile/',UserAccountViewSet.as_view({'get':'get_user'}),name='get_user'),
    
]
urlpatterns += router.urls