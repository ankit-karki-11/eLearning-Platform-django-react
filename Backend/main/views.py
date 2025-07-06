from django.shortcuts import render
from users.models import UserAccount
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from users.permissions import *
from main.models import *
from main.serializers import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import filters
from django.db.models import Sum
from django.db import IntegrityError
from payments.models import Payment
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
# from main.views import recommend_courses
# from .serializers import *
#custom permission class
class CustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow only cretain users of admin role
        if view.action in ["create", "update", "destroy"]:
            return request.user.role == "admin"
        return True
       
class IsStudentUser(permissions.BasePermission):
    """
    Allows access only to student users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == "student"
        )
#category viewset
class CategoryViewSet(ModelViewSet):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer
    permission_classes=[CustomPermission]
    search_fields=["title"]
    # filterset_fields=["category","is_published","admin"]
    lookup_field="slug"
    filter_backends = [filters.SearchFilter] 
    
    def create(self, request, *args, **kwargs):
        try:
          #check if user is admin
          if not request.user.role=="admin":
              return Response(
                  status=status.HTTP_403_FORBIDDEN,
                  data={"detail":"Only admin can create course"}
              )
              return super().create(request, *args, **kwargs)
        except Exception as e:
              return Response(
                status=status.HTTP_409_CONFLICT,data={"detail":"Duplicate Category title"}
               )
            
    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response(
                status=status.HTTP_409_CONFLICT,data={"detail":"Duplicate category name"}
               )
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response(
                status=status.HTTP_409_CONFLICT,data={"detail":"Category cannot be deleted"}
               )
    
   
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def get_all_category(self,request,slug=None):
        category=self.get_object()
        serializer=self.get_serializer(category)
        return Response(serializer.data)
    
from django.db import IntegrityError
  
# course viewset
class CourseViewSet(ModelViewSet):
    queryset=Course.objects.all()
    serializer_class=CourseSerializer
    permission_classes=[CustomPermission]
    search_fields=["title","keywords"]
    filterset_fields=["category","is_published","admin"]
    lookup_field="slug"
    filter_backends = [filters.SearchFilter] 
    
    def create(self, request, *args, **kwargs):
       
          #check if user is admin
        if not request.user.role=="admin":
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"detail":"Only admin can create course"
                 }
              )
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={"detail": "Course with this title or slug already exists"}
                )
    
    def update(self, request, *args, **kwargs):
        if request.data.get("is_published") == False:
            course = self.get_object()
            # Check if there are any enrollments for the course
            if course.enrollments.exists():
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"detail":"Course cannot be unpublished as it has enrolled students"}
                )
            
    
        return super().update(request, *args, **kwargs)
          
    def destroy(self, request, *args, **kwargs):
        
        Course=self.get_object()
        # Check if there are any enrollments for the course
        if course.enrollments.exists():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"detail":"Course cannot be deleted as it has enrolled students"}
            )
        return super().destroy(request, *args, **kwargs)


    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def get_published_courses(self, request):
        queryset = self.get_queryset().filter(is_published=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def get_my_courses(self, request):
        if request.user.role == "student":
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"detail":"You are not allowed to access this endpoint"}
            )
        courses=Course.objects.filter(admin=request.user)
        serializer=self.get_serializer(courses,many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def get_all_course(self,request,slug=None):
        course=self.get_object()
        serializer=self.get_serializer(course)
        return Response(serializer.data)
    
    # get course by category
    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def get_stats(self, request):
        if request.user.role != "admin":
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"detail": "Forbidden"}
            )
        #fetching stats for admin
        courses_count = Course.objects.filter(admin=request.user).count()
        published_count = Course.objects.filter(admin=request.user, is_published=True).count()
        student_count = Enrollment.objects.filter(course__admin=request.user).exclude(user=request.user).count()
        
        # total earnins
        total_earning = Payment.objects.filter(course__admin=request.user).aggregate(total=Sum("amount"))
        total_income= total_earning["total"] if total_earning["total"] else 0.0
        
        return Response({
            "courses": courses_count,
            "published_courses": published_count,
            "students": student_count,
            "total_income": total_income
        })

    @action(detail=False, methods=["GET"])
    def get_student_count(self, request):
        course_id = request.query_params.get("course_id")
        if not course_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "course_id required in query parameter."}
            )
        try:
            course = Course.objects.get(id=course_id)
            count = Enrollment.objects.filter(course=course).exclude(user=course.admin).count()
            return Response({"student_count": count})
        except Course.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Course not found."}
            )
    
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import F,Q,ExpressionWrapper,FloatField
class CourseSearchView(APIView):
    permission_classes = [AllowAny]  
      
    
    def get (self,request):
        query=request.GET.get('q','')
        sort=request.GET.get('sort','')
        
        if query:
            if len(query)<3:
                courses= Course.objects.filter(
                    Q(title__icontains=query)|Q(keywords__icontains=query)
                    
                )
            else:
                courses= Course.objects.annotate(
                    similarity_title=TrigramSimilarity('title',query),
                    similarity_keywords=TrigramSimilarity('keywords',query),
                    
                ).annotate(
                    total_similarity=ExpressionWrapper(
                        F('similarity_title') * 0.7 + F('similarity_keywords') * 0.3,
                        output_field=FloatField()
                    )
                ).filter(
                    Q(total_similarity__gt=0.1) |
                    Q(title__icontains=query) |
                    Q(keywords__icontains=query)
                ).order_by('-total_similarity')
        
        else:
            courses= Course.objects.all()
            # Apply sorting
            
            if sort == 'price_asc':
                courses= courses.order_by('price')
            elif sort == 'price_desc':
                courses= courses.order_by('-price')
            elif query:
                courses=courses.order_by('-total_similarity') #sort by relevence by searching
            else:   
                courses= courses.order_by('-created_at')
        
        # serializer=CourseListSerializer(courses,many=True)
        serializer = CourseListSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)
        
# section viewset
class SectionViewSet(ModelViewSet):
    queryset=Section.objects.all()
    serializer_class=SectionSerializer
    permission_classes=[CustomPermission]
    
    def get_queryset(self):
        """Allow filtering by course_id"""
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset.order_by('order')
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={"detail":"Section with this title already exists for this course"}
               )
            
    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response(
                status=status.HTTP_409_CONFLICT,data={"detail":"Duplicate section title"}
               )
    
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response(
                status=status.HTTP_409_CONFLICT,data={"detail":"Section cannot be deleted"}
               )

#cart viewset
class CartViewSet(ModelViewSet):
    queryset = Cart.objects.all().select_related("course", "student")
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Students see only their cart, admins see all
        if self.request.user.role == 'student':
            return self.queryset.filter(student=self.request.user)
        return self.queryset

    def create(self, request, *args, **kwargs):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response(
                {"detail": "course_id required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"detail": "Course not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        if Enrollment.objects.filter(user=request.user, course=course).exists():
            return Response(
                {"detail": "Already enrolled in this course"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Cart.objects.filter(student=request.user, course=course).exists():
            return Response(
                {"detail": "Course already in cart"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data={
            'course': course.id,
            'student': request.user.id
        })
        
        serializer.is_valid(raise_exception=True)
        serializer.save()  #creates the cart record in DB
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["DELETE"])
    def clear_cart(self, request):
        #clear the cart for the logged-in student
        self.get_queryset().filter(student=request.user).delete()
        return Response(
            {"detail": "Cart cleared successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=["GET"])
    def cart_total(self, request):
        # Calculate the total price of items in the cart.
        cart_items = self.get_queryset().filter(student=request.user)
        total = sum(item.course.price for item in cart_items)
        return Response({
            "total": total,
            "item_count": cart_items.count()
        })

#enrollment viewset
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import filters
from .models import Enrollment, Section, SectionProgress
from .serializers import EnrollmentSerializer, EnrolledCourseDetailSerializer, SectionProgressSerializer
# from .permissions import IsStudentUser

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    lookup_field = 'course__slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EnrolledCourseDetailSerializer
        return EnrollmentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'mark_completed', 'section_progress', 'mark_section_completed', 'update_last_accessed']:
            return [permissions.IsAuthenticated()]
        return [IsStudentUser()]

    def get_queryset(self):
        user = self.request.user
        queryset = Enrollment.objects.select_related('course', 'student').prefetch_related('section_progresses', 'course__sections')
        if user.is_staff or user.role == 'admin':
            return queryset
        return queryset.filter(student=user)

    def get_object(self):
        queryset = self.get_queryset()
        slug = self.kwargs.get('course__slug')
        obj = get_object_or_404(queryset, course__slug=slug, student=self.request.user)
        return obj

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def mark_completed(self, request, course__slug=None):
        enrollment = self.get_object()
        enrollment.mark_completed()
        return Response({'status': 'Enrollment marked as completed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path=r'section/(?P<section_id>[^/.]+)')
    def section_progress(self, request, course__slug=None, section_id=None):
        enrollment = self.get_object()
        try:
            section = enrollment.course.sections.get(id=section_id)
        except Section.DoesNotExist:
            return Response({'detail': 'Section not found in this course.'}, status=status.HTTP_404_NOT_FOUND)
        progress = SectionProgress.objects.filter(enrollment=enrollment, section=section).first()
        serializer = SectionProgressSerializer(progress, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path=r'section/(?P<section_id>\d+)/completed')
    def mark_section_completed(self, request, course__slug=None, section_id=None):
        try:
            enrollment = self.get_object()
            section = Section.objects.get(id=section_id, course=enrollment.course)
            section_progress, created = SectionProgress.objects.get_or_create(
                enrollment=enrollment,
                section=section,
                defaults={
                    'is_completed': True,
                    'started_at': timezone.now(),
                    'completed_at': timezone.now()
                }
            )
            if not created and not section_progress.is_completed:
                section_progress.is_completed = True
                section_progress.started_at = section_progress.started_at or timezone.now()
                section_progress.completed_at = timezone.now()
                section_progress.save()
            # Update enrollment progress
            total_sections = enrollment.course.sections.count()
            completed_sections = enrollment.section_progresses.filter(is_completed=True).count()
            enrollment.progress = (completed_sections / total_sections * 100) if total_sections > 0 else 0
            enrollment.status = 'completed' if enrollment.progress == 100 else 'in_progress'
            enrollment.save()
            return Response({'message': 'Section marked as completed'}, status=status.HTTP_200_OK)
        except Section.DoesNotExist:
            return Response({'detail': 'Section not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='update-last-accessed')
    def update_last_accessed(self, request, course__slug=None):
        enrollment = self.get_object()
        enrollment.last_accessed = timezone.now()
        enrollment.save()
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data)
    
#Sectionprogress viewset
class SectionProgressViewSet(ModelViewSet):
    queryset = SectionProgress.objects.all()
    serializer_class = SectionProgressSerializer
    permission_classes = [IsAuthenticated]  # Default permission
    
    def get_queryset(self):
        # Limit to student's own enrollments
        user = self.request.user
        if user.role == 'student':
            return SectionProgress.objects.filter(enrollment__student=user)
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save()    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
#attachment viewset
class AttachmentViewSet(ModelViewSet):
    queryset = Attachment.objects.all().select_related('section')
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]  # Default permission

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]  # Changed from IsAdminUser
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            self.permission_classes = [CustomPermission]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            section_id = request.data.get('section')
            if not section_id:
                return Response(
                    {"detail": "section field is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "Duplicate entry or invalid data"},
                status=status.HTTP_409_CONFLICT
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
#certificate viewset 

from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Certificate, Enrollment, Course
from .serializers import CertificateSerializer
from .utils import generate_certificate
from django.utils import timezone

class CertificateViewSet(ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    lookup_field = 'certificate_id'

    def get_queryset(self):
        """Restrict access to certificates based on user"""
        queryset = super().get_queryset()
        user = self.request.user

        # If not admin, only allow certificates belonging to the user
        if not user.is_staff:
            queryset = queryset.filter(enrollment__student=user)

        # Optional filters
        enrollment_id = self.request.query_params.get('enrollment_id')
        course_slug = self.request.query_params.get('course_slug')

        if enrollment_id:
            queryset = queryset.filter(enrollment_id=enrollment_id)
        if course_slug:
            queryset = queryset.filter(enrollment__course__slug=course_slug)

        return queryset

    def create(self, request, *args, **kwargs):
        """Create certificate using enrollment_id — only for logged-in student"""
        enrollment_id = request.data.get('enrollment_id')
        try:
            enrollment = Enrollment.objects.get(id=enrollment_id)

            # Check student ownership
            if enrollment.student != request.user:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

            return self._generate_certificate(enrollment)

        except Enrollment.DoesNotExist:
            return Response({"error": "Enrollment not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='generate/(?P<course_slug>[^/.]+)')
    def generate_with_slug(self, request, course_slug=None):
        """Generate certificate by course_slug — only for completed course by student"""
        student = request.user
        print(f"[DEBUG] Generating certificate for user: {student}, course_slug: {course_slug}")

        course = get_object_or_404(Course, slug=course_slug)

        enrollment = get_object_or_404(
            Enrollment,
            course=course,
            student=student,
            status='completed'
        )

        return self._generate_certificate(enrollment)

    def _generate_certificate(self, enrollment):
        """Generate and return certificate for a given enrollment"""
        # Strict security check
        if self.request.user != enrollment.student:
            return Response(
                {"error": "Unauthorized access to this enrollment"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Return existing certificate if already generated
        if hasattr(enrollment, 'certificate'):
            serializer = self.get_serializer(enrollment.certificate)
            return Response(serializer.data, status=status.HTTP_200_OK)

        try:
            # Create certificate record
            certificate = Certificate.objects.create(enrollment=enrollment)

            # Generate the certificate image
            file_path = generate_certificate(
                student_name=enrollment.student.full_name,
                course_name=enrollment.course.title,
                issued_at=certificate.issued_at,
                certificate_id=certificate.certificate_id
            )

            # Save file path to model
            certificate.certificate_file = file_path
            certificate.save()

            serializer = self.get_serializer(certificate)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"Certificate generation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def list(self, request, *args, **kwargs):
        """List certificates — limited to the logged-in user's certificates"""
        response = super().list(request, *args, **kwargs)

        if 'results' in response.data:  # Paginated response
            for cert_data in response.data['results']:
                cert_data['download_url'] = request.build_absolute_uri(cert_data['certificate_file'])
        else:  # Non-paginated
            for cert_data in response.data:
                cert_data['download_url'] = request.build_absolute_uri(cert_data['certificate_file'])

        return response

















  
        
        
