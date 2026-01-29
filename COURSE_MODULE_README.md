# Course and Enrollment Module Documentation

## Overview
This implementation includes two new modules for the learning platform:
- **Course Module**: Manages courses created by instructors
- **Enrollment Module**: Manages learner enrollments in courses

## Database Schema

### Course Entity
- **Table**: `courses`
- **Fields**:
  - `id` (UUID, Primary Key)
  - `title` (VARCHAR(255)) - Course title
  - `description` (TEXT) - Course description
  - `price` (DECIMAL(10,2)) - Course price
  - `instructor_id` (UUID, Foreign Key to instructors table)
  - `status` (ENUM: draft, pending, approved) - Course approval status
  - `created_at` (TIMESTAMP) - Creation timestamp
  - `updated_at` (TIMESTAMP) - Last update timestamp

### Enrollment Entity
- **Table**: `enrollments`
- **Fields**:
  - `id` (UUID, Primary Key)
  - `enrolled_at` (TIMESTAMP) - Enrollment timestamp
  - `course_id` (UUID, Foreign Key to courses table)
  - `learner_id` (UUID, Foreign Key to learners table)
  - `created_at` (TIMESTAMP) - Creation timestamp
  - `updated_at` (TIMESTAMP) - Last update timestamp

## Relationships
- **One-to-Many**: One instructor can create many courses
- **Many-to-Many**: Many learners can enroll in many courses (through enrollment table)
- **One-to-Many**: One course can have many enrollments
- **One-to-Many**: One learner can have many enrollments

## API Endpoints

### Course Endpoints
- `POST /courses` - Create a new course (requires authentication)
- `GET /courses` - Get all courses
- `GET /courses/approved` - Get all approved courses
- `GET /courses/my-courses` - Get courses by authenticated instructor
- `GET /courses/:id` - Get course by ID with enrollments
- `PATCH /courses/:id` - Update course (only by owner)
- `PATCH /courses/:id/status` - Update course status (admin only)
- `DELETE /courses/:id` - Delete course (only by owner)

### Enrollment Endpoints
- `POST /enrollments` - Create enrollment (admin)
- `POST /enrollments/enroll/:courseId` - Enroll authenticated learner in course
- `GET /enrollments` - Get all enrollments
- `GET /enrollments/my-enrollments` - Get enrollments by authenticated learner
- `GET /enrollments/course/:courseId` - Get enrollments for a specific course
- `GET /enrollments/:id` - Get enrollment by ID
- `DELETE /enrollments/:id` - Delete enrollment
- `DELETE /enrollments/unenroll/:courseId` - Unenroll authenticated learner from course

## DTOs

### Course DTOs
- **CreateCourseDto**: title, description, price, status (optional)
- **UpdateCourseDto**: title (optional), description (optional), price (optional), status (optional)

### Enrollment DTOs
- **CreateEnrollmentDto**: courseId, learnerId

## Course Status Enum
- `DRAFT` - Course is in draft state
- `PENDING` - Course is pending approval
- `APPROVED` - Course is approved and visible to learners

## Features

### Course Management
- Instructors can create, update, and delete their own courses
- Courses have different status levels (draft, pending, approved)
- Only approved courses are visible to learners
- Full CRUD operations with proper authorization

### Enrollment Management
- Learners can enroll in approved courses
- Prevention of duplicate enrollments
- Easy enrollment/unenrollment process
- Tracking of enrollment dates

### Security
- JWT authentication required for most operations
- Instructors can only manage their own courses
- Proper validation using class-validator
- Foreign key constraints ensure data integrity

## Installation and Setup

1. The modules are automatically registered in `app.module.ts`
2. Database tables will be created automatically due to `synchronize: true` in TypeORM config
3. Make sure to install required dependencies:
   ```bash
   npm install class-validator class-transformer
   ```

## Usage Examples

### Creating a Course
```typescript
POST /courses
Authorization: Bearer <jwt_token>
{
  "title": "Introduction to Node.js",
  "description": "Learn the basics of Node.js development",
  "price": 99.99,
  "status": "draft"
}
```

### Enrolling in a Course
```typescript
POST /enrollments/enroll/course-uuid-here
Authorization: Bearer <jwt_token>
```

### Getting My Courses (Instructor)
```typescript
GET /courses/my-courses
Authorization: Bearer <jwt_token>
```

### Getting My Enrollments (Learner)
```typescript
GET /enrollments/my-enrollments
Authorization: Bearer <jwt_token>
```
