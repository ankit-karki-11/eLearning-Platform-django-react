from rest_framework import serializers
from main.models import *
from users.models import UserAccount
from users.serializers import UserAccountListSerializer
from rest_framework.response import Response
from rest_framework import status
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=[
            "id",
            "title",
            "created_at",
            "updated_at",
        ]

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=[
            "id",
            "title",
        ]

class CourseSerializer(serializers.ModelSerializer):
    admin=UserAccountListSerializer(read_only=True)
    admin_id=serializers.PrimaryKeyRelatedField(
        queryset=UserAccount.objects.filter(role="admin"),
        source="admin",
        write_only=True,
        error_messages={
            "does_not_exist": "admin does not exist.",
            "required": "admin is required.",
        },
    )
    
    category=CategoryListSerializer(read_only=True)
    category_id=serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        error_messages={
            "does_not_exist": "Category does not exist.",
            "required": "Category is required.",
        },
    )
    
    sections=serializers.SerializerMethodField()
    price=serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=0,
        default=0,
        error_messages={
            "invalid": "Price must be a valid decimal number.",
            "required": "Price is required.",
        },
    )

    class Meta:
        model=Course
        fields=[
            "id",
            "title",
            "keywords",
            "description",
            "thumbnail",
            "category",
            "category_id",
            "created_at",
            "updated_at",
            "sections",
            "admin",
            "admin_id",
            "price",
            "is_published",
            "slug",
            "level",
            "recommended_hours_per_week",
            "course_duration",
            "language",
            "average_rating",
            "total_students",
            "requirements",
            "learning_outcomes",
            "syllabus",
        ]
        
    def get_sections(self, obj):
        sections=obj.sections.all()
        return SectionSerializer(sections,many=True).data
    
class CourseListSerializer(serializers.ModelSerializer):
    admin=UserAccountListSerializer(read_only=True)
    category=CategoryListSerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    
    class Meta:
        model=Course
        fields=[
            "id",
            "title",
            "slug",
            "keywords",
            "description",
            "thumbnail",
            "category",
            "created_at",
            "updated_at",
            "admin",
            "price",
            "is_published",
            "level",
            "recommended_hours_per_week",
            "course_duration",
            "language",
            "average_rating",
            "total_students",
            "requirements",
            "learning_outcomes",
            "syllabus",
   
        ]     
    
    def get_thumbnail(self, obj):
            request = self.context.get("request")
            if obj.thumbnail and request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return None


class SectionSerializer(serializers.ModelSerializer):
    course=serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        # source="course",
        write_only=True,
        error_messages={
            "does_not_exist": "Course does not exist.",
            "required": "Course is required.",
        },
    )
    video_url=serializers.SerializerMethodField(read_only=True)
    attachments=serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model=Section
        fields=[
            "id",
            "title",
            "course",
            "order",
            "attachments",
            "is_free",
            "video",
            "video_url",  
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
    
    def get_video_url(self, obj):
        # If video exists, return its URL
        if obj.video: 
            request = self.context.get('request')
            if request:
               return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return None
    
    def get_attachments(self, obj):
        attachments=obj.attachments.all()
        return AttachmentSerializer(attachments,many=True).data

    
class SectionListSerializer(serializers.ModelSerializer):
    course=serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source="course",
        write_only=True,
        error_messages={
            "does_not_exist": "Course does not exist.",
            "required": "Course is required.",
        },
    )
    
    class Meta:
        model=Section
        fields=[
             "id",
            "title",
            "course",
            "order",
            "attachments",
            "is_free",
            "video",
            "video_url",  
            "created_at",
            "updated_at",
        ]
        

    
class SectionProgressSerializer(serializers.ModelSerializer):
    section_title = serializers.CharField(source='section.title', read_only=True)
    section_order = serializers.IntegerField(source='section.order', read_only=True)
    video_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SectionProgress
        fields = [
           'id',
            'section',
            'section_title',
            'section_order',
            'is_completed',
            'started_at',
            'completed_at',
            'video_url',
            'time_spent'       
        ]
        read_only_fields = [
            'id', 
            'started_at', 
            'completed_at',
            'time_spent'
        ]
    
    def get_video_url(self, obj):
        if obj.section.video:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.section.video.url) if request else obj.section.video.url
        return None
    
    def validate(self, data):
        """Prevent marking as complete if section has no video"""
        section = data.get('section')
        if data.get('is_completed') and not section.video:
            raise serializers.ValidationError("Cannot complete a section with no video content")
        return data



class SectionWithCompletionSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    attachments= serializers.SerializerMethodField()
    
    class Meta:
        model=Section
        fields=[
            "id",
            "title",
            # "description",
            "order",
            "is_free",
            "video",
            "video_url",
            "attachments",
            "is_completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        
    def get_is_completed(self, obj):
        user = self.context['request'].user
        try:
            enrollment = obj.course.enrollments.get(student=user)
            return SectionProgress.objects.filter(
                enrollment=enrollment, 
                section=obj, 
                is_completed=True
            ).exists()
        except Enrollment.DoesNotExist:
            return False
            
    def get_video_url(self, obj):
        if obj.video: 
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return None
        
    def get_attachments(self, obj):
        attachments = obj.attachments.all()
        return AttachmentSerializer(attachments, many=True, context=self.context).data
    
   
class CourseNestedSerializer(serializers.ModelSerializer):
    sections = SectionWithCompletionSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'sections',
            'created_at',
            'updated_at',
        ]
        