#recommendation view set
#content based recommendation system
import pandas as pd #type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer #type: ignore
from sklearn.metrics.pairwise import cosine_similarity #type: ignore
from nltk.corpus import stopwords #type: ignore
from main.models import Course


def recommend_courses_with_scores(course_slug: str, top_n: int = 4):
    try:
        courses = Course.objects.filter(is_published=True).values(
            'id', 'title', 'description', 'keywords', 'slug',
            'category__title', 'price', 'level', 'language'
        )
        df = pd.DataFrame.from_records(courses)
        if df.empty:
            return []

        df["combined_text"] = (
            df["title"].fillna("") + " " +
            df["keywords"].fillna("") + " " +
            df["category__title"].fillna("") + " " +
            df["description"].fillna("") + " " +
            df["level"].fillna("") + " " +
            df["language"].fillna("")
        ).str.lower()

        try:
            stop_words = list(stopwords.words("english"))
        except LookupError:
            import nltk
            nltk.download("stopwords")
            stop_words = list(stopwords.words("english"))

        vectorizer = TfidfVectorizer(stop_words=stop_words, max_features=5000)
        tfidf_matrix = vectorizer.fit_transform(df["combined_text"])

        try:
            current_index = df[df["slug"] == course_slug].index[0]
        except IndexError:
            return []

        similarity_scores = cosine_similarity(
            tfidf_matrix[current_index:current_index + 1],
            tfidf_matrix
        ).flatten()

        similar_indices = similarity_scores.argsort()[-(top_n + 1):-1][::-1]

        results = []
        for i in similar_indices:
            course_id = df.iloc[i]["id"]
            similarity = similarity_scores[i]
            course = Course.objects.get(id=course_id)
            results.append((course, similarity))

        return results

    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        return []

    
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from main.models import Course
from main.serializers import CourseListSerializer
from rest_framework.permissions import AllowAny
#recommendation viewset
class RecommendationViewSet(ViewSet):
    serializer_class = CourseListSerializer
    http_method_names = ['get']
    permission_classes = [AllowAny]
    """
    ViewSet for recommending courses based on similarity.
    """
    
    def get_serializer_context(self):
        return {"request": self.request}
    

    def list(self, request):
        slug = request.query_params.get("course")
        if not slug:
            return Response([])

        # Get recommended courses with similarity scores
        recommended_with_scores = recommend_courses_with_scores(slug)

        # Serialize each course and include the similarity score
        serialized_data = []
        for course, score in recommended_with_scores:
            data = CourseListSerializer(course).data
            data["similarity_score"] = round(float(score), 3)  # Keep score readable
            serialized_data.append(data)

        return Response(serialized_data)