/**
 * Seed instructors endpoint
 * This endpoint allows direct insertion of instructor data
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/instructors/seed',
      handler: 'instructor.seedInstructors',
      config: {
        auth: false, // No authentication required
      },
    },
  ],
};