class EnrolledCourseDetailSerializer(serializers.ModelSerializer):
    course = CourseNestedSerializer(read_only=True)
    # sections = SectionWithCompletionSerializer(many=True, read_only=True)
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = [
            'course',
            # 'sections',
            'progress',
            'status',
            'last_accessed',
            'created_at',
            'updated_at',
        ]
    
        read_only_fields = [
            'progress',
            'created_at',
            'updated_at'
        ]
    
    def get_progress(self, obj):
        return obj.progress

class EnrollmentSerializer(serializers.ModelSerializer):
    course=CourseListSerializer(read_only=True)
    course_id=serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source="course",
        write_only=True,
    )
    student=UserAccountListSerializer(read_only=True)
    student_id=serializers.PrimaryKeyRelatedField(
        queryset=UserAccount.objects.filter(role="student"),
        source="student",
        write_only=True,
    )
    
    status= serializers.ChoiceField(
        choices=Enrollment.STATUS_CHOICES,
        read_only=True,
    )
    last_accessed = serializers.DateTimeField(read_only=True)
    progress = serializers.SerializerMethodField()
    section_progresses = SectionProgressSerializer(many=True, read_only=True)
    
    class Meta:
        model=Enrollment
        fields=[
            "id",
            "course", "course_id",
            "student", "student_id",
            "status",
            "progress",
            "last_accessed",
            "created_at",
            "updated_at",
            'section_progresses',
        ]
        
        read_only_fields = [
                "id", 
                "progress",
                "created_at",
                "updated_at"
            ]
        
    def get_progress(self, obj):
        total_sections = obj.course.sections.count()
        if total_sections == 0:
            return 0
        completed_sections = obj.section_progresses.filter(is_completed=True).count()
        return (completed_sections / total_sections) * 100
    
    
class AttachmentSerializer(serializers.ModelSerializer):
    section_id=serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(),
        source="section",
        write_only=True, 
        error_messages={
            "does_not_exist": "Section does not exist.",
            "required": "Section is required.",
        },
    )
    class Meta:
        models=Attachment
        fields=[
            "id",
            "file",
            "name"
            "section_id",
            "created_at",
            "updated_at",
        ]

class CartSerializer(serializers.ModelSerializer):
    course=CourseListSerializer(read_only=True)
    course_id=serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source="course",
        write_only=True,
        error_messages={
            "does_not_exist": "Course does not exist.",
            "required": "Course is required.",
        },
    )
    student=UserAccountListSerializer(read_only=True)
    student_id=serializers.PrimaryKeyRelatedField(
        queryset=UserAccount.objects.filter(role="student"),
        source="student",
        write_only=True,
        error_messages={
            "does_not_exist": "Student does not exist.",
            "required": "Student is required.",
        },
    )
    
    class Meta:
        model=Cart
        fields=[
            "id",
            "course",
            "course_id",
            "student",
            "student_id",
            "created_at",
            "updated_at",
        ]

from rest_framework import serializers
from .models import Certificate
from .utils import generate_certificate
from django.utils import timezone

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['certificate_id', 'certificate_file', 'issued_at']
        read_only_fields = ['certificate_id', 'issued_at']

    def create(self, validated_data):
        enrollment = validated_data['enrollment']
        student_name = enrollment.student.full_name
        course_title = enrollment.course.title
        # certificate_id =certificate.certificate_id
        
        # First create the certificate to generate the ID automatically
        certificate = Certificate.objects.create(enrollment=enrollment)
        
        
        # Generate certificate image
        certificate_path = generate_certificate(
            student_name=student_name,
            course_name=course_title,  # Now correctly using course.title
            issued_at=timezone.now(),
            certificate_id=certificate.certificate_id
        )
        
        #  3. Update with file path
        certificate.certificate_file = certificate_path
        certificate.save()
        
        return certificate
    
    
# from rest_framework import serializers
# from .models import Certificate
# from users.models import UserAccount
# class CertificateSerializer(serializers.ModelSerializer):
#     course = CourseListSerializer(read_only=True)
#     student = UserAccountListSerializer(read_only=True)
#     certificate_url = serializers.SerializerMethodField()

#     def get_certificate_url(self, obj):
#         return self.context['request'].build_absolute_uri(obj.certificate_file.url) if obj.certificate_file else None

#     def validate(self, attrs):
#         enrollment = attrs.get('enrollment')
#         if enrollment.status != 'completed':
#             raise serializers.ValidationError("Course must be completed")
#         return attrs

#     class Meta:
#         model = Certificate
#         fields = ["id", "course", "student", "enrollment", "certificate_url", "issued_at"]
#         read_only_fields = ["certificate_url", "issued_at"]
#         extra_kwargs = {"enrollment": {"required": True}}