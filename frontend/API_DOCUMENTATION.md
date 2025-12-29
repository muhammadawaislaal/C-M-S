# Course Management System API Documentation

## Overview
This is a comprehensive REST API for a Course Management System (CMS) backend built with Flask and Flask-JWT-Extended. The system supports two user roles: **Admin** and **Student**, with JWT-based authentication and role-based access control.

---

## Base URL
```
http://localhost:5000
```

---

## Authentication

### Authentication Flow

#### 1. **Admin Registration**
Create a new admin account.

```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@admin.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "Admin added successfully"
}
```

---

#### 2. **Admin Login**
Authenticate as admin and receive JWT token.

```http
POST /login
Content-Type: application/json

{
  "email": "john@admin.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Admin login successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3. **Student Registration**
Create a new student account.

```http
POST /api/student/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@student.com",
  "password": "studentpass123"
}
```

**Response (201 Created):**
```json
{
  "message": "student added successfully"
}
```

---

#### 4. **Student Login**
Authenticate as student and receive JWT token.

```http
POST /api/student/login
Content-Type: application/json

{
  "email": "jane@student.com",
  "password": "studentpass123"
}
```

**Response (200 OK):**
```json
{
  "message": "student login successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### JWT Token Usage

Once authenticated, include the JWT token in the `Authorization` header for all protected endpoints:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Details:**
- **Secret Key:** `I_AM_SAQIB`
- **Expiration:** 5 hours
- **Claims:** `role` (admin or student), `identity` (user_id)

---

## Role-Based Access Control

| Role | Access Rights |
|------|---|
| **Admin** | Create, Read, Update, Delete courses; Create lectures; View all system data |
| **Student** | View active courses; Enroll in courses; View enrolled course lectures; Mark lectures as complete |

---

## API Endpoints by Module

### 1. Authentication Routes

#### Admin Registration
- **URL:** `/register`
- **Method:** `POST`
- **Authentication:** None
- **Request Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "string (required)",
    "email": "string (required, valid email)",
    "password": "string (required, min 8 chars)"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Admin added successfully"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:**
    ```json
    {
      "errors": {
        "email": ["Invalid email address"],
        "password": ["Shorter than minimum length 8"]
      }
    }
    ```
  - **400 Bad Request (Missing fields):**
    ```json
    {
      "message": "name or email and password are required"
    }
    ```
  - **409 Conflict:**
    ```json
    {
      "message": "email already exists"
    }
    ```

---

#### Admin Login
- **URL:** `/login`
- **Method:** `POST`
- **Authentication:** None
- **Request Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "email": "string (required, valid email)",
    "password": "string (required)"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Admin login successfully",
    "token": "string (JWT token)"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:**
    ```json
    {
      "errors": {
        "email": ["Invalid email address"]
      }
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

---

#### Student Registration
- **URL:** `/api/student/register`
- **Method:** `POST`
- **Authentication:** None
- **Request Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "string (required)",
    "email": "string (required, valid email)",
    "password": "string (required, min 8 chars)"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "student added successfully"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:**
    ```json
    {
      "errors": {
        "email": ["Invalid email address"]
      }
    }
    ```
  - **409 Conflict:**
    ```json
    {
      "message": "email already exists"
    }
    ```

---

#### Student Login
- **URL:** `/api/student/login`
- **Method:** `POST`
- **Authentication:** None
- **Request Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "email": "string (required, valid email)",
    "password": "string (required)"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "student login successfully",
    "token": "string (JWT token)"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:**
    ```json
    {
      "errors": {
        "email": ["Invalid email address"]
      }
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

---

### 2. Admin Course Management Routes

#### Add Course
- **URL:** `/add_course`
- **Method:** `POST`
- **Authentication:** Required (Admin only)
- **Required Role:** `admin`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "title": "string (required, unique)",
    "description": "string (optional)",
    "status": "string (optional, default: 'inactive', values: 'active'/'inactive')"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "msg": "Course added successfully",
    "course": {
      "id": 1,
      "title": "Python Basics",
      "description": "Learn Python programming fundamentals",
      "status": "inactive"
    }
  }
  ```
- **Error Responses:**
  - **400 Bad Request:**
    ```json
    {
      "errors": {
        "title": ["Missing data for required field"]
      }
    }
    ```
  - **403 Forbidden (Not admin):**
    ```json
    {
      "msg": "Admin access required"
    }
    ```
  - **409 Conflict:**
    ```json
    {
      "msg": "Course with this title already exists"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "msg": "error details"
    }
    ```

---

#### Update Course
- **URL:** `/update_course/<course_id>`
- **Method:** `PUT`
- **Authentication:** Required (Admin only)
- **Required Role:** `admin`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  ```
- **Request Body (all fields optional):**
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "status": "string (optional, values: 'active'/'inactive')"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "msg": "Course updated successfully"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:**
    ```json
    {
      "errors": {
        "title": ["Invalid field"]
      }
    }
    ```
  - **403 Forbidden (Not admin):**
    ```json
    {
      "msg": "Admin access required"
    }
    ```
  - **404 Not Found:**
    ```json
    {
      "msg": "Course not found"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "msg": "error details"
    }
    ```

---

#### Delete Course
- **URL:** `/delete_course/<course_id>`
- **Method:** `DELETE`
- **Authentication:** Required (Admin only)
- **Required Role:** `admin`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "msg": "Course deleted successfully"
  }
  ```
- **Error Responses:**
  - **403 Forbidden (Not admin):**
    ```json
    {
      "msg": "Admin access required"
    }
    ```
  - **404 Not Found:**
    ```json
    {
      "msg": "Course not found"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "msg": "error details"
    }
    ```

---

#### Get All Courses
- **URL:** `/courses`
- **Method:** `GET`
- **Authentication:** Required (Admin only)
- **Required Role:** `admin`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "courses": [
      {
        "id": 1,
        "title": "Python Basics",
        "description": "Learn Python programming fundamentals",
        "status": "active"
      },
      {
        "id": 2,
        "title": "Web Development",
        "description": "Master HTML, CSS, and JavaScript",
        "status": "inactive"
      }
    ]
  }
  ```
