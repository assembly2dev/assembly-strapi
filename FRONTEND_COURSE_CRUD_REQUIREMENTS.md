# Frontend Course CRUD API Requirements

## Overview
This document outlines the requirements for implementing a complete Course Management interface that integrates with the Strapi backend API. The frontend should provide full CRUD (Create, Read, Update, Delete) functionality for course management.

## API Base URL
```
https://romantic-rhythm-4335e3f6aa.strapiapp.com
```

## Authentication
- **Status**: Currently public endpoints (no authentication required)
- **Future**: Authentication may be added for admin operations
- **Headers**: `Content-Type: application/json`

---

## 1. Course Data Model

### Core Course Object Structure
```typescript
interface Course {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string; // Rich text
  shortDescription?: string;
  sku: string; // Unique identifier
  price: number; // Decimal
  salePrice?: number; // Decimal
  status: 'Published' | 'Draft' | 'Archived';
  type: 'Course' | 'Book' | 'Event' | 'Webinar' | 'Masterclass' | 'Workshop';
  category: string;
  categories?: string[]; // JSON array
  level?: string; // e.g., "Beginner", "Intermediate", "Advanced"
  duration?: string; // e.g., "6 weeks", "3 hours 55 minutes"
  totalHours?: number; // Decimal
  image?: MediaObject; // Media relation
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  stock: 'In stock' | 'Limited stock' | 'Out of stock';
  stockQuantity?: number;
  students: number;
  rating: number; // 0-5 decimal
  reviewCount: number;
  tags?: string[]; // JSON array
  instructors: Instructor[]; // Many-to-many relation
  curriculum?: CourseModule[]; // Component array
  highlights?: string[]; // JSON array
  requirements?: string[]; // JSON array
  targetAudience?: string[]; // JSON array
  whatYouWillLearn?: string[]; // JSON array
  previewUrl?: string;
  datePublished?: string; // ISO datetime
  reviews: Review[]; // One-to-many relation
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  publishedAt: string; // ISO datetime
}
```

