/**
 * instructor router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::instructor.instructor', {
  config: {
    find: {
      auth: false
    },
    findOne: {
      auth: false
    },
    create: {
      auth: {
        scope: ['api::instructor.instructor.create']
      }
    },
    update: {
      auth: {
        scope: ['api::instructor.instructor.update']
      }
    },
    delete: {
      auth: {
        scope: ['api::instructor.instructor.delete']
      }
    }
  }
});
