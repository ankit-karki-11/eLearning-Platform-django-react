from django.db import models
from users.models import UserAccount

from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError  
from django.utils import timezone


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
        default=0.0,
        validators=[MinValueValidator(0.0)]
    )
    
    course_duration = models.DecimalField(
        help_text="Duration in hours",
        max_digits=5,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(0.0)],
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

#Enrollment model
class Enrollment(models.Model):
    STATUS_CHOICES=[
        ('in_progress','In Progress'),
        ('completed','Completed'),
        ('certified','Certified'),
    ]
    student=models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
        related_name='enrollments'
    )
    
    course=models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='enrollments' 
    )
    
    status=models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='in_progress'
    )
    
    last_accessed = models.DateTimeField(null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table="enrollment"
        verbose_name_plural="Enrollments"
        ordering=["-created_at"]
        unique_together = ["student", "course"]
    
    
     # This method defines how each enrollment will be shown as a string (e.g., in admin panel or logs)
    def __str__(self):
       return f"{self.student.full_name} -> {self.course.title} ({self.status})"
   
    # mark completed course
    def mark_completed(self):
        if self.status=='in_progress':
            self.status='completed'
        self.save()
            
    # issue certificate
    def issue_certificate(self):
        if self.status !='completed':
            raise ValidationError("Course must be completed before certification")
        self.status='certified'
        self.save()
    

    @property
    def progress(self):
        total=self.course.sections.count()
        if total == 0:
            return 0
        completed=self.section_progresses.filter(is_completed=True).count()
        return round((completed / total) * 100,2)
        
    # check if course is completed
    @property
    def is_completed(self):
        return self.status == 'completed'
    
    # check if course is certified
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
    started_at = models.DateTimeField(auto_now=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('enrollment', 'section')
        db_table = "section_progress"
        verbose_name = "Section Progress"
        verbose_name_plural = "Section Progresses"
      

    def __str__(self):
        return f"{self.enrollment.student.full_name} - {self.section.title} ({'Completed' if self.is_completed else 'In Progress'})"
   
    def save(self, *args, **kwargs):
        """Auto-set completed_at timestamp when marking as complete"""
        if self.is_completed and not self.completed_at:
            self.completed_at = timezone.now()
        elif not self.is_completed:
            self.completed_at = None
        super().save(*args, **kwargs)

    @property
    def time_spent(self):
        """Calculate total time spent on this section"""
        if self.is_completed and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        return (timezone.now() - self.started_at).total_seconds()

 
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
    file=models.FileField(upload_to="attachments/")
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.section.title} - {self.file} - {self.name}"
    
    class Meta:
        db_table="attachment"
        verbose_name_plural="Attachments"
        ordering=["-created_at"]

#certificate model

class Certificate(models.Model):
    student=models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        limit_choices_to={'role':'student'},
        related_name="certificates"
    )
    course=models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="certificates"
    )
    enrollment=models.ForeignKey(
        'main.Enrollment',
        on_delete=models.CASCADE,
        related_name="certificates"
    )
    certificate_file=models.FileField(upload_to="certificates/")
    issued_at=models.DateTimeField(auto_now_add=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.full_name} - {self.course.title} - {self.issued_at}"
    
    class Meta:
        db_table="certificate"
        verbose_name_plural="Certificates"
        ordering=["-issued_at"]
        unique_together = ["student", "course"]
        
  
#review model ,discussion model , progress model, reply of the comment model will be fo fututre features,   
