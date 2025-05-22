from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserAccount

class UserAccountAdmin(BaseUserAdmin):
    ordering = ['-created_at']
    list_display = ['email', 'full_name', 'role', 'is_staff', 'is_superuser']
    search_fields = ['email', 'full_name']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone_number', 'role', 'profile_image')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at',)}),  
    )
    readonly_fields = ['created_at']

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'role', 'is_staff', 'is_superuser')}
        ),
    )

admin.site.register(UserAccount, UserAccountAdmin)
