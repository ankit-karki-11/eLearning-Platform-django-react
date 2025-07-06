from django.db import models
from users.models import UserAccount

from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError  
from django.utils import timezone
from django.contrib.postgres.indexes import GinIndex

#course
class Category(models.Model):
    title=models.CharField(max_length=100,unique=True)
    slug=models.SlugField(max_length=200,unique=True,null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=slugify(self.title)
        super().save(*args, **kwargs)
            
    class Meta:
        db_table="category"
        verbose_name_plural="Categories"
        # order by number of courses in each category
        ordering=["-created_at"]    
    
    
class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    LANGUAGES_CHOICES = [
        ('english', 'English'),
        ('nepali', 'Nepali'),
        ('sanskrit', 'Sanskrit'),
        ('maithili', 'Maithili'),
        ('hindi', 'Hindi'),
        ('nepenglish', 'NepEnglish'),
    ]
    
    title=models.CharField(max_length=200,unique=True)
    slug=models.SlugField(max_length=200,unique=True,null=True,blank=True)
    keywords=models.CharField(max_length=200,blank=True,null=True,help_text="Separate Keywords with commas (e.g., Python, Django, Web Development) for recommendation")
    
    description=models.TextField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    price = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    course_duration = models.DecimalField(
        help_text="Duration in hours",
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True
    )
    recommended_hours_per_week = models.PositiveIntegerField(
        help_text="Recommended study hours per week(generally 5 hour)",
        default=5,
        null=True,
        blank=True
    )
    
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='beginner'
    )
   
    language = models.CharField(
        max_length=50,
        choices=LANGUAGES_CHOICES,
        default='english'
    )
     # Stats
    average_rating = models.FloatField(default=0)
    total_students = models.PositiveIntegerField(default=0)
    
    # course conrent/features
    requirements=models.TextField(
        null=True,blank=True,
        help_text="What students should know before taking this course (one per line or bullet points)",
        default="No specific requirements"
    )
    
    learning_outcomes=models.TextField(
        null=True,blank=True,
        help_text="What students will learn (one per line or bullet points)",
        default="Students will learn the skills and knowledge related to this course"
    )
    
    syllabus=models.TextField(
        null=True,blank=True,
        help_text="Course outline or weekly/module-based syllabus (one topic per line)",
        default="Syllabus will be provided in the course"
    )
    
    category=models.ForeignKey(
        Category,on_delete=models.CASCADE,related_name="courses")
    
    thumbnail=models.ImageField(upload_to="course_thumbnails/%Y/%m/%d/",blank=True,null=True)
    is_published=models.BooleanField(default=False)
    
    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title

    def enrolled_students(self):
        return[enrollment.student for enrollment in self.enrollments.all()]
    
    def total_enrolled(self):
        return self.enrollments.count()

    def completed_students(self):
        return self.enrollments.filter(status='completed')
    def certified_students(self):
        return self.enrollments.filter(status='certified')
    
    def duration_in_weeks(self):
        if self.recommended_hours_per_week and self.course_duration:
            weeks = self.course_duration / self.recommended_hours_per_week
            return round(weeks, 2)
        return None
     
    class Meta:
        db_table="course"
        verbose_name_plural="Courses"
        ordering=["-created_at"]
        indexes=[
            GinIndex(fields=["title"],name='title_trgm',opclasses=['gin_trgm_ops']),
            GinIndex(fields=["keywords"],name='keywords_trgm',opclasses=['gin_trgm_ops']),
        ]

    
