export default {
  routes: [
    {
      method: 'POST',
      path: '/courses/bulk-update',
      handler: 'course.bulkUpdate',
      config: {
        auth: {
          scope: ['api::course.course.update']
        }
      }
    },
    {
      method: 'GET',
      path: '/courses/stats',
      handler: 'course.stats',
      config: {
        auth: {
          scope: ['api::course.course.find']
        }
      }
    }
  ]
};


