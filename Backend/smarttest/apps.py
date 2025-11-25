from django.apps import AppConfig


class SmarttestConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'smarttest'

    def ready(self):
        import smarttest.signals  # noqa