- **Error Responses:**
  - **403 Forbidden (Not admin):**
    ```json
    {
      "msg": "Admin access required"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "msg": "error details"
    }
    ```

---

### 3. Admin Lecture Management Routes

#### Add Lecture
- **URL:** `/lecture/add`
- **Method:** `POST`
- **Authentication:** Required (Admin only)
- **Required Role:** `admin`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: multipart/form-data (for PDF upload) or application/json (for video)
  ```
- **Request Body:**

  **For Video Lectures (JSON):**
  ```json
  {
    "course_id": "integer (required)",
    "title": "string (required)",
    "type": "video (required)",
    "content_url": "string (required, YouTube/Vimeo URL or direct mp4 link)",
    "order_number": "integer (required, unique per course)"
  }
  ```

  **For PDF Lectures (multipart/form-data):**
  ```
  course_id: integer (required)
  title: string (required)
  type: pdf (required)
  order_number: integer (required, unique per course)
  content: file (required, PDF file upload)
  ```

- **Success Response (201):**
  ```json
  {
    "msg": "Lecture added successfully"
  }
  ```

- **Example Requests:**

  **Video Lecture (cURL):**
  ```bash
  curl -X POST http://localhost:5000/lecture/add \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d '{
      "course_id": 1,
      "title": "Introduction to Python",
      "type": "video",
      "content_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "order_number": 1
    }'
  ```

  **PDF Lecture (cURL):**
  ```bash
  curl -X POST http://localhost:5000/lecture/add \
    -H "Authorization: Bearer {token}" \
    -F "course_id=1" \
    -F "title=Python Basics Guide" \
    -F "type=pdf" \
    -F "order_number=2" \
    -F "content=@lecture.pdf"
  ```

- **Error Responses:**
  - **400 Bad Request (Missing fields):**
    ```json
    {
      "errors": {
        "course_id": ["Missing data for required field"]
      }
    }
    ```
  - **400 Bad Request (Missing PDF file):**
    ```json
    {
      "msg": "PDF file is required"
    }
    ```
  - **400 Bad Request (Missing video URL):**
    ```json
    {
      "msg": "Video URL is required"
    }
    ```
  - **400 Bad Request (Invalid type):**
    ```json
    {
      "msg": "Invalid lecture type"
    }
    ```
  - **400 Bad Request (Duplicate order):**
    ```json
    {
      "msg": "Lecture with this order already exists in the course"
    }
    ```
  - **403 Forbidden (Not admin):**
    ```json
    {
      "msg": "Admin access required"
    }
    ```
  - **404 Not Found:**
    ```json
    {
      "msg": "Course not found"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "msg": "Something went wrong",
      "error": "error details"
    }
    ```

---

### 4. Student Course Management Routes

#### View Active Courses
- **URL:** `/api/student/view_active/courses`
- **Method:** `GET`
- **Authentication:** Required (Student only)
- **Required Role:** `student`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Request Body:** None
- **Success Response (200):**
  ```json
  [
    {
      "id": 1,
      "title": "Python Basics",
      "description": "Learn Python programming fundamentals"
    },
    {
      "id": 2,
      "title": "Web Development",
      "description": "Master HTML, CSS, and JavaScript"
    }
  ]
  ```
- **Error Response (403):**
  ```json
  {
    "msg": "Student access required"
  }
  ```

---

### 5. Student Enrollment Routes

#### Enroll in Course
- **URL:** `/enroll/<course_id>`
- **Method:** `POST`
- **Authentication:** Required (Student only)
- **Required Role:** `student`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  ```
- **Request Body:** None
- **Success Response (201):**
  ```json
  {
    "msg": "Enrolled successfully"
  }
  ```
