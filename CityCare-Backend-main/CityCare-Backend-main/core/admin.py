from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Issue, Notification, Feedback

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'is_admin', 'is_active', 'created_at')
    list_filter = ('is_admin', 'is_active', 'created_at')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_active', 'is_admin', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('problem', 'problem_type', 'location', 'user', 'status', 'date', 'created_at')
    list_filter = ('status', 'problem_type', 'date', 'created_at')
    search_fields = ('problem', 'location', 'user__name', 'user__email')
    readonly_fields = ('date', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Issue Information', {
            'fields': ('user', 'problem', 'problem_type', 'location', 'description')
        }),
        ('Status & Dates', {
            'fields': ('status', 'date', 'created_at', 'updated_at')
        }),
    )

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'target_user', 'is_global', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'message', 'target_user__name', 'target_user__email')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    def is_global(self, obj):
        return obj.target_user is None
    is_global.boolean = True
    is_global.short_description = 'Global Notification'

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('issue', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('feedback_text', 'user__name', 'user__email', 'issue__problem')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

# Register the custom User admin
admin.site.register(User, UserAdmin)

# Customize admin site header
admin.site.site_header = 'City Care Administration'
admin.site.site_title = 'City Care Admin'
admin.site.index_title = 'Welcome to City Care Administration'