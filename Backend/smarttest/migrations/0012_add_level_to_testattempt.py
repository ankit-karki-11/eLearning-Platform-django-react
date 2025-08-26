from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('smarttest', '0011_add_test_fk_to_testattempt'),  # update with your last migration
    ]

    operations = [
        migrations.AddField(
            model_name='testattempt',
            name='level',
            field=models.CharField(
                max_length=10,
                choices=[('basic','Basic'),('medium','Medium'),('hard','Hard')],
                null=True,
                blank=True
            ),
        ),
    ]