- **Error Responses:**
  - **400 Bad Request (Already enrolled):**
    ```json
    {
      "msg": "Already enrolled"
    }
    ```
  - **403 Forbidden (Not student):**
    ```json
    {
      "msg": "Student access required"
    }
    ```
  - **404 Not Found:**
    ```json
    {
      "msg": "Course not available"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "error": "error details"
    }
    ```

---

### 6. Student Lecture Management Routes

#### Get Course Lectures with Progress
- **URL:** `/get_course/lectures/<course_id>`
- **Method:** `GET`
- **Authentication:** Required (Student only)
- **Required Role:** `student`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Request Body:** None
- **Success Response (200):**
  ```json
  [
    {
      "id": 1,
      "title": "Introduction",
      "type": "video",
      "content_url": "https://example.com/video1.mp4",
      "is_locked": false,
      "is_completed": true
    },
    {
      "id": 2,
      "title": "Basics",
      "type": "video",
      "content_url": "https://example.com/video2.mp4",
      "is_locked": false,
      "is_completed": false
    },
    {
      "id": 3,
      "title": "Advanced Topics",
      "type": "pdf",
      "content_url": null,
      "is_locked": true,
      "is_completed": false
    }
  ]
  ```
- **Error Responses:**
  - **403 Forbidden (Not student):**
    ```json
    {
      "msg": "Student access required"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "msg": "Failed to fetch course lectures",
      "error": "error details"
    }
    ```

**Note:** Lectures are locked until all previous lectures are completed. Locked lectures have `content_url: null`.

---

#### Mark Lecture as Complete
- **URL:** `/lecture/complete/<lecture_id>`
- **Method:** `POST`
- **Authentication:** Required (Student only)
- **Required Role:** `student`
- **Request Headers:**
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  ```
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "msg": "Lecture marked as completed"
  }
  ```
- **Error Responses:**
  - **400 Bad Request (Already completed):**
    ```json
    {
      "msg": "Lecture already completed"
    }
    ```
  - **403 Forbidden (Not student):**
    ```json
    {
      "msg": "Student access required"
    }
    ```
  - **404 Not Found:**
    ```json
    {
      "msg": "Lecture with order number {lecture_id} does not exist in this course."
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "msg": "Failed to complete lecture",
      "error": "error details"
    }
    ```

---

## Frontend Integration Guide

This section maps frontend pages to their corresponding API endpoints.

