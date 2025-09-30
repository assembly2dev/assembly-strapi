export default {
  routes: [
    {
      method: 'GET',
      path: '/instructors/stats',
      handler: 'instructor.stats',
      config: {
        auth: {
          scope: ['api::instructor.instructor.find']
        }
      }
    }
  ]
};


