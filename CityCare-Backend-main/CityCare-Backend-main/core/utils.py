from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import Notification

def send_issue_status_email(issue, status):
    """Send email notification when issue status changes"""
    subject_map = {
        'RESOLVED': f'Issue Resolved: {issue.problem}',
        'REPORT': f'Issue Report: {issue.problem}',
    }
    
    message_map = {
        'RESOLVED': f"""
Dear {issue.user.name},

Great news! Your reported issue has been resolved.

Issue Details:
- Problem: {issue.problem}
- Location: {issue.location}
- Status: {issue.status}
- Resolved on: {issue.updated_at.strftime('%Y-%m-%d %H:%M:%S')}

Thank you for helping make our city better!

Best regards,
City Care Team
        """,
        'REPORT': f"""
Dear {issue.user.name},

We have reviewed your reported issue and need to inform you about the following:

Issue Details:
- Problem: {issue.problem}
- Location: {issue.location}
- Status: {issue.status}
- Updated on: {issue.updated_at.strftime('%Y-%m-%d %H:%M:%S')}

Please contact us if you have any questions or need clarification.

Best regards,
City Care Team
        """
    }
    
    if status in subject_map:
        try:
            send_mail(
                subject=subject_map[status],
                message=message_map[status],
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[issue.user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")

def create_notification(title, message, target_user=None):
    """Create a notification"""
    return Notification.objects.create(
        title=title,
        message=message,
        target_user=target_user
    )

def send_password_reset_email(user, new_password):
    """Send password reset email"""
    subject = 'City Care - Password Reset'
    message = f"""
Dear {user.name},

Your password has been reset successfully.

Your new password: {new_password}

Please login and change your password immediately for security reasons.

Best regards,
City Care Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send password reset email: {e}")