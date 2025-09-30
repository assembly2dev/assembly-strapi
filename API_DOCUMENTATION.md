# PLB Assembly 2.0 Course Management API Documentation

## Overview
This document provides comprehensive documentation for the PLB Assembly 2.0 Course Management System API built with Strapi. The API supports CRUD operations for courses, instructors, and reviews with advanced filtering, authentication, and validation.

## Base URL
```
http://localhost:1337/api
```

## Authentication
The API uses JWT-based authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Public Endpoints
- `GET /api/courses` - List published courses
- `GET /api/courses/:id` - Get published course details
- `GET /api/instructors` - List instructors
- `GET /api/instructors/:id` - Get instructor details
- `GET /api/reviews` - List reviews
- `GET /api/reviews/:id` - Get review details

### Protected Endpoints
All other endpoints require authentication and appropriate permissions.

## Course API

### GET /api/courses
Retrieve all courses with filtering and pagination.

**Query Parameters:**
- `search` (string) - Search across title, description, and SKU
- `category` (string) - Filter by category
- `type` (string) - Filter by type (Course, Book, Event, Webinar, Masterclass, Workshop)
- `status` (string) - Filter by status (Published, Draft, Archived)
- `stock` (string) - Filter by stock status (In stock, Limited stock, Out of stock)
- `featured` (boolean) - Filter featured courses
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `minRating` (number) - Minimum rating filter
- `sort` (string) - Sort field (e.g., "title:asc", "datePublished:desc")
- `pagination[page]` (number) - Page number (default: 1)
- `pagination[pageSize]` (number) - Items per page (default: 25)
- `populate` (object) - Related data to include

