from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, CourseViewSet, SectionViewSet,
    CartViewSet,AttachmentViewSet, 
    EnrollmentViewSet,SectionProgressViewSet,RecommendationViewSet,
   CertificateViewSet,CourseSearchView,ReviewViewSet
)
router= DefaultRouter()
router.register(r"category", CategoryViewSet, basename="category")
router.register(r"course", CourseViewSet, basename="course")
router.register(r"cart", CartViewSet, basename="cart")
router.register(r'section', SectionViewSet, basename="section")
router.register(r"attachments", AttachmentViewSet, basename="attachments")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollments")
router.register(r"section-progress", SectionProgressViewSet, basename="section-progress")

router.register(r"recommendations", RecommendationViewSet, basename="recommendation")
router.register(r'certificates', CertificateViewSet, basename='certificate')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('courses/search/', CourseSearchView.as_view(), name='course-search'),
    #  path('reviews/course/<slug:course_slug>/', 
    #      ReviewViewSet.as_view({'get': 'list_course_reviews', 'post': 'create_review'}),
    #      name='course-reviews'),
    # path('reviews/course/<slug:course_slug>/', 
    #      ReviewViewSet.as_view({'get': 'list_course_reviews', 'post': 'create_course_review'}),
    #      name='course-reviews'),
]


urlpatterns += router.urls