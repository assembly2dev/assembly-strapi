/**
 * review service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::review.review', ({ strapi }) => ({
  // Service to validate review data
  async validateReviewData(data: any) {
    const errors = [];
    
    // Validate required fields
    if (!data.course) errors.push('Course is required');
    if (!data.user) errors.push('User is required');
    if (!data.rating) errors.push('Rating is required');
    if (!data.title) errors.push('Title is required');
    if (!data.comment) errors.push('Comment is required');
    
    // Validate rating
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      errors.push('Rating must be between 1 and 5');
    }
    
    // Validate title length
    if (data.title && data.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }
    
    // Validate comment length
    if (data.comment && data.comment.length < 10) {
      errors.push('Comment must be at least 10 characters long');
    }
    
    return errors;
  },

  // Service to check if user can review course
  async canUserReviewCourse(userId: number, courseId: number) {
    try {
      // Check if user already reviewed this course
      const existingReview = await strapi.entityService.findMany('api::review.review', {
        filters: {
          course: { id: { $eq: courseId } },
          user: { id: { $eq: userId } }
        }
      });
      
      if (existingReview.length > 0) {
        return { canReview: false, reason: 'User has already reviewed this course' };
      }
      
      // Here you could add additional checks like:
      // - User must have purchased the course
      // - User must have completed the course
      // - User must be verified
      
      return { canReview: true };
    } catch (error) {
      strapi.log.error('Failed to check if user can review course:', error);
      return { canReview: false, reason: 'Error checking review eligibility' };
    }
  },

  // Service to get course review summary
  async getCourseReviewSummary(courseId: number) {
    try {
      const reviews = await strapi.entityService.findMany('api::review.review', {
        filters: { course: { id: { $eq: courseId } } },
        populate: {
          user: true
        }
      });
      
      if (reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          verifiedReviews: 0,
          recentReviews: []
        };
      }
      
      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      // Rating distribution
      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
      };
      
      // Verified reviews
      const verifiedReviews = reviews.filter(r => r.verified).length;
      
      // Recent reviews (last 5)
      const recentReviews = reviews
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(review => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          verified: review.verified,
          createdAt: review.createdAt,
          user: {
            id: (review as any).user.id,
            username: (review as any).user.username,
            email: (review as any).user.email
          }
        }));
      
      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        verifiedReviews,
        verificationRate: (verifiedReviews / totalReviews) * 100,
        recentReviews
      };
    } catch (error) {
      strapi.log.error('Failed to get course review summary:', error);
      return null;
    }
  },

  // Service to moderate review content
  async moderateReview(content: string) {
    // This is a basic implementation - in production you might want to use
    // a more sophisticated content moderation service
    const inappropriateWords = ['spam', 'fake', 'scam']; // Add more as needed
    
    const lowerContent = content.toLowerCase();
    const hasInappropriateContent = inappropriateWords.some(word => 
      lowerContent.includes(word)
    );
    
    return {
      isAppropriate: !hasInappropriateContent,
      flaggedWords: inappropriateWords.filter(word => 
        lowerContent.includes(word)
      )
    };
  }
}));
