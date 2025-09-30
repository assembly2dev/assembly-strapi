# Course API Documentation

## Base URL
```
http://localhost:1337/api
```

## Authentication
All course endpoints are currently **public** (no authentication required).

## Course Endpoints

### 1. GET /api/courses - List All Courses

**Description**: Retrieve a paginated list of all courses with optional filtering and sorting.

**Request**:
```http
GET /api/courses
```

**Query Parameters**:
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search across title, description, and SKU | `?search=investment` |
| `category` | string | Filter by category | `?category=HDB Investment` |
| `type` | string | Filter by type | `?type=Course` |
| `status` | string | Filter by status | `?status=Published` |
| `stock` | string | Filter by stock status | `?stock=In stock` |
| `featured` | boolean | Filter featured courses | `?featured=true` |
| `minPrice` | number | Minimum price filter | `?minPrice=100` |
| `maxPrice` | number | Maximum price filter | `?maxPrice=500` |
| `minRating` | number | Minimum rating filter | `?minRating=4` |
| `sort` | string | Sort field and direction | `?sort=title:asc` |
| `pagination[page]` | number | Page number (default: 1) | `?pagination[page]=1` |
| `pagination[pageSize]` | number | Items per page (default: 25) | `?pagination[pageSize]=10` |

**Example Request**:
```bash
GET /api/courses?search=investment&category=HDB Investment&status=Published&sort=title:asc&pagination[page]=1&pagination[pageSize]=10
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "plgz80ajwg5tij1e8pej2miy",
      "title": "Updated Test Investment Course",
      "level": "Intermediate",
      "duration": "6 weeks",
      "category": "HDB Investment",
      "categories": null,
      "price": 399.99,
      "type": "Course",
      "rating": 0,
      "reviewCount": 0,
      "tags": null,
      "slug": "test-investment-course",
      "totalHours": null,
      "createdAt": "2025-09-30T04:10:26.478Z",
      "updatedAt": "2025-09-30T04:11:36.187Z",
      "publishedAt": "2025-09-30T04:11:35.955Z",
      "locale": null,
      "description": "Updated description for the test course with more details",
      "shortDescription": "Updated learning description",
      "sku": "TEST-001",
      "salePrice": null,
      "status": "Published",
      "featured": true,
      "virtual": true,
      "downloadable": false,
      "stock": "In stock",
      "stockQuantity": null,
      "students": 0,
      "highlights": null,
      "requirements": null,
      "targetAudience": null,
      "whatYouWillLearn": null,
      "previewUrl": null,
      "datePublished": "2025-09-30T04:11:35.780Z",
      "image": null,
      "instructors": [],
      "reviews": []
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### 2. GET /api/courses/:id - Get Single Course

**Description**: Retrieve a specific course by its ID.

**Request**:
```http
GET /api/courses/{id}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Course ID |

**Example Request**:
```bash
GET /api/courses/1
```

**Response**:
```json
{
  "data": {
    "id": 1,
    "documentId": "plgz80ajwg5tij1e8pej2miy",
    "title": "Updated Test Investment Course",
    "level": "Intermediate",
    "duration": "6 weeks",
    "category": "HDB Investment",
    "categories": null,
    "price": 399.99,
    "type": "Course",
    "rating": 0,
    "reviewCount": 0,
    "tags": null,
    "slug": "test-investment-course",
    "totalHours": null,
    "createdAt": "2025-09-30T04:10:26.478Z",
    "updatedAt": "2025-09-30T04:11:36.187Z",
    "publishedAt": "2025-09-30T04:11:35.955Z",
    "locale": null,
    "description": "Updated description for the test course with more details",
    "shortDescription": "Updated learning description",
    "sku": "TEST-001",
    "salePrice": null,
    "status": "Published",
    "featured": true,
    "virtual": true,
    "downloadable": false,
    "stock": "In stock",
    "stockQuantity": null,
    "students": 0,
    "highlights": null,
    "requirements": null,
    "targetAudience": null,
    "whatYouWillLearn": null,
    "previewUrl": null,
    "datePublished": "2025-09-30T04:11:35.780Z",
    "image": null,
    "instructors": [],
    "curriculum": [],
    "reviews": []
  }
}
```

