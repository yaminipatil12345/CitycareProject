from django.urls import path
from . import views

urlpatterns = [
    # -------------------------------
    # 🔐 Authentication Routes
    # -------------------------------
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),
    path('auth/edit-profile/', views.edit_profile, name='edit_profile'),

    # -------------------------------
    # 👤 User Routes
    # -------------------------------
    path('issues/report/', views.report_issue, name='report_issue'),
    path('issues/user/', views.user_issues, name='user_issues'),
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('feedback/submit/', views.submit_feedback, name='submit_feedback'),

    # -------------------------------
    # 🧑‍💼 Admin Routes
    # -------------------------------
    path('admin/issues/', views.admin_all_issues, name='admin_all_issues'),
    path('admin/issues/<int:issue_id>/status/', views.admin_change_issue_status, name='admin_change_issue_status'),
    path('admin/feedback/', views.admin_view_feedback, name='admin_view_feedback'),
    path('admin/notifications/', views.admin_all_notifications, name='admin_all_notifications'),
    path('admin/notifications/send/', views.admin_send_notification, name='admin_send_notification'),
]
