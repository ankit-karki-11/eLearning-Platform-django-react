from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('smarttest', '0010_add_title_column'),
    ]

    operations = [
        migrations.AddField(
            model_name='testattempt',
            name='test',
            field=models.ForeignKey(
                to='smarttest.test',
                on_delete=django.db.models.deletion.CASCADE,
                null=True,
                blank=True,
            ),
        ),
    ]
