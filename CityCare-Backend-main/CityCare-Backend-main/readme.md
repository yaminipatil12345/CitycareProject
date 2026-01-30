# 🌆 City Care – Backend

A complaint management system built with **Django REST Framework**.  
Users can report city issues (like potholes, garbage, water problems), and admins can manage them with status updates and notifications.  

---

## 🚀 Features

### 👤 User
- Register & Login (JWT authentication)
- Forgot/Reset password
- Edit profile
- Report new issues
- View own issues
- Receive notifications on updates
- Give feedback

### 🛠️ Admin
- Manage issues reported by users
- Change issue status → sends email + in-app notification
- View all feedback
- Send custom notifications to users

---

## 📌 Notes
 - JWT Authentication for security
 - Email notifications for password reset & issue updates