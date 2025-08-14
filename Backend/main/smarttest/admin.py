from django.contrib import admin


from .models import Topic, Test, Question, TestAttempt,Result, Option

admin.site.register(Topic)
admin.site.register(Test)
admin.site.register(Question)
admin.site.register(TestAttempt)
admin.site.register(Result)
admin.site.register(Option)
