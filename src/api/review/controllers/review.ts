/**
 * review controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::review.review', ({ strapi }) => ({
  // Custom find method with filtering
  async find(ctx) {
    const { query } = ctx;
    
    const filters: any = query.filters || {};
    
    // Handle course filtering
    if (query.courseId) {
      filters.course = { id: { $eq: query.courseId } };
    }
    
    // Handle rating filtering
    if (query.rating) {
      filters.rating = { $eq: parseInt(query.rating as string) };
    }
    
    // Handle verified filtering
    if (query.verified !== undefined) {
      filters.verified = { $eq: query.verified === 'true' };
    }
    
    // Handle user filtering
    if (query.userId) {
      filters.user = { id: { $eq: query.userId } };
    }
    
    // Set default pagination
    const pagination = {
      page: parseInt((query.pagination as any)?.page) || 1,
      pageSize: parseInt((query.pagination as any)?.pageSize) || 25
    };
    
    // Set default sort
    const sort = query.sort || ['createdAt:desc'];
    
    // Set default populate
    const populate = query.populate || {
      course: {
        populate: {
          image: true
        }
      },
      user: true
    };
    
    try {
      const entities = await strapi.entityService.findMany('api::review.review', {
        filters,
        sort,
        pagination,
        populate
      });
      
      const total = await strapi.entityService.count('api::review.review', { filters });
      
      return {
        data: entities,
        meta: {
          pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            pageCount: Math.ceil(total / pagination.pageSize),
            total
          }
        }
      };
    } catch (error) {
      return ctx.badRequest('Failed to fetch reviews', { error: error.message });
    }
  },

  // Custom findOne method with full population
  async findOne(ctx) {
    const { id } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findOne('api::review.review', id, {
        populate: {
          course: {
            populate: {
              image: true,
              instructors: true
            }
          },
          user: true
        }
      });
      
      if (!entity) {
        return ctx.notFound('Review not found');
      }
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to fetch review', { error: error.message });
    }
  },

  // Custom create method with validation
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Validate required fields
    if (!data.course || !data.user || !data.rating || !data.title || !data.comment) {
      return ctx.badRequest('Missing required fields: course, user, rating, title, comment');
    }
    
    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      return ctx.badRequest('Rating must be between 1 and 5');
    }
    
    // Check if user already reviewed this course
    const existingReview = await strapi.entityService.findMany('api::review.review', {
      filters: {
        course: { id: { $eq: data.course } },
        user: { id: { $eq: data.user } }
      }
    });
    
    if (existingReview.length > 0) {
      return ctx.badRequest('User has already reviewed this course');
    }
    
    try {
      const entity = await strapi.entityService.create('api::review.review', {
        data,
        populate: {
          course: true,
          user: true
        }
      });
      
      // Update course statistics
      await strapi.service('api::course.course').updateCourseStats(data.course);
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to create review', { error: error.message });
    }
  },

  // Custom update method
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    try {
      const existingEntity = await strapi.entityService.findOne('api::review.review', id);
      
      if (!existingEntity) {
        return ctx.notFound('Review not found');
      }
      
      // Validate rating if being updated
      if (data.rating && (data.rating < 1 || data.rating > 5)) {
        return ctx.badRequest('Rating must be between 1 and 5');
      }
      
      const entity = await strapi.entityService.update('api::review.review', id, {
        data,
        populate: {
          course: true,
          user: true
        }
      });
      
      // Update course statistics
      await strapi.service('api::course.course').updateCourseStats((entity as any).course.id);
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to update review', { error: error.message });
    }
  },

  // Custom delete method
  async delete(ctx) {
    const { id } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findOne('api::review.review', id);
      
      if (!entity) {
        return ctx.notFound('Review not found');
      }
      
      const courseId = (entity as any).course.id;
      
      await strapi.entityService.delete('api::review.review', id);
      
      // Update course statistics
      await strapi.service('api::course.course').updateCourseStats(courseId);
      
      return { data: { id } };
    } catch (error) {
      return ctx.badRequest('Failed to delete review', { error: error.message });
    }
  },

  // Get review statistics
  async stats(ctx) {
    try {
      const totalReviews = await strapi.entityService.count('api::review.review');
      const verifiedReviews = await strapi.entityService.count('api::review.review', {
        filters: { verified: { $eq: true } }
      });
      
      // Rating distribution
      const ratingDistribution = {};
      for (let rating = 1; rating <= 5; rating++) {
        ratingDistribution[rating] = await strapi.entityService.count('api::review.review', {
          filters: { rating: { $eq: rating } }
        });
      }
      
      // Recent reviews (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentReviews = await strapi.entityService.count('api::review.review', {
        filters: {
          createdAt: { $gte: thirtyDaysAgo.toISOString() }
        }
      });
      
      return {
        data: {
          total: totalReviews,
          verified: verifiedReviews,
          ratingDistribution,
          recent: recentReviews,
          verificationRate: totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0
        }
      };
    } catch (error) {
      return ctx.badRequest('Failed to fetch review statistics', { error: error.message });
    }
  }
}));
