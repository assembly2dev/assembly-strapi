# PLB Assembly 2.0 Course Management System

## Overview
This is a comprehensive course management system built with Strapi for the PLB Assembly 2.0 platform. It provides a complete API backend for managing courses, instructors, and reviews with advanced features like filtering, authentication, validation, and analytics.

## Features

### Core Content Types
- **Courses**: Complete course management with curriculum, pricing, and metadata
- **Instructors**: Instructor profiles with social links and statistics
- **Reviews**: User reviews with rating system and verification

### Advanced Features
- **Authentication & Authorization**: Role-based access control
- **Data Validation**: Comprehensive validation for all content types
- **Search & Filtering**: Advanced search and filtering capabilities
- **Bulk Operations**: Bulk update functionality for courses
- **Analytics**: Statistics and analytics for courses, instructors, and reviews
- **File Upload**: Image upload support with optimization
- **Rate Limiting**: API rate limiting for security
- **Error Handling**: Consistent error responses and logging

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL or SQLite database
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database and other configuration
   ```

4. Start the development server:
   ```bash
   npm run develop
   ```

5. Access the admin panel at `http://localhost:1337/admin`

### Import Sample Data
To populate the system with sample data:
```bash
npm run import-sample-data
```

## API Endpoints

### Course API
- `GET /api/courses` - List courses with filtering
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/bulk-update` - Bulk update courses
- `GET /api/courses/stats` - Get course statistics

### Instructor API
- `GET /api/instructors` - List instructors
- `GET /api/instructors/:id` - Get instructor details
- `POST /api/instructors` - Create new instructor
- `PUT /api/instructors/:id` - Update instructor
- `DELETE /api/instructors/:id` - Delete instructor
- `GET /api/instructors/stats` - Get instructor statistics

### Review API
- `GET /api/reviews` - List reviews
- `GET /api/reviews/:id` - Get review details
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/stats` - Get review statistics

## Content Type Structure

### Course Fields
- **Basic Info**: title, slug, description, shortDescription, sku
- **Pricing**: price, salePrice
- **Status**: status (Published/Draft/Archived), type, category
- **Content**: level, duration, totalHours, curriculum
- **Media**: image, previewUrl
- **Metadata**: featured, virtual, downloadable, stock, stockQuantity
- **Statistics**: students, rating, reviewCount
- **Relations**: instructors, reviews
- **Arrays**: categories, tags, highlights, requirements, targetAudience, whatYouWillLearn

### Instructor Fields
- **Basic Info**: name, slug, role, bio, longBio
- **Media**: image
- **Expertise**: specialty, experience
- **Relations**: courses
- **Components**: socialLinks, stats
- **Settings**: showOnFacilitatorsPage

### Review Fields
- **Content**: title, comment, rating
- **Relations**: course, user
- **Metadata**: verified

## Components

### CourseModule Component
- **Fields**: id, title, duration, lessons
- **Usage**: Repeatable component for course curriculum

### Lesson Component
- **Fields**: id, title, type, duration, content, videoUrl, order
- **Usage**: Individual lessons within modules

### SocialLinks Component
- **Fields**: linkedin, twitter, instagram, whatsapp, email
- **Usage**: Social media links for instructors

### InstructorStats Component
- **Fields**: coursesCreated
- **Usage**: Statistics for instructors

## Authentication & Authorization

### Public Endpoints
- Course listing and details (published only)
- Instructor listing and details
- Review listing and details

### Protected Endpoints
- Course creation, updates, and deletion
- Instructor management
- Review management
- Statistics endpoints

### Role-Based Access
- **Admin**: Full access to all endpoints
- **Editor**: Can manage courses, instructors, and reviews
- **Viewer**: Read-only access
- **Authenticated**: Can create reviews

## Data Validation

### Course Validation
- Required fields: title, sku, price, category, type
- SKU uniqueness validation
- Price validation (positive numbers)
- Rating validation (0-5 range)
- Enum validation for status, type, and stock

### Instructor Validation
- Required fields: name, role, bio
- Bio length validation (minimum 50 characters)
- Social link URL validation
- Email format validation

### Review Validation
- Required fields: course, user, rating, title, comment
- Rating validation (1-5 range)
- Title and comment length validation
- Duplicate review prevention

## Search & Filtering

### Course Filtering
- Text search across title, description, and SKU
- Category and type filtering
- Status and stock filtering
- Price range filtering
- Rating filtering
- Featured course filtering

### Instructor Filtering
- Text search across name, specialty, and role
- Specialty filtering
- Facilitators page visibility filtering

### Review Filtering
- Course-based filtering
- Rating filtering
- Verification status filtering
- User-based filtering

## Error Handling

### Error Response Format
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
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Performance Optimization

### Pagination
- Default page size: 25 items
- Configurable page size up to 100 items
- Total count and page information included

### Database Indexing
- Indexed fields for frequently queried data
- Optimized queries for better performance

### Caching
- Frequently accessed data caching
- Cache invalidation on updates

## Development

### Project Structure
```
src/
├── api/
│   ├── course/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   └── content-types/
│   ├── instructor/
│   └── review/
├── components/
│   └── shared/
├── middlewares/
└── bootstrap.ts
```

### Adding New Features
1. Create content type schema
2. Implement controller with CRUD operations
3. Add routes with proper authentication
4. Create services for business logic
5. Add validation and error handling
6. Update documentation

### Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Get all courses
curl -X GET "http://localhost:1337/api/courses"

# Create a course (authenticated)
curl -X POST "http://localhost:1337/api/courses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"data": {"title": "Test Course", "sku": "TEST-001", "price": 99.99, "category": "Test", "type": "Course"}}'
```

## Deployment

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret
LOGIN_RATE_LIMIT_WINDOW_SEC=60
LOGIN_RATE_LIMIT_MAX=10
```

### Production Considerations
- Use PostgreSQL for production
- Set up proper JWT secrets
- Configure rate limiting
- Set up monitoring and logging
- Use CDN for file uploads
- Enable HTTPS

## Support

For questions or issues:
1. Check the API documentation
2. Review the error logs
3. Test with sample data
4. Check authentication and permissions

## License

This project is part of the PLB Assembly 2.0 platform.