**Error Response** (Course not found):
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Course not found",
    "details": {}
  }
}
```

---

### 3. POST /api/courses - Create New Course

**Description**: Create a new course.

**Request**:
```http
POST /api/courses
Content-Type: application/json
```

**Request Body**:
```json
{
  "data": {
    "title": "string (required)",
    "slug": "string (required)",
    "description": "string (required)",
    "sku": "string (required, unique)",
    "price": "number (required)",
    "category": "string (required)",
    "type": "string (required)",
    "status": "string (optional)",
    "stock": "string (optional)",
    "featured": "boolean (optional)",
    "shortDescription": "string (optional)",
    "learningOutcomes": "array (optional)",
    "prerequisites": "array (optional)",
    "duration": "string (optional)",
    "level": "string (optional)",
    "language": "string (optional)",
    "maxStudents": "number (optional)",
    "currentStudents": "number (optional)",
    "rating": "number (optional)",
    "totalReviews": "number (optional)"
  }
}
```

**Required Fields**:
- `title`: Course title
- `slug`: URL-friendly identifier (must be unique)
- `description`: Course description
- `sku`: Stock Keeping Unit (must be unique)
- `price`: Course price
- `category`: Course category
- `type`: Course type

**Field Types and Options**:
- `type`: "Course" | "Book" | "Event" | "Webinar" | "Masterclass" | "Workshop"
- `status`: "Published" | "Draft" | "Archived"
- `stock`: "In stock" | "Limited stock" | "Out of stock"
- `level`: "Beginner" | "Intermediate" | "Advanced"

**Example Request**:
```bash
curl -X POST http://localhost:1337/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Advanced Investment Strategies",
      "slug": "advanced-investment-strategies",
      "description": "A comprehensive course covering advanced investment strategies and portfolio management.",
      "sku": "ADV-001",
      "price": 599.99,
      "category": "HDB Investment",
      "type": "Course",
      "status": "Draft",
      "stock": "In stock",
      "featured": false,
      "shortDescription": "Master advanced investment techniques",
      "learningOutcomes": [
        "Understand complex investment strategies",
        "Analyze market trends and patterns",
        "Build diversified portfolios"
      ],
      "prerequisites": [
        "Basic financial knowledge",
        "Understanding of market fundamentals"
      ],
      "duration": "8 weeks",
      "level": "Advanced",
      "language": "English",
      "maxStudents": 30,
      "currentStudents": 0,
      "rating": 0,
      "totalReviews": 0
    }
  }'
```

**Success Response**:
```json
{
  "data": {
    "id": 3,
    "documentId": "new-document-id",
    "title": "Advanced Investment Strategies",
    "level": "Advanced",
    "duration": "8 weeks",
    "category": "HDB Investment",
    "categories": null,
    "price": 599.99,
    "type": "Course",
    "rating": 0,
    "reviewCount": 0,
    "tags": null,
    "slug": "advanced-investment-strategies",
    "totalHours": null,
    "createdAt": "2025-09-30T04:15:00.000Z",
    "updatedAt": "2025-09-30T04:15:00.000Z",
    "publishedAt": "2025-09-30T04:15:00.000Z",
    "locale": null,
    "description": "A comprehensive course covering advanced investment strategies and portfolio management.",
    "shortDescription": "Master advanced investment techniques",
    "sku": "ADV-001",
    "salePrice": null,
    "status": "Draft",
    "featured": false,
    "virtual": true,
    "downloadable": false,
    "stock": "In stock",
    "stockQuantity": null,
    "students": 0,
    "highlights": null,
    "requirements": null,
    "targetAudience": null,
    "whatYouWillLearn": null,
    "previewUrl": null,
    "datePublished": null,
    "image": null,
    "instructors": []
  }
}
```

**Error Response** (Missing required fields):
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Missing required fields: title, sku, price, category, type",
    "details": {}
  }
}
```

