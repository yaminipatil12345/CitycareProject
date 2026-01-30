import json
import random
import string
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import User, Issue, Notification, Feedback
from .permissions import IsAdminUser, IsOwnerOrAdmin
from .utils import send_issue_status_email, create_notification, send_password_reset_email

def generate_random_password(length=8):
    """Generate a random password"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration"""
    try:
        data = request.data
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        is_admin = data.get('is_admin', False)

        if not all([name, email, password]):
            return Response({'error': 'Name, email, and password are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            name=name,
            password=password,
            is_admin=is_admin
        )

        tokens = get_tokens_for_user(user)

        return Response({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'is_admin': user.is_admin
            },
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """User login"""
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return Response({'error': 'Email and password are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        if user:
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'is_admin': user.is_admin
                },
                'tokens': tokens
            })
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """User logout - Blacklist the refresh token"""
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logged out successfully'}, 
                       status=status.HTTP_200_OK)
    except TokenError:
        return Response({'error': 'Invalid token'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Send new password via email"""
    try:
        data = request.data
        email = data.get('email')

        if not email:
            return Response({'error': 'Email is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

        # Generate new password
        new_password = generate_random_password()
        user.set_password(new_password)
        user.save()

        # Send email
        send_password_reset_email(user, new_password)

        return Response({'message': 'New password sent to your email'})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    """Edit user profile"""
    try:
        data = request.data
        user = request.user

        if 'name' in data:
            user.name = data['name']
        
        if 'email' in data:
            if User.objects.filter(email=data['email']).exclude(id=user.id).exists():
                return Response({'error': 'Email already exists'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            user.email = data['email']
        
        if 'password' in data:
            user.set_password(data['password'])

        user.save()

        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'is_admin': user.is_admin
            }
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_issue(request):
    """Report a new issue"""
    try:
        data = request.data
        problem = data.get('problem')
        problem_type = data.get('problem_type')
        location = data.get('location')
        description = data.get('description')

        if not all([problem, problem_type, location, description]):
            return Response({'error': 'All fields are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        issue = Issue.objects.create(
            user=request.user,
            problem=problem,
            problem_type=problem_type,
            location=location,
            description=description
        )

        return Response({
            'message': 'Issue reported successfully',
            'issue': {
                'id': issue.id,
                'problem': issue.problem,
                'problem_type': issue.problem_type,
                'location': issue.location,
                'description': issue.description,
                'status': issue.status,
                'date': issue.date.isoformat()
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_issues(request):
    """Get all issues reported by the user"""
    try:
        issues = Issue.objects.filter(user=request.user)
        
        issues_data = [{
            'id': issue.id,
            'problem': issue.problem,
            'problem_type': issue.problem_type,
            'location': issue.location,
            'description': issue.description,
            'status': issue.status,
            'date': issue.date.isoformat(),
            'created_at': issue.created_at.isoformat()
        } for issue in issues]

        return Response({'issues': issues_data})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    """Get user notifications (global + personal)"""
    try:
        # Get personal notifications and global notifications
        notifications = Notification.objects.filter(
            Q(target_user=request.user) | Q(target_user__isnull=True)
        )

        notifications_data = [{
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'is_global': notification.is_global,
            'created_at': notification.created_at.isoformat()
        } for notification in notifications]

        return Response({'notifications': notifications_data})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback(request):
    """Submit feedback on an issue"""
    try:
        data = request.data
        issue_id = data.get('issue_id')
        feedback_text = data.get('feedback_text')

        if not all([issue_id, feedback_text]):
            return Response({'error': 'Issue ID and feedback text are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        try:
            issue = Issue.objects.get(id=issue_id)
        except Issue.DoesNotExist:
            return Response({'error': 'Issue not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

        feedback = Feedback.objects.create(
            issue=issue,
            user=request.user,
            feedback_text=feedback_text
        )

        return Response({
            'message': 'Feedback submitted successfully',
            'feedback': {
                'id': feedback.id,
                'issue_id': feedback.issue.id,
                'feedback_text': feedback.feedback_text,
                'created_at': feedback.created_at.isoformat()
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin Views

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_all_issues(request):
    """Admin: Get all issues with filters"""
    try:
        status_filter = request.GET.get('status', '')
        issues = Issue.objects.all()

        if status_filter:
            issues = issues.filter(status=status_filter)

        issues_data = [{
            'id': issue.id,
            'user': {
                'id': issue.user.id,
                'name': issue.user.name,
                'email': issue.user.email
            },
            'problem': issue.problem,
            'problem_type': issue.problem_type,
            'location': issue.location,
            'description': issue.description,
            'status': issue.status,
            'date': issue.date.isoformat(),
            'created_at': issue.created_at.isoformat()
        } for issue in issues]

        return Response({'issues': issues_data})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_change_issue_status(request, issue_id):
    """Admin: Change issue status"""
    try:
        data = request.data
        new_status = data.get('status')

        if not new_status:
            return Response({'error': 'Status is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        if new_status not in ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REPORT']:
            return Response({'error': 'Invalid status'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        try:
            issue = Issue.objects.get(id=issue_id)
        except Issue.DoesNotExist:
            return Response({'error': 'Issue not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

        old_status = issue.status
        issue.status = new_status
        issue.save()

        # Send email and notification for RESOLVED and REPORT status
        if new_status in ['RESOLVED', 'REPORT']:
            # Send email
            send_issue_status_email(issue, new_status)
            
            # Create notification
            notification_title = f"Issue {new_status.title()}: {issue.problem}"
            if new_status == 'RESOLVED':
                notification_message = f"Your reported issue '{issue.problem}' at {issue.location} has been resolved. Thank you for helping make our city better!"
            else:  # REPORT
                notification_message = f"Your reported issue '{issue.problem}' at {issue.location} has been marked as a report. Please contact us for more information."
            
            create_notification(notification_title, notification_message, issue.user)

        return Response({
            'message': 'Issue status updated successfully',
            'issue': {
                'id': issue.id,
                'status': issue.status,
                'old_status': old_status
            }
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_view_feedback(request):
    """Admin: View all feedback on issues"""
    try:
        feedback_list = Feedback.objects.all().select_related('issue', 'user')

        feedback_data = [{
            'id': feedback.id,
            'issue': {
                'id': feedback.issue.id,
                'problem': feedback.issue.problem,
                'location': feedback.issue.location,
                'status': feedback.issue.status
            },
            'user': {
                'id': feedback.user.id,
                'name': feedback.user.name,
                'email': feedback.user.email
            },
            'feedback_text': feedback.feedback_text,
            'created_at': feedback.created_at.isoformat()
        } for feedback in feedback_list]

        return Response({'feedback': feedback_data})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_all_notifications(request):
    """Admin: View all notifications"""
    try:
        notifications = Notification.objects.all().select_related('target_user')

        notifications_data = [{
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'target_user': {
                'id': notification.target_user.id,
                'name': notification.target_user.name,
                'email': notification.target_user.email
            } if notification.target_user else None,
            'is_global': notification.is_global,
            'created_at': notification.created_at.isoformat()
        } for notification in notifications]

        return Response({'notifications': notifications_data})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_send_notification(request):
    """Admin: Send notification to all users or specific user"""
    try:
        data = request.data
        title = data.get('title')
        message = data.get('message')
        target_user_id = data.get('target_user_id')  # Optional, null for global

        if not all([title, message]):
            return Response({'error': 'Title and message are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        target_user = None
        if target_user_id:
            try:
                target_user = User.objects.get(id=target_user_id)
            except User.DoesNotExist:
                return Response({'error': 'Target user not found'}, 
                              status=status.HTTP_404_NOT_FOUND)

        notification = create_notification(title, message, target_user)

        return Response({
            'message': 'Notification sent successfully',
            'notification': {
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'is_global': notification.is_global,
                'created_at': notification.created_at.isoformat()
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Token refresh endpoint
@api_view(['POST'])
@permission_classes([AllowAny])
def token_refresh(request):
    """Refresh JWT tokens"""
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        token = RefreshToken(refresh_token)
        access_token = token.access_token
        
        return Response({
            'access': str(access_token),
            'refresh': str(token)
        })
    except TokenError:
        return Response({'error': 'Invalid token'}, 
                       status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)