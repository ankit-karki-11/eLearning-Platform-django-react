from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Review, Course
from django.db import transaction
from django.db import models

@receiver(post_delete, sender=Review)
def update_course_on_review_delete(sender, instance, **kwargs):
    with transaction.atomic():
        course = Course.objects.select_for_update().get(id=instance.course.id)
        # Recalculate average
        avg = course.reviews.aggregate(avg_rating=models.Avg('rating'))['avg_rating'] or 0.0
        course.average_rating = round(avg, 2)
        # Update total_reviews
        course.total_reviews = course.reviews.count()
        course.save(update_fields=['average_rating', 'total_reviews'])