**Error Response** (Duplicate SKU):
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "SKU already exists",
    "details": {}
  }
}
```

---

### 4. PUT /api/courses/:id - Update Course

**Description**: Update an existing course.

**Request**:
```http
PUT /api/courses/{id}
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Course ID to update |

**Request Body**:
```json
{
  "data": {
    "title": "string (optional)",
    "description": "string (optional)",
    "price": "number (optional)",
    "status": "string (optional)",
    "featured": "boolean (optional)",
    "shortDescription": "string (optional)",
    "learningOutcomes": "array (optional)",
    "prerequisites": "array (optional)",
    "duration": "string (optional)",
    "level": "string (optional)",
    "language": "string (optional)",
    "maxStudents": "number (optional)",
    "currentStudents": "number (optional)",
    "rating": "number (optional)",
    "totalReviews": "number (optional)"
  }
}
```

**Note**: Only include fields you want to update. All fields are optional for updates.

**Example Request**:
```bash
curl -X PUT http://localhost:1337/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Updated Course Title",
      "price": 499.99,
      "status": "Published",
      "featured": true,
      "level": "Intermediate"
    }
  }'
```

**Success Response**:
```json
{
  "data": {
    "id": 1,
    "documentId": "plgz80ajwg5tij1e8pej2miy",
    "title": "Updated Course Title",
    "level": "Intermediate",
    "duration": "6 weeks",
    "category": "HDB Investment",
    "categories": null,
    "price": 499.99,
    "type": "Course",
    "rating": 0,
    "reviewCount": 0,
    "tags": null,
    "slug": "test-investment-course",
    "totalHours": null,
    "createdAt": "2025-09-30T04:10:26.478Z",
    "updatedAt": "2025-09-30T04:16:00.000Z",
    "publishedAt": "2025-09-30T04:16:00.000Z",
    "locale": null,
    "description": "Updated description for the test course with more details",
    "shortDescription": "Updated learning description",
    "sku": "TEST-001",
    "salePrice": null,
    "status": "Published",
    "featured": true,
    "virtual": true,
    "downloadable": false,
    "stock": "In stock",
    "stockQuantity": null,
    "students": 0,
    "highlights": null,
    "requirements": null,
    "targetAudience": null,
    "whatYouWillLearn": null,
    "previewUrl": null,
    "datePublished": "2025-09-30T04:16:00.000Z",
    "image": null,
    "instructors": []
  }
}
```

**Error Response** (Course not found):
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Course not found",
    "details": {}
  }
}
```

---

### 5. DELETE /api/courses/:id - Delete Course

**Description**: Delete a course by its ID.

**Request**:
```http
DELETE /api/courses/{id}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Course ID to delete |

**Example Request**:
```bash
curl -X DELETE http://localhost:1337/api/courses/1
```

**Success Response**:
```json
{
  "data": {
    "id": "1"
  }
}
```

**Error Response** (Course not found):
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Course not found",
    "details": {}
  }
}
```

---

## Course Data Model

### Course Object Structure

```typescript
interface Course {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  salePrice?: number;
  category: string;
  categories?: any;
  type: "Course" | "Book" | "Event" | "Webinar" | "Masterclass" | "Workshop";
  status: "Published" | "Draft" | "Archived";
  stock: "In stock" | "Limited stock" | "Out of stock";
  stockQuantity?: number;
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  level?: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  language?: string;
  maxStudents?: number;
  students: number;
  rating: number;
  reviewCount: number;
  totalHours?: number;
  tags?: any;
  highlights?: any;
  requirements?: any;
  targetAudience?: any;
  whatYouWillLearn?: any;
  previewUrl?: string;
  datePublished?: string;
  image?: any;
  instructors: any[];
  curriculum: any[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**:
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Error description",
    "details": {}
  }
}
```

**404 Not Found**:
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Course not found",
    "details": {}
  }
}
```

**500 Internal Server Error**:
```json
{
  "data": null,
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Internal server error",
    "details": {}
  }
}
```

---

## Frontend Integration Examples

