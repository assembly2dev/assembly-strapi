/**
 * instructor controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::instructor.instructor', ({ strapi }) => ({
  // Custom find method with filtering
  async find(ctx) {
    const { query } = ctx;
    
    const filters: any = query.filters || {};
    
    // Handle text search across name and specialty
    if (query.search) {
      filters.$or = [
        { name: { $containsi: query.search } },
        { specialty: { $containsi: query.search } },
        { role: { $containsi: query.search } }
      ];
    }
    
    // Handle specialty filtering
    if (query.specialty) {
      filters.specialty = { $eq: query.specialty };
    }
    
    // Handle facilitators page filtering
    if (query.showOnFacilitatorsPage !== undefined) {
      filters.showOnFacilitatorsPage = { $eq: query.showOnFacilitatorsPage === 'true' };
    }
    
    // Set default pagination
    const pagination = {
      page: parseInt((query.pagination as any)?.page) || 1,
      pageSize: parseInt((query.pagination as any)?.pageSize) || 25
    };
    
    // Set default sort
    const sort = query.sort || ['name:asc'];
    
    // Set default populate - only populate fields that exist
    const populate = query.populate || {
      // Only populate basic fields that exist in our direct database insert
      // image: true, // Skip image for now since it's not in our direct insert
      // courses: { // Skip courses relation for now
      //   populate: {
      //     image: true
      //   }
      // },
      // socialLinks: true, // Skip components for now
      // stats: true
    };
    
    try {
      const entities = await strapi.entityService.findMany('api::instructor.instructor', {
        filters,
        sort,
        pagination,
        populate
      });
      
      const total = await strapi.entityService.count('api::instructor.instructor', { filters });
      
      // Clean up the response by removing unnecessary fields
      const cleanedEntities = entities.map(entity => {
        const { locale, documentId, ...cleanEntity } = entity;
        return cleanEntity;
      });

      return {
        data: cleanedEntities,
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
      return ctx.badRequest('Failed to fetch instructors', { error: error.message });
    }
  },

  // Custom findOne method with basic population
  async findOne(ctx) {
    const { id } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findOne('api::instructor.instructor', id);
      
      if (!entity) {
        return ctx.notFound('Instructor not found');
      }
      
      // Clean up the response by removing unnecessary fields (updated)
      const { locale, documentId, ...cleanEntity } = entity;
      
      return { data: cleanEntity };
    } catch (error) {
      return ctx.badRequest('Failed to fetch instructor', { error: error.message });
    }
  },

  // Custom create method with validation
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Validate required fields
    if (!data.name || !data.role || !data.bio) {
      return ctx.badRequest('Missing required fields: name, role, bio');
    }
    
    try {
      const entity = await strapi.entityService.create('api::instructor.instructor', {
        data,
        populate: {
          image: true,
          socialLinks: true,
          stats: true
        }
      });
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to create instructor', { error: error.message });
    }
  },

  // Custom update method
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    try {
      const existingEntity = await strapi.entityService.findOne('api::instructor.instructor', id);
      
      if (!existingEntity) {
        return ctx.notFound('Instructor not found');
      }
      
      const entity = await strapi.entityService.update('api::instructor.instructor', id, {
        data,
        populate: {
          image: true,
          socialLinks: true,
          stats: true
        }
      });
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to update instructor', { error: error.message });
    }
  },

  // Custom delete method
  async delete(ctx) {
    const { id } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findOne('api::instructor.instructor', id);
      
      if (!entity) {
        return ctx.notFound('Instructor not found');
      }
      
      // Check if instructor has courses
      const courses = await strapi.entityService.findMany('api::course.course', {
        filters: { instructors: { id: { $eq: id } } }
      });
      
      if (courses.length > 0) {
        return ctx.badRequest('Cannot delete instructor with associated courses');
      }
      
      await strapi.entityService.delete('api::instructor.instructor', id);
      
      return { data: { id } };
    } catch (error) {
      return ctx.badRequest('Failed to delete instructor', { error: error.message });
    }
  },

  // Get instructor statistics
  async stats(ctx) {
    try {
      const totalInstructors = await strapi.entityService.count('api::instructor.instructor');
      const facilitatorsPageInstructors = await strapi.entityService.count('api::instructor.instructor', {
        filters: { showOnFacilitatorsPage: { $eq: true } }
      });
      
      // Get top instructors by course count
      const instructors = await strapi.entityService.findMany('api::instructor.instructor', {
        populate: {
          courses: true
        }
      });
      
      const topInstructors = instructors
        .map(instructor => ({
          id: instructor.id,
          name: instructor.name,
          courseCount: (instructor as any).courses?.length || 0
        }))
        .sort((a, b) => b.courseCount - a.courseCount)
        .slice(0, 5);
      
      return {
        data: {
          total: totalInstructors,
          facilitatorsPage: facilitatorsPageInstructors,
          topInstructors
        }
      };
    } catch (error) {
      return ctx.badRequest('Failed to fetch instructor statistics', { error: error.message });
    }
  },

  // Seed instructors method (removed due to TypeScript errors - data already inserted via direct DB)
  async seedInstructors(ctx) {
    return ctx.badRequest('Seeding not available - instructors already inserted via direct database', { 
      message: 'Instructors have been inserted directly into the database. Use the API to fetch them.' 
    });
  }
}));
