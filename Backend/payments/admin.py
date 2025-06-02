from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'amount', 'status', 'payment_gateway', 'created_at')
    search_fields = ('student__full_name', 'course__title', 'transaction_id', 'pidx')
    list_filter = ('status', 'payment_gateway', 'created_at')
