from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
TestViewSet,
QuestionViewSet,
TestAttemptViewSet,
AnswerViewSet,
TopicViewSet,
)
router = DefaultRouter()
router.register(r'tests', TestViewSet, basename='test')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'attempts', TestAttemptViewSet, basename='testattempt')
router.register(r'answers', AnswerViewSet, basename='answer')
router.register(r'topics', TopicViewSet, basename='topic')


urlpatterns = [
   
]

urlpatterns += router.urls  