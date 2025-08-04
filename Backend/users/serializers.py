from rest_framework import serializers
from users.models import UserAccount
# from .serializers import UserAccountListSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Custom JWT token serializer
class MyTokenObtainSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token=super().get_token(user)
        token["role"]=user.role
        token["verified"]=user.is_verified
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        user_serializer= UserAccountListSerializer(self.user)
        
        data["user"]= user_serializer.data
        data["message"]="Login Successful!"
        return data
    
class UserAccountSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    
    class Meta:
        model=UserAccount
        fields=[
            "id","email","password","full_name","role","is_active",
            "is_verified","created_at","updated_at", "profile_image","phone_number",
            "profile_image_url",
        ]
        read_only_fields = ["is_verified", "is_active", "created_at", "updated_at"]

    def validate_full_name(self, value):
        """Validates the full name of the user.

        full_name must be at least 3 characters long and contain only letters, spaces, and hyphens.
        """
        if not value.strip():
            raise serializers.ValidationError("Full name cannot be empty.")
        if not value.replace(" ", "").replace("-", "").isalpha():
            raise serializers.ValidationError("Full name can only contain letters, spaces, and hyphens.")
        if len(value) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters long.")
        return value.strip()
    
    def create(self, validated_data):
        # Creates a new user using the custom manager's create_user method
        user=UserAccount.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        
        # upfate full_name,phone_number and profile_image
        instance.full_name=validated_data.get("full_name",instance.full_name)
        instance.phone_number=validated_data.get("phone_number",instance.phone_number)
        instance.profile_image=validated_data.get("profile_image",instance.profile_image)
        
        # Handle password update separately (hashes the password)
        password=validated_data.get("password")
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance
        

# Simplified serializer for listing users (excludes sensitive/less-used fields)
class UserAccountListSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserAccount
        fields=[
            "id",
            "email",
            "full_name",
            "profile_image",
            "phone_number",
            "role",
        ]
        
    
