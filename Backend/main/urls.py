from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, CourseViewSet, SectionViewSet,
    CartViewSet,AttachmentViewSet, 
    EnrollmentViewSet,SectionProgressViewSet,RecommendationViewSet,
   CertificateViewSet
)
router= DefaultRouter()
router.register(r"category", CategoryViewSet, basename="category")
router.register(r"course", CourseViewSet, basename="course")
router.register(r"cart", CartViewSet, basename="cart")
router.register(r'sections', SectionViewSet)
router.register(r"attachments", AttachmentViewSet, basename="attachments")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollments")
router.register(r"section-progress", SectionProgressViewSet, basename="section-progress")

router.register(r"recommendations", RecommendationViewSet, basename="recommendation")
router.register(r'certificates', CertificateViewSet, basename='certificate')


urlpatterns = [
    
]

urlpatterns += router.urls