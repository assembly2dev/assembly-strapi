/**
 * course controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
  // Custom find method with advanced filtering
  async find(ctx) {
    const { query } = ctx;
    
    // Build filters for advanced search
    const filters: any = query.filters || {};
    
    // Handle text search across title and description
    if (query.search) {
      filters.$or = [
        { title: { $containsi: query.search } },
        { description: { $containsi: query.search } },
        { sku: { $containsi: query.search } }
      ];
    }
    
    // Handle category filtering
    if (query.category) {
      filters.category = { $eq: query.category };
    }
    
    // Handle type filtering
    if (query.type) {
      filters.type = { $eq: query.type };
    }
    
    // Handle status filtering
    if (query.status) {
      filters.status = { $eq: query.status };
    }
    
    // Handle stock filtering
    if (query.stock) {
      filters.stock = { $eq: query.stock };
    }
    
    // Handle featured filtering
    if (query.featured !== undefined) {
      filters.featured = { $eq: query.featured === 'true' };
    }
    
    // Handle price range filtering
    if (query.minPrice || query.maxPrice) {
      filters.price = {};
      if (query.minPrice) {
        filters.price.$gte = parseFloat(query.minPrice as string);
      }
      if (query.maxPrice) {
        filters.price.$lte = parseFloat(query.maxPrice as string);
      }
    }
    
    // Handle rating filtering
    if (query.minRating) {
      filters.rating = { $gte: parseFloat(query.minRating as string) };
    }
    
    // Set default pagination
    const pagination = {
      page: parseInt((query.pagination as any)?.page) || 1,
      pageSize: parseInt((query.pagination as any)?.pageSize) || 25
    };
    
    // Set default sort
    const sort = query.sort || ['title:asc'];
    
    // Set default populate
    const populate = query.populate || {
      image: true,
      instructors: {
        populate: {
          image: true
        }
      },
      reviews: {
        populate: {
          user: true
        }
      }
    };
    
    try {
      const entities = await strapi.entityService.findMany('api::course.course', {
        filters,
        sort,
        pagination,
        populate
      });
      
      const total = await strapi.entityService.count('api::course.course', { filters });
      
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
      return ctx.badRequest('Failed to fetch courses', { error: error.message });
    }
  },

  // Custom findOne method with full population
  async findOne(ctx) {
    const { id } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findOne('api::course.course', id, {
        populate: {
          image: true,
          instructors: {
            populate: {
              image: true,
              socialLinks: true,
              stats: true
            }
          },
          curriculum: {
            populate: {
              lessons: true
            }
          },
          reviews: {
            populate: {
              user: true
            }
          }
        }
      });
      
      if (!entity) {
        return ctx.notFound('Course not found');
      }
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to fetch course', { error: error.message });
    }
  },

  // Custom create method with validation
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Validate required fields
    if (!data.title || !data.sku || !data.price || !data.category || !data.type) {
      return ctx.badRequest('Missing required fields: title, sku, price, category, type');
    }
    
    // Check if SKU already exists
    const existingCourse = await strapi.entityService.findMany('api::course.course', {
      filters: { sku: { $eq: data.sku } }
    });
    
    if (existingCourse.length > 0) {
      return ctx.badRequest('SKU already exists');
    }
    
    try {
      const entity = await strapi.entityService.create('api::course.course', {
        data: {
          ...data,
          datePublished: data.status === 'Published' ? new Date() : null
        },
        populate: {
          image: true,
          instructors: true
        }
      });
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to create course', { error: error.message });
    }
  },

  // Custom update method
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    try {
      const existingEntity = await strapi.entityService.findOne('api::course.course', id);
      
      if (!existingEntity) {
        return ctx.notFound('Course not found');
      }
      
      // Check SKU uniqueness if being updated
      if (data.sku && data.sku !== existingEntity.sku) {
        const existingCourse = await strapi.entityService.findMany('api::course.course', {
          filters: { sku: { $eq: data.sku } }
        });
        
        if (existingCourse.length > 0) {
          return ctx.badRequest('SKU already exists');
        }
      }
      
      const entity = await strapi.entityService.update('api::course.course', id, {
        data: {
          ...data,
          datePublished: data.status === 'Published' && existingEntity.status !== 'Published' 
            ? new Date() 
            : existingEntity.datePublished
        },
        populate: {
          image: true,
          instructors: true
        }
      });
      
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to update course', { error: error.message });
    }
  },

  // Custom delete method
  async delete(ctx) {
    const { id } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findOne('api::course.course', id);
      
      if (!entity) {
        return ctx.notFound('Course not found');
      }
      
      await strapi.entityService.delete('api::course.course', id);
      
      return { data: { id } };
    } catch (error) {
      return ctx.badRequest('Failed to delete course', { error: error.message });
    }
  },

  // Bulk update method
  async bulkUpdate(ctx) {
    const { ids, updates } = ctx.request.body.data;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return ctx.badRequest('Invalid or empty ids array');
    }
    
    if (!updates || typeof updates !== 'object') {
      return ctx.badRequest('Invalid updates object');
    }
    
    try {
      const results = [];
      
      for (const id of ids) {
        const entity = await strapi.entityService.update('api::course.course', id, {
          data: updates,
          populate: {
            image: true,
            instructors: true
          }
        });
        results.push(entity);
      }
      
      return { data: results };
    } catch (error) {
      return ctx.badRequest('Failed to bulk update courses', { error: error.message });
    }
  },

  // Get course statistics
  async stats(ctx) {
    try {
      const totalCourses = await strapi.entityService.count('api::course.course');
      const publishedCourses = await strapi.entityService.count('api::course.course', {
        filters: { status: { $eq: 'Published' } }
      });
      const draftCourses = await strapi.entityService.count('api::course.course', {
        filters: { status: { $eq: 'Draft' } }
      });
      const archivedCourses = await strapi.entityService.count('api::course.course', {
        filters: { status: { $eq: 'Archived' } }
      });
      const featuredCourses = await strapi.entityService.count('api::course.course', {
        filters: { featured: { $eq: true } }
      });
      
      return {
        data: {
          total: totalCourses,
          published: publishedCourses,
          draft: draftCourses,
          archived: archivedCourses,
          featured: featuredCourses
        }
      };
    } catch (error) {
      return ctx.badRequest('Failed to fetch course statistics', { error: error.message });
    }
  }
}));
