/**
 * review router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::review.review', {
  config: {
    find: {
      auth: false
    },
    findOne: {
      auth: false
    },
    create: {
      auth: {
        scope: ['api::review.review.create']
      }
    },
    update: {
      auth: {
        scope: ['api::review.review.update']
      }
    },
    delete: {
      auth: {
        scope: ['api::review.review.delete']
      }
    }
  }
});
