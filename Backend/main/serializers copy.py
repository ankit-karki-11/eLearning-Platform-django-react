from rest_framework import serializers
from main.models import *
from users.models import UserAccount
from users.serializers import UserAccountListSerializer

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
        default=0.0,
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
    
    class Meta:
        model=Course
        fields=[
            "id",
            "title",
            "slug",
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
        ]
        
        read_only_fields = [
                "id", 
                "progress",
                "created_at",
                "updated_at"
            ]
        
    def get_progress(self, obj):
        return obj.progress
        
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
            'last_accessed',
            'video_url',            # From related section
            'time_spent'          
        ]
        read_only_fields = [
            'id', 
            'started_at', 
            'completed_at',
            'last_accessed',
            'time_spent'
        ]
    
    def get_video_url(self, obj):
        if obj.section.video:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.section.video.url) if request else obj.section.video.url
        return None
    
    def validate(self, data):
        """Prevent marking as complete if section has no video"""
        if data.get('is_completed') and not self.instance.section.video:
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
            "description",
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
    course = CourseListSerializer(read_only=True)
    sections = SectionWithCompletionSerializer(many=True, read_only=True)
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = [
            'course',
            'sections',
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

# class CertificateSerializer(serializers.ModelSerializer):
#     course=CourseListSerializer(read_only=True)
#     course_id=serializers.PrimaryKeyRelatedField(
#         queryset=Course.objects.all(),
#         source="course",
#         write_only=True,
#         error_messages={
#             "does_not_exist": "Course does not exist.",
#             "required": "Course is required.",
#         },
#     )
#     student=UserAccountListSerializer(read_only=True)
#     student_id=serializers.PrimaryKeyRelatedField(
#         queryset=UserAccount.objects.filter(role="student"),
#         source="student",
#         write_only=True,
#         error_messages={
#             "does_not_exist": "Student does not exist.",
#             "required": "Student is required.",
#         },
#     )
    
    # def save(self, **kwargs):
    #     certification=super(CertificateSerializer,self).save(**kwargs)
    #     #get details of the student and course
    #     student_name=certification.student.full_name
    #     course_title=certification.course.title
    #     admin_name=certification.course.admin.full_name
        
    #     # Generate certificate file and assign it to the model
    #     certificate_file_path=certificate(student_name,course_title,admin_name)
    #     certificate_file=certificate_file.path
    #     # Save the certificate file path to the model
    #     certification.save()
    #     return certification
        
    
    # class Meta:
    #     model=Certificate
    #     fields=[
    #         "id",
    #         "course",
    #         "course_id",
    #         "student",
    #         "student_id",
    #         "certificate_file",
    #         "created_at",
    #         "updated_at",
    #     ]