### Authentication Pages

#### Login Page
- **Admin Login:** `POST /login`
  - Navigate to admin dashboard on success
  - Store JWT token in localStorage/sessionStorage
  
- **Student Login:** `POST /api/student/login`
  - Navigate to student dashboard on success
  - Store JWT token in localStorage/sessionStorage

#### Registration Page
- **Admin Register:** `POST /register`
  - Validate email uniqueness
  - Password strength validation (min 8 chars)
  - Redirect to admin login on success

- **Student Register:** `POST /api/student/register`
  - Validate email uniqueness
  - Password strength validation (min 8 chars)
  - Redirect to student login on success

---

### Admin Pages

#### Admin Dashboard / Courses Management
- **List All Courses:** Currently not available (implement if needed)
- **Create Course:** `POST /add_course`
  - Form fields: title, description, status
  - Success: Display success message, add to list
  - Error: Show validation errors to user

- **Edit Course:** `PUT /update_course/<course_id>`
  - Pre-populate form with current course data
  - Allow partial updates
  - Success: Update course in list

- **Delete Course:** `DELETE /delete_course/<course_id>`
  - Show confirmation dialog
  - Success: Remove from list with success toast

#### Admin Lectures Management
- **Create Lecture:** `POST /lecture/add`
  - **For Video Lectures:** Form fields: course_id, title, type (video), content_url (YouTube/Vimeo/mp4 link), order_number
  - **For PDF Lectures:** Form fields: course_id, title, type (pdf), file upload field (content), order_number
  - Validate order_number uniqueness within course
  - PDF files are automatically stored in `/src/static/pdf_lectures/` with timestamp-based filenames
  - Video URLs accept YouTube embeds, Vimeo links, or direct mp4 URLs
  - Success: Confirm lecture added, display file path/URL to admin

- **Edit Lecture:** Currently not available (implement if needed)

---

### Student Pages

#### Student Dashboard - Available Courses
- **List Active Courses:** `GET /api/student/view_active/courses`
  - Display all active courses
  - Show enrollment status
  - Add "Enroll" button for non-enrolled courses

#### Student Course Enrollment Page
- **Enroll in Course:** `POST /enroll/<course_id>`
  - Show course details
  - One-click enrollment
  - Refresh course list after success
  - Handle "Already enrolled" error gracefully

#### Student Course Detail Page - Lecture List
- **Get Course Lectures:** `GET /get_course/lectures/<course_id>`
  - Display lectures in order
  - Show completion status per lecture
  - Show lock status (locked lectures show lock icon, no content URL)
  - Disable access to locked lecture content

#### Student Lecture View Page
- **Complete Lecture:** `POST /lecture/complete/<lecture_id>`
  - Show "Mark as Complete" button
  - Disable button if already completed
  - Update UI to show completion status
  - Unlock next lecture in sequence
  - Refresh lecture list after completion

---

## Database Schema Reference

### Tables

#### Admins
```sql
CREATE TABLE admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(80) NOT NULL
);
```

#### Students
```sql
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(80) NOT NULL
);
```

#### Courses
```sql
CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'inactive',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Lectures
```sql
CREATE TABLE lectures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  content_url VARCHAR(500) NOT NULL,
  order_number INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

