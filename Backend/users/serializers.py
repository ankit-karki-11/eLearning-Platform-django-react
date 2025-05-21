from rest_framework import serializers
from users.models import UserAccount
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Custom JWT token serializer
class MyTokenObtainSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token=super().get_token(user)
        token["role"]=user.role
        token["verified"]=user.is_verified
        return token
    
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
        ]
        
    
