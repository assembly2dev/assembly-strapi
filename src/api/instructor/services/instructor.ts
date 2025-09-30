/**
 * instructor service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::instructor.instructor', ({ strapi }) => ({
  // Service to update instructor course count
  async updateCourseCount(instructorId: string) {
    try {
      const courses = await strapi.entityService.findMany('api::course.course', {
        filters: { instructors: { id: { $eq: instructorId } } }
      });
      
      await strapi.entityService.update('api::instructor.instructor', instructorId, {
        data: {
          stats: {
            coursesCreated: courses.length
          }
        }
      });
    } catch (error) {
      strapi.log.error('Failed to update instructor course count:', error);
    }
  },

  // Service to validate instructor data
  async validateInstructorData(data: any) {
    const errors = [];
    
    // Validate required fields
    if (!data.name) errors.push('Name is required');
    if (!data.role) errors.push('Role is required');
    if (!data.bio) errors.push('Bio is required');
    
    // Validate bio length
    if (data.bio && data.bio.length < 50) {
      errors.push('Bio must be at least 50 characters long');
    }
    
    // Validate social links if provided
    if (data.socialLinks) {
      const { linkedin, twitter, instagram, whatsapp, email } = data.socialLinks;
      
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
    
    return errors;
  },

  // Service to get instructor analytics
  async getInstructorAnalytics(instructorId: string) {
    try {
      const instructor = await strapi.entityService.findOne('api::instructor.instructor', instructorId, {
        populate: {
          courses: {
            populate: {
              reviews: true,
              students: true
            }
          }
        }
      });
      
      if (!instructor) {
        return null;
      }
      
      const courses = (instructor as any).courses || [];
      const totalCourses = courses.length;
      const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);
      
      // Calculate average rating across all courses
      const allReviews = courses.flatMap(course => course.reviews || []);
      const averageRating = allReviews.length > 0 
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
        : 0;
      
      // Course type distribution
      const courseTypes = courses.reduce((acc, course) => {
        acc[course.type] = (acc[course.type] || 0) + 1;
        return acc;
      }, {});
      
      // Category distribution
      const categories = courses.reduce((acc, course) => {
        acc[course.category] = (acc[course.category] || 0) + 1;
        return acc;
      }, {});
      
      return {
        totalCourses,
        totalStudents,
        averageRating: Math.round(averageRating * 10) / 10,
        courseTypes,
        categories,
        totalReviews: allReviews.length
      };
    } catch (error) {
      strapi.log.error('Failed to get instructor analytics:', error);
      return null;
    }
  }
}));
