from django.db.models.signals import post_save
from django.dispatch import receiver
from main.models import Course
from .models import Test, COURSE_LEVEL_TO_QUESTION_LEVEL
from users.models import UserAccount

@receiver(post_save, sender=Course)
def create_or_update_course_test(sender, instance, **kwargs):
    """
    Automatically create a Test when:
    1. A new course is created with is_test_required=True
    2. An existing course is updated and is_test_required is set True
       (if no test exists yet)
    """
    if instance.is_test_required:
        # Only create a test if one does not exist yet
        if not Test.objects.filter(course=instance, is_practice=False).exists():
            # Determine test level based on course level
            test_level = COURSE_LEVEL_TO_QUESTION_LEVEL.get(instance.level, 'basic')

            # Pick any admin user as creator
            admin_user = UserAccount.objects.filter(role="admin").first()

            Test.objects.create(
                title=f"{instance.title} - Formal Test",
                course=instance,
                level=test_level,
                created_by=admin_user,
                is_practice=False,
                is_public=False
            )