#Section Model
class Section(models.Model):
    title=models.CharField(max_length=150)
    course=models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='sections'
    )
    order=models.PositiveIntegerField()
    is_free=models.BooleanField(default=False)
    video = models.FileField(
        upload_to="section_videos/%Y/%m/%d/", 
        null=True, 
        blank=True,
        help_text="Upload section video file"
    )
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} :: {self.course.title}"
    
    def can_change(self,user):
        #who can change the section
        # if user is admin then he can change the section
       return user.role == "admin"
        #no other user can change the section
        
    def can_delete(self,user):
        #who can delete the section
        # if user is admin then he can delete the section
        return user.role == "admin"

    class Meta:
        db_table = "section"
        verbose_name_plural = "Sections"
        ordering = ["order"]
        unique_together = ["course", "title"]

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('certified', 'Certified'),
    ]
    student = models.ForeignKey(
        'users.UserAccount',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
        related_name='enrollments'
    )
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='in_progress'
    )
    progress = models.FloatField(default=0)
    last_accessed = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "enrollment"
        verbose_name_plural = "Enrollments"
        ordering = ["-created_at"]
        unique_together = ["student", "course"]

    def __str__(self):
        return f"{self.student.full_name} -> {self.course.title} ({self.status})"

    def mark_completed(self):
        if self.status == 'in_progress':
            self.status = 'completed'
            self.progress = 100
        self.save()

    def computed_progress(self):
        total_sections = self.course.sections.count()
        completed_sections = self.section_progresses.filter(is_completed=True).count()
        return (completed_sections / total_sections * 100) if total_sections > 0 else 0

    @property
    def is_completed(self):
        return self.status == 'completed'

    @property
    def is_certified(self):
        return self.status == 'certified'


#section-progress
class SectionProgress(models.Model):
    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name='section_progresses'
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='progresses'
    )
    
    is_completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at=models.DateTimeField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    time_spent = models.FloatField(default=0)
    
    class Meta:
        unique_together = ('enrollment', 'section')
        db_table = "section_progress"
        verbose_name = "Section Progress"
        verbose_name_plural = "Section Progresses"
      

    def __str__(self):
        return f"{self.enrollment.student.full_name} - {self.section.title} ({'Completed' if self.is_completed else 'In Progress'})"
   
    def save(self, *args, **kwargs):
        if self.is_completed and self.started_at and self.completed_at:
            if self.completed_at < self.started_at:
                self.completed_at = self.started_at
            time_diff = (self.completed_at - self.started_at).total_seconds()
            self.time_spent = max(time_diff, 0)  # Assign to time_spent
        super().save(*args, **kwargs)

    def clean(self):
        # Check secion belong to enrollment's course
        if self.section.course != self.enrollment.course:
            raise ValidationError("Section must belong to the same course as the enrollment.")
    
    def get_progress_percentage(self):
        #Calculate the progress percentage for this section
        if self.is_completed:
            return 100
        elif self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds() / self.section.duration) * 100
        return 0
    @property
    def time_spent(self):
        """Calculate total time spent on this section"""
        if self.is_completed and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        return 0
    
    @time_spent.setter
    def time_spent(self, value):
        self._time_spent = value

 
# cart model
class Cart(models.Model):
    student=models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
        related_name='carts'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="carts")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
            return f"{self.student.full_name} :: {self.course.title}"

    class Meta:
            db_table = "cart"
            verbose_name_plural = "Carts"
            unique_together = ["student", "course"]    
    
 
class Attachment(models.Model):
    section=models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="attachments"
    )
    name=models.CharField(max_length=200)
    file=models.FileField(upload_to="attachments/%Y/%m/%d/")
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.section.title} - {self.file} - {self.name}"
    
    class Meta:
        db_table="attachment"
        verbose_name_plural="Attachments"
        ordering=["-created_at"]

from django.core.files import File
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
import os
from main.utils import generate_certificate


from django.db import models
from django.utils import timezone
import uuid

class Certificate(models.Model):
    enrollment = models.OneToOneField(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="certificate",
        limit_choices_to={"status": "completed"},
    )
    certificate_id = models.CharField(max_length=12, unique=True, blank=True)  # Shorter ID
    certificate_file = models.FileField(upload_to="certificates/%Y/%m/%d/")
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "certificate"
        ordering = ["-issued_at"]

    def __str__(self):
        return self.certificate_id

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            # Format: YYMMDD-XXX (e.g., 240615-A7F)
            date_str = timezone.now().strftime("%y%m%d")  # 2-digit year + month + day
            random_chars = uuid.uuid4().hex[:3].upper()   # 3-character random code
            self.certificate_id = f"{date_str}-{random_chars}"
        super().save(*args, **kwargs)

#review model ,discussion model , reply of the comment model will be fo fututre features,   