**Example Request:**
```bash
GET /api/courses?search=investment&category=HDB Investment&status=Published&sort=title:asc&pagination[page]=1&pagination[pageSize]=10
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Making The Right Move",
        "slug": "making-the-right-move",
        "sku": "COURSE-001",
        "price": 149.99,
        "salePrice": 129.99,
        "status": "Published",
        "type": "Course",
        "category": "HDB Investment",
        "categories": ["HDB Investment", "Property Investment"],
        "level": "All Levels",
        "duration": "2 hours 30 minutes",
        "totalHours": 2.5,
        "image": {
          "data": {
            "attributes": {
              "url": "/uploads/making-the-right-move.jpg"
            }
          }
        },
        "featured": false,
        "virtual": true,
        "downloadable": false,
        "stock": "In stock",
        "stockQuantity": 116,
        "students": 245,
        "rating": 4.8,
        "reviewCount": 23,
        "tags": ["HDB", "Investment", "Property"],
        "instructors": {
          "data": [
            {
              "id": "george-peng",
              "attributes": {
                "name": "George Peng",
                "role": "Property Investment Expert"
              }
            }
          ]
        },
        "curriculum": [
          {
            "id": 1,
            "title": "Market Analysis & 2025 Outlook",
            "duration": "2h 15m",
            "lessons": [
              {
                "id": 1,
                "title": "Understanding Rate Cut Impacts",
                "type": "video",
                "duration": "25:30"
              }
            ]
          }
        ],
        "highlights": ["Expert tips", "Real-world examples"],
        "requirements": ["Interest in property investment"],
        "targetAudience": ["Investors", "Homeowners"],
        "whatYouWillLearn": ["Maximizing returns", "Investment strategies"],
        "datePublished": "2023-05-15T00:00:00.000Z",
        "createdAt": "2023-05-15T00:00:00.000Z",
        "updatedAt": "2023-05-15T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

### GET /api/courses/:id
Retrieve a single course by ID with full population.

**Example Request:**
```bash
GET /api/courses/1
```

### POST /api/courses
Create a new course.

**Request Body:**
```json
{
  "data": {
    "title": "New Course Title",
    "slug": "new-course-slug",
    "sku": "COURSE-003",
    "price": 199.99,
    "salePrice": null,
    "status": "Draft",
    "type": "Course",
    "category": "Investment Strategy",
    "categories": ["Investment Strategy", "Property"],
    "level": "All Levels",
    "duration": "3 hours",
    "totalHours": 3.0,
    "image": 1,
    "featured": false,
    "virtual": true,
    "downloadable": false,
    "stock": "In stock",
    "stockQuantity": 100,
    "tags": ["Investment", "Strategy"],
    "instructors": ["george-peng", "marc-chan"],
    "curriculum": [
      {
        "id": 1,
        "title": "Introduction Module",
        "duration": "1h",
        "lessons": [
          {
            "id": 1,
            "title": "Welcome to the Course",
            "type": "video",
            "duration": "15:00"
          }
        ]
      }
    ],
    "highlights": ["Comprehensive coverage", "Expert insights"],
    "requirements": ["Basic understanding of property"],
    "targetAudience": ["Beginners", "Investors"],
    "whatYouWillLearn": ["Key concepts", "Practical applications"]
  }
}
```

### PUT /api/courses/:id
Update an existing course.

### DELETE /api/courses/:id
Delete a course.

### POST /api/courses/bulk-update
Bulk update multiple courses.

**Request Body:**
```json
{
  "data": {
    "ids": [1, 2, 3],
    "updates": {
      "status": "Archived"
    }
  }
}
```

### GET /api/courses/stats
Get course statistics.

**Example Response:**
```json
{
  "data": {
    "total": 100,
    "published": 85,
    "draft": 10,
    "archived": 5,
    "featured": 12
  }
}
```

## Instructor API

### GET /api/instructors
Retrieve all instructors with filtering.

**Query Parameters:**
- `search` (string) - Search across name, specialty, and role
- `specialty` (string) - Filter by specialty
- `showOnFacilitatorsPage` (boolean) - Filter by facilitators page visibility
- `sort` (string) - Sort field
- `pagination[page]` (number) - Page number
- `pagination[pageSize]` (number) - Items per page
- `populate` (object) - Related data to include

### GET /api/instructors/:id
Retrieve a single instructor by ID.

### POST /api/instructors
Create a new instructor.

**Request Body:**
```json
{
  "data": {
    "name": "John Doe",
    "slug": "john-doe",
    "role": "Property Investment Expert",
    "image": 1,
    "bio": "Short biography",
    "longBio": "Detailed biography",
    "specialty": "HDB Investment",
    "experience": "10+ years",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "email": "john@example.com"
    },
    "stats": {
      "coursesCreated": 5
    },
    "showOnFacilitatorsPage": true
  }
}
```

### PUT /api/instructors/:id
Update an existing instructor.

### DELETE /api/instructors/:id
Delete an instructor.

### GET /api/instructors/stats
Get instructor statistics.

## Review API

### GET /api/reviews
Retrieve all reviews with filtering.

**Query Parameters:**
- `courseId` (number) - Filter by course ID
- `rating` (number) - Filter by rating (1-5)
- `verified` (boolean) - Filter verified reviews
- `userId` (number) - Filter by user ID
- `sort` (string) - Sort field
- `pagination[page]` (number) - Page number
- `pagination[pageSize]` (number) - Items per page
- `populate` (object) - Related data to include

### GET /api/reviews/:id
Retrieve a single review by ID.

### POST /api/reviews
Create a new review.

**Request Body:**
```json
{
  "data": {
    "course": 1,
    "user": 1,
    "rating": 5,
    "title": "Excellent Course!",
    "comment": "This course provided valuable insights...",
    "verified": true
  }
}
```

### PUT /api/reviews/:id
Update an existing review.

### DELETE /api/reviews/:id
Delete a review.

### GET /api/reviews/stats
Get review statistics.

## Error Handling

The API returns consistent error responses:

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Validation failed",
    "details": "Title is required, SKU already exists"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting for authentication endpoints:
- Login attempts: 10 requests per minute per IP
- Other endpoints: No specific limits (configurable)

## Data Validation

### Course Validation
- Required fields: title, sku, price, category, type
- SKU must be unique
- Price must be positive number
- Sale price must be less than regular price
- Rating must be between 0-5
- Status must be one of: Published, Draft, Archived
- Type must be one of: Course, Book, Event, Webinar, Masterclass, Workshop

### Instructor Validation
- Required fields: name, role, bio
- Bio must be at least 50 characters
- Social links must be valid URLs
- Email must be valid format

### Review Validation
- Required fields: course, user, rating, title, comment
- Rating must be between 1-5
- Title must be at least 5 characters
- Comment must be at least 10 characters
- User can only review a course once

## Permissions

### Role-Based Access Control
- **Admin**: Full access to all endpoints
- **Editor**: Can create, update, delete courses, instructors, and reviews
- **Viewer**: Read-only access to all content
- **Authenticated**: Can create reviews

### Public Access
- Published courses are publicly accessible
- All instructors are publicly accessible
- All reviews are publicly accessible

## File Upload

The API supports image uploads for courses and instructors:
- Supported formats: JPEG, PNG, WebP
- Automatic image optimization and resizing
- CDN integration for optimized delivery

## Search and Filtering

### Full-Text Search
- Search across course titles and descriptions
- Search across instructor names and specialties
- Case-insensitive search

### Advanced Filtering
- Multiple filter combinations supported
- Range filtering for prices and ratings
- Boolean filtering for featured courses
- Category and type filtering

### Sorting
- Sort by any field in ascending or descending order
- Multiple sort fields supported
- Default sorting by title (ascending)

## Performance Optimization

### Pagination
- Default page size: 25 items
- Configurable page size up to 100 items
- Total count and page information included

### Database Indexing
- Indexed fields: title, sku, category, type, status, rating
- Optimized queries for frequently accessed data

### Caching
- Frequently accessed data cached
- Cache invalidation on updates
- CDN integration for static assets

## Development and Testing

### Environment Variables
```bash
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret
LOGIN_RATE_LIMIT_WINDOW_SEC=60
LOGIN_RATE_LIMIT_MAX=10
```

### Testing Endpoints
Use tools like Postman, Insomnia, or curl to test the API endpoints. Make sure to include proper authentication headers for protected endpoints.

### Example cURL Commands

**Get all courses:**
```bash
curl -X GET "http://localhost:1337/api/courses" \
  -H "Content-Type: application/json"
```

**Create a course (authenticated):**
```bash
curl -X POST "http://localhost:1337/api/courses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "data": {
      "title": "Test Course",
      "sku": "TEST-001",
      "price": 99.99,
      "category": "Test Category",
      "type": "Course"
    }
  }'
```

This API provides a comprehensive foundation for the PLB Assembly 2.0 course management system with all the features required for the admin interface and public-facing functionality.
