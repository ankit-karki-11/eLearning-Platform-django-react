from django.contrib import admin
from .models import Course, Category, Section, Certificate, Enrollment

admin.site.register(Course)
admin.site.register(Category)
admin.site.register(Section)
admin.site.register(Certificate)
admin.site.register(Enrollment)