### Media Object Structure
```typescript
interface MediaObject {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. API Endpoints

### 2.1 GET /api/courses - List All Courses

**Endpoint**: `GET /api/courses`

**Query Parameters**:
- `pagination[page]`: Page number (default: 1)
- `pagination[pageSize]`: Items per page (default: 25, max: 100)
- `filters[category]`: Filter by category
- `filters[type]`: Filter by type
- `filters[level]`: Filter by level
- `filters[status]`: Filter by status
- `filters[featured]`: Filter featured courses (true/false)
- `filters[price][$gte]`: Minimum price
- `filters[price][$lte]`: Maximum price
- `sort`: Sort field (e.g., `title:asc`, `price:desc`, `createdAt:desc`)
- `populate`: Relations to populate (e.g., `image,instructors,reviews`)

**Example Request**:
```javascript
const response = await fetch('/api/courses?pagination[page]=1&pagination[pageSize]=10&filters[featured]=true&populate=image,instructors');
```

**Response Structure**:
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "plgz80ajwg5tij1e8pej2miy",
      "title": "Updated Test Investment Course",
      "slug": "test-investment-course",
      "description": "Updated description for the test course...",
      "price": 399.99,
      "status": "Published",
      "featured": true,
      "image": { /* MediaObject */ },
      "instructors": [ /* Instructor objects */ ],
      "createdAt": "2025-09-30T11:10:26.478Z",
      "updatedAt": "2025-09-30T11:11:36.187Z"
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

### 2.2 GET /api/courses/:id - Get Single Course

**Endpoint**: `GET /api/courses/:id`

**Query Parameters**:
- `populate`: Relations to populate (e.g., `image,instructors,reviews,curriculum`)

**Example Request**:
```javascript
const response = await fetch('/api/courses/1?populate=image,instructors,reviews,curriculum');
```

**Response Structure**:
```json
{
  "data": {
    "id": 1,
    "documentId": "plgz80ajwg5tij1e8pej2miy",
    "title": "Updated Test Investment Course",
    "slug": "test-investment-course",
    "description": "Updated description for the test course...",
    "price": 399.99,
    "status": "Published",
    "featured": true,
    "image": { /* MediaObject */ },
    "instructors": [ /* Instructor objects */ ],
    "reviews": [ /* Review objects */ ],
    "curriculum": [ /* CourseModule objects */ ],
    "createdAt": "2025-09-30T11:10:26.478Z",
    "updatedAt": "2025-09-30T11:11:36.187Z"
  }
}
```

### 2.3 POST /api/courses - Create New Course

**Endpoint**: `POST /api/courses`

**Request Body**:
```json
{
  "data": {
    "title": "Advanced Property Investment Strategies",
    "level": "Advanced",
    "duration": "8 weeks",
    "category": "Property Investment",
    "price": 599.99,
    "type": "Course",
    "slug": "advanced-property-investment",
    "description": "Learn advanced strategies for property investment...",
    "shortDescription": "Master advanced property investment techniques",
    "sku": "ADV-001",
    "status": "Published",
    "featured": false,
    "virtual": true,
    "downloadable": false,
    "stock": "In stock",
    "students": 0
  }
}
```

**Required Fields**:
- `title` (string)
- `sku` (string, unique)
- `price` (number)
- `category` (string)
- `type` (enum)
- `status` (enum)

**Response**: Returns the created course object with generated fields (id, timestamps, etc.)

### 2.4 PUT /api/courses/:id - Update Course

**Endpoint**: `PUT /api/courses/:id`

**Request Body**:
```json
{
  "data": {
    "title": "Updated Course Title",
    "price": 799.99,
    "featured": true,
    "students": 15
  }
}
```

**Response**: Returns the updated course object

### 2.5 DELETE /api/courses/:id - Delete Course

**Endpoint**: `DELETE /api/courses/:id`

**Response**:
```json
{
  "data": {
    "id": "4"
  }
}
```

---

## 3. Frontend Implementation Requirements

### 3.1 Course List Page

**Features Required**:
- [ ] Display courses in a responsive grid/list layout
- [ ] Implement pagination controls
- [ ] Add filtering by category, type, level, status, featured
- [ ] Add price range filtering
- [ ] Implement sorting options (title, price, date, rating)
- [ ] Show course thumbnails, titles, prices, ratings
- [ ] Display "Featured" badges for featured courses
- [ ] Show stock status indicators
- [ ] Implement search functionality
- [ ] Add loading states and error handling

**UI Components Needed**:
- CourseCard component
- FilterPanel component
- Pagination component
- SearchBar component
- SortDropdown component

### 3.2 Course Detail Page

**Features Required**:
- [ ] Display full course information
- [ ] Show course image gallery
- [ ] Display instructor information
- [ ] Show curriculum/modules
- [ ] Display reviews and ratings
- [ ] Show pricing (regular and sale prices)
- [ ] Display course highlights and requirements
- [ ] Show target audience and learning outcomes
- [ ] Implement enrollment/booking functionality
- [ ] Add social sharing options

**UI Components Needed**:
- CourseHeader component
- CourseImageGallery component
- InstructorCard component
- CurriculumList component
- ReviewList component
- PricingCard component
- EnrollmentButton component

### 3.3 Course Management (Admin)

**Features Required**:
- [ ] Course creation form with validation
- [ ] Course editing form
- [ ] Bulk operations (delete, update status)
- [ ] Image upload functionality
- [ ] Rich text editor for descriptions
- [ ] SKU validation and uniqueness checking
- [ ] Price validation (positive numbers, sale price < regular price)
- [ ] Status management (Draft, Published, Archived)
- [ ] Instructor assignment interface
- [ ] Curriculum management
- [ ] Preview functionality

**UI Components Needed**:
- CourseForm component
- ImageUploader component
- RichTextEditor component
- InstructorSelector component
- CurriculumBuilder component
- StatusToggle component
- BulkActionToolbar component

### 3.4 Form Validation Rules

**Required Field Validation**:
- Title: Required, min 3 characters, max 200 characters
- SKU: Required, unique, alphanumeric with hyphens/underscores
- Price: Required, positive number, max 2 decimal places
- Category: Required, from predefined list
- Type: Required, from enum values
- Status: Required, from enum values

**Optional Field Validation**:
- Sale Price: Must be less than regular price if provided
- Rating: Must be between 0 and 5
- Stock Quantity: Must be non-negative integer
- Students Count: Must be non-negative integer
- Duration: String format validation
- Total Hours: Positive decimal number

**Custom Validation**:
- SKU uniqueness check (async validation)
- Price vs Sale Price comparison
- Image file type and size validation
- Rich text content sanitization

---

## 4. Error Handling

### 4.1 API Error Responses

**400 Bad Request**:
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Validation error",
    "details": {
      "error": "Missing required fields: title, sku, price"
    }
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

### 4.2 Frontend Error Handling

**Required Error States**:
- [ ] Network connection errors
- [ ] API timeout handling
- [ ] Validation error display
- [ ] Server error messages
- [ ] Loading state management
- [ ] Retry mechanisms
- [ ] User-friendly error messages

---

## 5. Performance Requirements

### 5.1 Loading Performance
- [ ] Implement lazy loading for course images
- [ ] Use pagination to limit initial data load
- [ ] Implement virtual scrolling for large lists
- [ ] Cache API responses appropriately
- [ ] Optimize image sizes and formats

### 5.2 User Experience
- [ ] Show loading skeletons during data fetch
- [ ] Implement optimistic updates for better UX
- [ ] Add debounced search functionality
- [ ] Provide immediate feedback for user actions
- [ ] Implement progressive loading for course details

---

## 6. Testing Requirements

### 6.1 Unit Tests
- [ ] Test all API service functions
- [ ] Test form validation logic
- [ ] Test data transformation utilities
- [ ] Test error handling scenarios

### 6.2 Integration Tests
- [ ] Test complete CRUD workflows
- [ ] Test filtering and sorting functionality
- [ ] Test pagination behavior
- [ ] Test form submission and validation

### 6.3 E2E Tests
- [ ] Test course creation workflow
- [ ] Test course editing workflow
- [ ] Test course deletion workflow
- [ ] Test filtering and search functionality

---

## 7. Accessibility Requirements

### 7.1 WCAG Compliance
- [ ] Proper heading structure (h1, h2, h3)
- [ ] Alt text for all images
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] Focus management

### 7.2 Form Accessibility
- [ ] Proper label associations
- [ ] Error message announcements
- [ ] Required field indicators
- [ ] Field validation feedback

---

## 8. Mobile Responsiveness

### 8.1 Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### 8.2 Mobile-Specific Features
- [ ] Touch-friendly interface elements
- [ ] Swipe gestures for image galleries
- [ ] Optimized form layouts
- [ ] Mobile-specific navigation patterns

---

## 9. Security Considerations

### 9.1 Input Sanitization
- [ ] Sanitize rich text content
- [ ] Validate file uploads
- [ ] Prevent XSS attacks
- [ ] Validate all user inputs

### 9.2 Data Protection
- [ ] Handle sensitive data appropriately
- [ ] Implement proper error logging
- [ ] Secure API communication (HTTPS)
- [ ] Validate API responses

---

## 10. Future Enhancements

### 10.1 Planned Features
- [ ] Course analytics dashboard
- [ ] Advanced search with filters
- [ ] Course recommendations
- [ ] Bulk import/export functionality
- [ ] Course templates
- [ ] Advanced reporting

### 10.2 Integration Points
- [ ] Payment gateway integration
- [ ] Email notification system
- [ ] User management system
- [ ] Content delivery network (CDN)
- [ ] Analytics tracking

---

## 11. Development Guidelines

### 11.1 Code Standards
- Use TypeScript for type safety
- Follow consistent naming conventions
- Implement proper error boundaries
- Use modern React patterns (hooks, context)
- Follow accessibility best practices

### 11.2 State Management
- Use appropriate state management solution
- Implement proper loading states
- Handle optimistic updates
- Cache API responses efficiently

### 11.3 API Integration
- Use consistent API service layer
- Implement proper error handling
- Add request/response interceptors
- Use appropriate HTTP status codes

---

## 12. Deliverables

### 12.1 Phase 1 - Basic CRUD
- [ ] Course list page with basic functionality
- [ ] Course detail page
- [ ] Basic course creation form
- [ ] Course editing functionality
- [ ] Course deletion with confirmation

### 12.2 Phase 2 - Enhanced Features
- [ ] Advanced filtering and sorting
- [ ] Image upload functionality
- [ ] Rich text editor integration
- [ ] Bulk operations
- [ ] Search functionality

### 12.3 Phase 3 - Polish & Optimization
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Error handling enhancements
- [ ] Testing implementation

---

## Contact Information

For questions or clarifications regarding these requirements, please contact the backend development team or refer to the API documentation.

**API Documentation**: Available in the project repository
**Backend Repository**: https://github.com/assembly2dev/assembly-strapi
**Live API**: https://romantic-rhythm-4335e3f6aa.strapiapp.com
