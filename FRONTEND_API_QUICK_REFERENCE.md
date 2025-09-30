# Frontend API Quick Reference Guide

## 🚀 Quick Start

**Base URL**: `https://romantic-rhythm-4335e3f6aa.strapiapp.com`

**Headers**: 
```javascript
{
  'Content-Type': 'application/json'
}
```

---

## 📋 Course CRUD Operations

### 1. List All Courses
```javascript
// GET /api/courses
const courses = await fetch('/api/courses?populate=image,instructors')
  .then(res => res.json());

// With filters
const filteredCourses = await fetch('/api/courses?filters[featured]=true&filters[category]=Property Investment&sort=price:desc')
  .then(res => res.json());
```

### 2. Get Single Course
```javascript
// GET /api/courses/:id
const course = await fetch('/api/courses/1?populate=image,instructors,reviews,curriculum')
  .then(res => res.json());
```

### 3. Create Course
```javascript
// POST /api/courses
const newCourse = await fetch('/api/courses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      title: "New Course Title",
      sku: "NEW-001",
      price: 299.99,
      category: "Investment",
      type: "Course",
      status: "Published",
      description: "Course description here...",
      featured: false,
      virtual: true,
      downloadable: false,
      stock: "In stock"
    }
  })
}).then(res => res.json());
```

### 4. Update Course
```javascript
// PUT /api/courses/:id
const updatedCourse = await fetch('/api/courses/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      title: "Updated Course Title",
      price: 399.99,
      featured: true
    }
  })
}).then(res => res.json());
```

### 5. Delete Course
```javascript
// DELETE /api/courses/:id
const result = await fetch('/api/courses/1', {
  method: 'DELETE'
}).then(res => res.json());
```

---

## 🔍 Query Parameters

### Pagination
```javascript
?pagination[page]=1&pagination[pageSize]=10
```

### Filters
```javascript
// Single value filters
?filters[category]=Investment
?filters[type]=Course
?filters[status]=Published
?filters[featured]=true

// Range filters
?filters[price][$gte]=100&filters[price][$lte]=500

// Multiple filters
?filters[category]=Investment&filters[featured]=true&filters[status]=Published
```

### Sorting
```javascript
?sort=title:asc          // Sort by title ascending
?sort=price:desc         // Sort by price descending
?sort=createdAt:desc     // Sort by creation date descending
```

### Population (Relations)
```javascript
?populate=image                    // Include image
?populate=image,instructors        // Include image and instructors
?populate=*                        // Include all relations
```

---

## 📊 Response Formats

### Success Response
```json
{
  "data": {
    "id": 1,
    "title": "Course Title",
    "price": 299.99,
    "createdAt": "2025-09-30T11:10:26.478Z",
    "updatedAt": "2025-09-30T11:11:36.187Z"
  }
}
```

### List Response with Pagination
```json
{
  "data": [
    { /* course objects */ }
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

### Error Response
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

---

## 🎯 Common Use Cases

### Course List with Filters
```javascript
const getFilteredCourses = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add pagination
  params.append('pagination[page]', filters.page || 1);
  params.append('pagination[pageSize]', filters.pageSize || 10);
  
  // Add filters
  if (filters.category) params.append('filters[category]', filters.category);
  if (filters.featured !== undefined) params.append('filters[featured]', filters.featured);
  if (filters.minPrice) params.append('filters[price][$gte]', filters.minPrice);
  if (filters.maxPrice) params.append('filters[price][$lte]', filters.maxPrice);
  
  // Add sorting
  if (filters.sort) params.append('sort', filters.sort);
  
  // Add population
  params.append('populate', 'image,instructors');
  
  const response = await fetch(`/api/courses?${params}`);
  return response.json();
};
```

### Create Course with Validation
```javascript
const createCourse = async (courseData) => {
  // Validate required fields
  const required = ['title', 'sku', 'price', 'category', 'type'];
  const missing = required.filter(field => !courseData[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: courseData })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create course');
  }
  
  return response.json();
};
```

### Update Course with Error Handling
```javascript
const updateCourse = async (id, updates) => {
  try {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updates })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update course');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
};
```

---

## 🚨 Error Handling Patterns

### Network Error Handling
```javascript
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Network error
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    throw error;
  }
};
```

### Validation Error Display
```javascript
const displayValidationErrors = (error) => {
  if (error.status === 400) {
    const details = error.details?.error;
    if (details) {
      return `Validation Error: ${details}`;
    }
  }
  return error.message || 'An unexpected error occurred';
};
```

---

## 📱 React Hook Examples

### Custom Hook for Course List
```javascript
import { useState, useEffect } from 'react';

const useCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getFilteredCourses(filters);
        setCourses(response.data);
        setPagination(response.meta.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  return { courses, loading, error, pagination };
};
```

### Custom Hook for Single Course
```javascript
const useCourse = (id) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${id}?populate=image,instructors,reviews`);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message);
        }
        
        setCourse(data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { course, loading, error };
};
```

---

## 🎨 UI Component Examples

### Course Card Component
```javascript
const CourseCard = ({ course }) => (
  <div className="course-card">
    {course.image && (
      <img 
        src={course.image.url} 
        alt={course.image.alternativeText || course.title}
        className="course-image"
      />
    )}
    <div className="course-content">
      <h3 className="course-title">{course.title}</h3>
      <p className="course-category">{course.category}</p>
      <div className="course-price">
        {course.salePrice ? (
          <>
            <span className="sale-price">${course.salePrice}</span>
            <span className="regular-price">${course.price}</span>
          </>
        ) : (
          <span className="price">${course.price}</span>
        )}
      </div>
      {course.featured && <span className="featured-badge">Featured</span>}
    </div>
  </div>
);
```

### Course Form Component
```javascript
const CourseForm = ({ course, onSubmit }) => {
  const [formData, setFormData] = useState(course || {});
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price *</label>
        <input
          type="number"
          id="price"
          step="0.01"
          min="0"
          value={formData.price || ''}
          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Course'}
      </button>
      
      {errors.submit && <div className="error">{errors.submit}</div>}
    </form>
  );
};
```

---

## 🔧 Utility Functions

### API Service Class
```javascript
class CourseApiService {
  constructor(baseUrl = 'https://romantic-rhythm-4335e3f6aa.strapiapp.com') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  async getCourses(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    return this.request(`/api/courses?${params}`);
  }

  async getCourse(id) {
    return this.request(`/api/courses/${id}?populate=image,instructors,reviews`);
  }

  async createCourse(data) {
    return this.request('/api/courses', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  async updateCourse(id, data) {
    return this.request(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  }

  async deleteCourse(id) {
    return this.request(`/api/courses/${id}`, {
      method: 'DELETE',
    });
  }
}

export const courseApi = new CourseApiService();
```

---

## 📝 Testing Examples

### API Service Tests
```javascript
import { courseApi } from './courseApi';

describe('CourseApiService', () => {
  test('should fetch courses', async () => {
    const courses = await courseApi.getCourses();
    expect(courses.data).toBeInstanceOf(Array);
    expect(courses.meta.pagination).toBeDefined();
  });

  test('should create course', async () => {
    const courseData = {
      title: 'Test Course',
      sku: 'TEST-001',
      price: 99.99,
      category: 'Test',
      type: 'Course',
      status: 'Published'
    };
    
    const result = await courseApi.createCourse(courseData);
    expect(result.data.title).toBe(courseData.title);
  });
});
```

---

## 🚀 Getting Started Checklist

- [ ] Set up API base URL
- [ ] Create API service layer
- [ ] Implement error handling
- [ ] Create course data types/interfaces
- [ ] Build course list component
- [ ] Build course detail component
- [ ] Create course form component
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Add form validation
- [ ] Test all CRUD operations
- [ ] Add responsive design
- [ ] Implement accessibility features

---

**Need Help?** Check the full requirements document: `FRONTEND_COURSE_CRUD_REQUIREMENTS.md`
