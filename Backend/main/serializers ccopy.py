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
            "created_at",
            "updated_at",
        ]
        
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
            "is_free",
            "video",
            "created_at",
            "updated_at",
        ]
        

class EnrollmentSerializer(serializers.ModelSerializer):
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
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model=Enrollment
        fields=[
            "id",
            "course",
            "course_id",
            "student",
            "student_id",
            "created_at",
            "updated_at",
            "progress",
        ]
        
    def get_progress(self, obj):
        return obj.progress_percentage()
        
class SectionProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model=SectionProgress
        fields=[
            "id",
            "enrollment",
            "section",
            "isCompleted",
            "watched_at"
        ]
        read_only_fields=['watched_at']

class SectionWithCompletionSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    
    class Meta:
        model=Section
        fields=[
            "id",
            "title",
            "description",
            "video",
            "is_completed",
        ]
        
    def get_is_completed(self, obj):
        user=self.context['request'].user
        enrollment = obj.course.enrollments.get(student=user)
        return SectionProgress.objects.filter(enrollment=enrollment, section=obj, is_completed=True).exists()


class CourseNestedSerializer(serializers.ModelSerializer):
    sections = SectionWithCompletionSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id','title', 'slug', 'sections']
        
class EnrolledCourseDetailSerializer(serializers.ModelSerializer):
    sections = SectionWithCompletionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['course','sections']

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