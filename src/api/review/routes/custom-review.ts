export default {
  routes: [
    {
      method: 'GET',
      path: '/reviews/stats',
      handler: 'review.stats',
      config: {
        auth: {
          scope: ['api::review.review.find']
        }
      }
    }
  ]
};