### JavaScript/TypeScript

```typescript
// API Client Class
class CourseAPI {
  private baseURL = 'http://localhost:1337/api';

  async getCourses(params?: {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${this.baseURL}/courses?${queryParams}`);
    return response.json();
  }

  async getCourse(id: number) {
    const response = await fetch(`${this.baseURL}/courses/${id}`);
    return response.json();
  }

  async createCourse(courseData: Partial<Course>) {
    const response = await fetch(`${this.baseURL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: courseData }),
    });
    return response.json();
  }

  async updateCourse(id: number, courseData: Partial<Course>) {
    const response = await fetch(`${this.baseURL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: courseData }),
    });
    return response.json();
  }

  async deleteCourse(id: number) {
    const response = await fetch(`${this.baseURL}/courses/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

// Usage Examples
const courseAPI = new CourseAPI();

// Get all courses
const courses = await courseAPI.getCourses({
  search: 'investment',
  status: 'Published',
  page: 1,
  pageSize: 10
});

// Create a new course
const newCourse = await courseAPI.createCourse({
  title: 'New Course',
  slug: 'new-course',
  description: 'Course description',
  sku: 'NEW-001',
  price: 299.99,
  category: 'HDB Investment',
  type: 'Course'
});

// Update a course
const updatedCourse = await courseAPI.updateCourse(1, {
  title: 'Updated Title',
  price: 399.99,
  featured: true
});

// Delete a course
const deleteResult = await courseAPI.deleteCourse(1);
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  createCourse: (data: Partial<Course>) => Promise<void>;
  updateCourse: (id: number, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:1337/api/courses');
      const data = await response.json();
      setCourses(data.data);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: Partial<Course>) => {
    try {
      const response = await fetch('http://localhost:1337/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: courseData }),
      });
      const result = await response.json();
      if (result.data) {
        setCourses(prev => [...prev, result.data]);
      }
    } catch (err) {
      setError('Failed to create course');
    }
  };

  const updateCourse = async (id: number, courseData: Partial<Course>) => {
    try {
      const response = await fetch(`http://localhost:1337/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: courseData }),
      });
      const result = await response.json();
      if (result.data) {
        setCourses(prev => prev.map(course => 
          course.id === id ? result.data : course
        ));
      }
    } catch (err) {
      setError('Failed to update course');
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await fetch(`http://localhost:1337/api/courses/${id}`, {
        method: 'DELETE',
      });
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
```

---

## Testing the API

You can test the API using the provided test script:

```bash
# Run the comprehensive test suite
node scripts/test-course-simple.js
```

Or test individual endpoints using curl:

```bash
# Get all courses
curl http://localhost:1337/api/courses

# Get a specific course
curl http://localhost:1337/api/courses/1

# Create a new course
curl -X POST http://localhost:1337/api/courses \
  -H "Content-Type: application/json" \
  -d '{"data":{"title":"Test Course","slug":"test-course","sku":"TEST-001","price":299.99,"category":"HDB Investment","type":"Course","description":"Test description"}}'

# Update a course
curl -X PUT http://localhost:1337/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{"data":{"title":"Updated Title","price":399.99}}'

# Delete a course
curl -X DELETE http://localhost:1337/api/courses/1
```

---

## Notes for Frontend Developers

1. **Data Structure**: All responses follow the Strapi format with `data` and `meta` fields
2. **Pagination**: Use the `meta.pagination` object for pagination controls
3. **Error Handling**: Always check for `error` field in responses
4. **Required Fields**: Ensure all required fields are provided when creating courses
5. **Unique Fields**: `slug` and `sku` must be unique across all courses
6. **Timestamps**: All courses include `createdAt`, `updatedAt`, and `publishedAt` timestamps
7. **Status Management**: Use `status` field to control course visibility ("Published", "Draft", "Archived")
8. **Featured Courses**: Use `featured` boolean to highlight important courses
9. **Stock Management**: Use `stock` field to manage course availability
10. **Search**: Use the `search` parameter to find courses by title, description, or SKU
