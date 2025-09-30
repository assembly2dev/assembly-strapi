/**
 * Validation middleware for API requests
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Skip validation for GET and DELETE requests
    if (ctx.method === 'GET' || ctx.method === 'DELETE') {
      return await next();
    }
    
    try {
      // Validate request body structure
      if (ctx.request.body && !ctx.request.body.data) {
        return ctx.badRequest('Request body must contain a "data" field');
      }
      
      // Content type specific validation
      const path = ctx.path;
      
      if (path.includes('/courses')) {
        await validateCourseData(ctx);
      } else if (path.includes('/instructors')) {
        await validateInstructorData(ctx);
      } else if (path.includes('/reviews')) {
        await validateReviewData(ctx);
      }
      
      await next();
    } catch (error) {
      return ctx.badRequest('Validation error', { error: error.message });
    }
  };
};

async function validateCourseData(ctx) {
  const { data } = ctx.request.body;
  
  if (!data) return;
  
  const errors = [];
  
  // Required fields validation
  if (ctx.method === 'POST') {
    if (!data.title) errors.push('Title is required');
    if (!data.sku) errors.push('SKU is required');
    if (!data.price) errors.push('Price is required');
    if (!data.category) errors.push('Category is required');
    if (!data.type) errors.push('Type is required');
  }
  
  // Data type validation
  if (data.price && (isNaN(data.price) || data.price < 0)) {
    errors.push('Price must be a positive number');
  }
  
  if (data.salePrice && (isNaN(data.salePrice) || data.salePrice < 0)) {
    errors.push('Sale price must be a positive number');
  }
  
  if (data.salePrice && data.price && data.salePrice >= data.price) {
    errors.push('Sale price must be less than regular price');
  }
  
  if (data.rating && (data.rating < 0 || data.rating > 5)) {
    errors.push('Rating must be between 0 and 5');
  }
  
  if (data.stockQuantity && (isNaN(data.stockQuantity) || data.stockQuantity < 0)) {
    errors.push('Stock quantity must be a non-negative number');
  }
  
  if (data.students && (isNaN(data.students) || data.students < 0)) {
    errors.push('Students count must be a non-negative number');
  }
  
  // Enum validation
  if (data.status && !['Published', 'Draft', 'Archived'].includes(data.status)) {
    errors.push('Status must be one of: Published, Draft, Archived');
  }
  
  if (data.type && !['Course', 'Book', 'Event', 'Webinar', 'Masterclass', 'Workshop'].includes(data.type)) {
    errors.push('Type must be one of: Course, Book, Event, Webinar, Masterclass, Workshop');
  }
  
  if (data.stock && !['In stock', 'Limited stock', 'Out of stock'].includes(data.stock)) {
    errors.push('Stock must be one of: In stock, Limited stock, Out of stock');
  }
  
  // SKU uniqueness validation
  if (data.sku) {
    const filters: any = { sku: { $eq: data.sku } };
    if (ctx.method === 'PUT' && ctx.params.id) {
      filters.id = { $ne: ctx.params.id };
    }
    
    const existingCourses = await strapi.entityService.findMany('api::course.course', { filters });
    if (existingCourses.length > 0) {
      errors.push('SKU already exists');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
}

async function validateInstructorData(ctx) {
  const { data } = ctx.request.body;
  
  if (!data) return;
  
  const errors = [];
  
  // Required fields validation
  if (ctx.method === 'POST') {
    if (!data.name) errors.push('Name is required');
    if (!data.role) errors.push('Role is required');
    if (!data.bio) errors.push('Bio is required');
  }
  
  // Bio length validation
  if (data.bio && data.bio.length < 50) {
    errors.push('Bio must be at least 50 characters long');
  }
  
  // Social links validation
  if (data.socialLinks) {
    const { linkedin, twitter, instagram, email } = data.socialLinks;
    
    if (linkedin && !linkedin.includes('linkedin.com')) {
      errors.push('Invalid LinkedIn URL');
    }
    
    if (twitter && !twitter.includes('twitter.com') && !twitter.includes('x.com')) {
      errors.push('Invalid Twitter URL');
    }
    
    if (instagram && !instagram.includes('instagram.com')) {
      errors.push('Invalid Instagram URL');
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
}

async function validateReviewData(ctx) {
  const { data } = ctx.request.body;
  
  if (!data) return;
  
  const errors = [];
  
  // Required fields validation
  if (ctx.method === 'POST') {
    if (!data.course) errors.push('Course is required');
    if (!data.user) errors.push('User is required');
    if (!data.rating) errors.push('Rating is required');
    if (!data.title) errors.push('Title is required');
    if (!data.comment) errors.push('Comment is required');
  }
  
  // Rating validation
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push('Rating must be between 1 and 5');
  }
  
  // Title length validation
  if (data.title && data.title.length < 5) {
    errors.push('Title must be at least 5 characters long');
  }
  
  // Comment length validation
  if (data.comment && data.comment.length < 10) {
    errors.push('Comment must be at least 10 characters long');
  }
  
  // Check for duplicate reviews
  if (ctx.method === 'POST' && data.course && data.user) {
    const existingReview = await strapi.entityService.findMany('api::review.review', {
      filters: {
        course: { id: { $eq: data.course } },
        user: { id: { $eq: data.user } }
      }
    });
    
    if (existingReview.length > 0) {
      errors.push('User has already reviewed this course');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
}