#### Enrollments
```sql
CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'enrolled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

#### Lecture Progress
```sql
CREATE TABLE lecture_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  lecture_id INT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);
```

---

## Common HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| **200** | OK | Successful request (GET, POST, PUT) |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Validation error, missing fields, invalid data |
| **401** | Unauthorized | Invalid credentials |
| **403** | Forbidden | User lacks required role/permission |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource already exists (duplicate email, course title, etc.) |
| **500** | Internal Server Error | Server-side error |

---

## Authentication Errors

### Missing Token
```http
GET /api/student/view_active/courses HTTP/1.1
```

**Response (401):**
```json
{
  "msg": "Missing Authorization Header"
}
```

### Invalid Token
```http
GET /api/student/view_active/courses HTTP/1.1
Authorization: Bearer invalid_token
```

**Response (422):**
```json
{
  "msg": "Invalid token"
}
```

### Expired Token
**Response (401):**
```json
{
  "msg": "Token has expired"
}
```

---

## Best Practices

### Frontend Implementation
1. **Token Storage:** Use secure storage (localStorage/sessionStorage) with XSS protection
2. **Token Refresh:** Implement logout before token expires (5-hour expiration)
3. **Error Handling:** Display user-friendly error messages from API responses
4. **Loading States:** Show loading indicators during API calls
5. **CORS:** Ensure backend has CORS enabled for frontend domain
6. **File Upload:** Show progress indicators for large PDF uploads

### API Usage
1. **Headers:** Always include `Content-Type: application/json` for POST/PUT requests
2. **File Uploads:** Use `Content-Type: multipart/form-data` for PDF lectures only
3. **Validation:** Validate input on frontend before sending
4. **Retry Logic:** Implement retry for network failures (3xx, 5xx errors)
5. **Rate Limiting:** Plan for rate limiting in production
6. **Security:** Never expose JWT tokens in URLs, only use Authorization header
7. **Video URLs:** Always verify video URLs are accessible before saving

### Testing
1. Test all endpoints with valid and invalid tokens
2. Test role-based access (attempt student endpoint with admin token, etc.)
3. Test validation errors with missing/invalid fields
4. Test edge cases (duplicate enrollments, completing completed lectures, etc.)
5. Test PDF upload with various file sizes
6. Test video URL accessibility
7. Test lecture ordering constraints

---

## Configuration

### File Storage
**PDF Lectures Storage:** `src/static/pdf_lectures/`
- Files are uploaded with timestamp prefix for uniqueness
- Example stored path: `/static/pdf_lectures/1704018342_python_guide.pdf`
- Directory is created automatically if it doesn't exist

### Environment Variables (from `src/__init__.py`)
```python
JWT_SECRET_KEY = 'I_AM_SAQIB'
JWT_ACCESS_TOKEN_EXPIRES = 5 hours
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/cms'
```

### To Change Configuration
Edit `src/__init__.py`:
```python
app.config['JWT_SECRET_KEY'] = 'your_new_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=desired_hours)
```

---

## Lecture Types & Content Handling

### Video Lectures
- **Type:** `video`
- **Content Source:** External URL (YouTube, Vimeo, or direct mp4 link)
- **Storage:** No file storage required, just URL reference
- **Supported Formats:**
  - YouTube embeds: `https://www.youtube.com/embed/{video_id}`
  - Vimeo: `https://vimeo.com/{video_id}`
  - Direct MP4: `https://example.com/path/to/video.mp4`
- **Frontend:** Embed video player or use iframe

### PDF Lectures
- **Type:** `pdf`
- **Content Source:** File upload via multipart form
- **Storage:** Files stored in `src/static/pdf_lectures/`
- **File Naming:** `{timestamp}_{original_filename}`
- **Access:** Via static file endpoint `/static/pdf_lectures/{filename}`
- **Frontend:** Embed PDF viewer or provide download link
- **Max File Size:** Configurable (recommend 50MB limit for web)

### Content URL Behavior
- **Locked Lectures:** Return `null` for content_url to prevent unauthorized access
- **Unlocked Lectures:** Return valid content_url for students to access
- **Sequential Unlock:** Lectures unlock only after previous lecture completion

---

### Common Issues

**"Admin access required" on admin endpoint:**
- Verify user is logged in as admin
- Check JWT token is valid and not expired
- Ensure Authorization header format: `Bearer {token}`

**"Student access required" on student endpoint:**
- Verify user is logged in as student
- Check JWT token is valid and not expired

**"Course not found" on enrollment:**
- Verify course_id is correct
- Ensure course status is "active"

**"Already enrolled" error:**
- Check enrollment table for existing record
- Refresh page to verify enrollment status

**Lectures are locked:**
- This is expected behavior. All lectures except the first are locked until previous ones are completed.
- Complete lectures in order to unlock next ones.

---

## Version
**API Version:** 1.0  
**Last Updated:** December 2025  
**Maintained By:** Development Team