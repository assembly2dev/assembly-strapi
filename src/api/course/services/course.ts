/**
 * course service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::course.course', ({ strapi }) => ({
  // Service to update course statistics
  async updateCourseStats(courseId: number) {
    try {
      // Get all reviews for this course
      const reviews = await strapi.entityService.findMany('api::review.review', {
        filters: { course: { id: { $eq: courseId } } }
      });
      
      if (reviews.length > 0) {
        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        // Update course with new stats
        await strapi.entityService.update('api::course.course', courseId, {
          data: {
            rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
            reviewCount: reviews.length
          }
        });
      } else {
        // No reviews, reset to defaults
        await strapi.entityService.update('api::course.course', courseId, {
          data: {
            rating: 0,
            reviewCount: 0
          }
        });
      }
    } catch (error) {
      strapi.log.error('Failed to update course stats:', error);
    }
  },

  // Service to validate course data
  async validateCourseData(data: any) {
    const errors = [];
    
    // Validate required fields
    if (!data.title) errors.push('Title is required');
    if (!data.sku) errors.push('SKU is required');
    if (!data.price) errors.push('Price is required');
    if (!data.category) errors.push('Category is required');
    if (!data.type) errors.push('Type is required');
    
    // Validate price
    if (data.price && (isNaN(data.price) || data.price < 0)) {
      errors.push('Price must be a positive number');
    }
    
    if (data.salePrice && (isNaN(data.salePrice) || data.salePrice < 0)) {
      errors.push('Sale price must be a positive number');
    }
    
    if (data.salePrice && data.price && data.salePrice >= data.price) {
      errors.push('Sale price must be less than regular price');
    }
    
    // Validate rating
    if (data.rating && (data.rating < 0 || data.rating > 5)) {
      errors.push('Rating must be between 0 and 5');
    }
    
    // Validate stock quantity
    if (data.stockQuantity && (isNaN(data.stockQuantity) || data.stockQuantity < 0)) {
      errors.push('Stock quantity must be a non-negative number');
    }
    
    // Validate students count
    if (data.students && (isNaN(data.students) || data.students < 0)) {
      errors.push('Students count must be a non-negative number');
    }
    
    return errors;
  },

  // Service to check SKU uniqueness
  async isSkuUnique(sku: string, excludeId?: number) {
    const filters: any = { sku: { $eq: sku } };
    
    if (excludeId) {
      filters.id = { $ne: excludeId };
    }
    
    const existingCourses = await strapi.entityService.findMany('api::course.course', {
      filters
    });
    
    return existingCourses.length === 0;
  },

  // Service to get course analytics
  async getCourseAnalytics(courseId: number) {
    try {
      const course = await strapi.entityService.findOne('api::course.course', courseId, {
        populate: {
          reviews: {
            populate: {
              user: true
            }
          }
        }
      });
      
      if (!course) {
        return null;
      }
      
      const reviews = (course as any).reviews || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      // Rating distribution
      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
      };
      
      // Verified reviews count
      const verifiedReviews = reviews.filter(r => r.verified).length;
      
      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        verifiedReviews,
        verificationRate: totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0
      };
    } catch (error) {
      strapi.log.error('Failed to get course analytics:', error);
      return null;
    }
  }
}));
