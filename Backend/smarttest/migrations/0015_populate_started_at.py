from django.db import migrations, models
from django.utils import timezone

def populate_started_at(apps, schema_editor):
    TestAttempt = apps.get_model('smarttest', 'TestAttempt')
    for attempt in TestAttempt.objects.filter(started_at__isnull=True):
        attempt.started_at = timezone.now()
        attempt.save()

def populate_completed_at(apps, schema_editor):
    TestAttempt = apps.get_model('smarttest', 'TestAttempt')
    for attempt in TestAttempt.objects.filter(completed_at__isnull=True):
        attempt.completed_at = None

def populate_time_limit(apps, schema_editor):
    TestAttempt = apps.get_model('smarttest', 'TestAttempt')
    for attempt in TestAttempt.objects.filter(time_limit__isnull=True):
        attempt.time_limit = 30
        attempt.save()

class Migration(migrations.Migration):

    dependencies = [
        ('smarttest', '0014_add_completed_at_to_testattempt'),
    ]

    operations = [
        # Only populate existing rows, do NOT add started_at since it exists
        migrations.RunPython(populate_started_at),
        migrations.RunPython(populate_completed_at),
        migrations.RunPython(populate_time_limit),
    ]
