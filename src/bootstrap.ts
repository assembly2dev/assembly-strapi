export default ({ strapi }) => {
  // Set up cleanup cron job to run every hour
  setInterval(async () => {
    try {
      const cronService = strapi.service('api::auth.cron');
      await cronService.runAllCleanupTasks();
    } catch (error) {
      strapi.log.error('Error running cleanup tasks:', error);
    }
  }, 60 * 60 * 1000); // Run every hour

  // Also run cleanup on startup
  setTimeout(async () => {
    try {
      const cronService = strapi.service('api::auth.cron');
      await cronService.runAllCleanupTasks();
      strapi.log.info('Initial cleanup completed');
    } catch (error) {
      strapi.log.error('Error running initial cleanup:', error);
    }
  }, 5000); // Run 5 seconds after startup

  // Initialize course management system
  setTimeout(async () => {
    try {
      // Check if we need to import sample data
      const courseCount = await strapi.entityService.count('api::course.course');
      const instructorCount = await strapi.entityService.count('api::instructor.instructor');
      
      if (courseCount === 0 && instructorCount === 0) {
        strapi.log.info('No courses or instructors found. You can run the sample data import script if needed.');
        strapi.log.info('To import sample data, run: npm run import-sample-data');
      } else {
        strapi.log.info(`Found ${courseCount} courses and ${instructorCount} instructors`);
      }
      
      // Update course statistics
      const courses = await strapi.entityService.findMany('api::course.course');
      for (const course of courses) {
        try {
          await strapi.service('api::course.course').updateCourseStats(course.id);
        } catch (error) {
          strapi.log.error(`Error updating stats for course ${course.id}:`, error);
        }
      }
      
      strapi.log.info('Course management system initialized successfully');
    } catch (error) {
      strapi.log.error('Error initializing course management system:', error);
    }
  }, 10000); // Run 10 seconds after startup
};


