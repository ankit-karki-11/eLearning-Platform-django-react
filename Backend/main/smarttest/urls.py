from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TestViewSet,
    QuestionViewSet,
    TestAttemptViewSet,
    # ResultViewSet,
    TopicViewSet,
)

router = DefaultRouter()
router.register(r'tests', TestViewSet, basename='test')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'test-attempts', TestAttemptViewSet, basename='testattempt')
# router.register(r'results', ResultViewSet, basename='result')
router.register(r'topics', TopicViewSet, basename='topic')

urlpatterns = [
    # Custom actions on TestAttempt
    path(
        'test-attempts/<int:pk>/submit/',
        TestAttemptViewSet.as_view({'post': 'submit'}),
        name='testattempt-submit'
    ),
    path(
        'test-attempts/<int:pk>/start/',
        TestAttemptViewSet.as_view({'post': 'start'}),
        name='testattempt-start'
    ),
]

urlpatterns += router.urls
