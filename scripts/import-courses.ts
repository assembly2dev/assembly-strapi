import { courses } from '../src/data/courses';
import axios from 'axios';

async function importCourses() {
  try {
    // Login to get the JWT token
    const loginResponse = await axios.post('http://localhost:1337/api/auth/local', {
      identifier: 'admin@strapi.io', // Replace with your admin email
      password: 'Admin123!', // Replace with your admin password
    });

    const token = loginResponse.data.jwt;

    // Import each course
    for (const course of courses) {
      try {
        const courseData = {
          data: {
            title: course.title,
            instructor: course.instructor,
            level: course.level,
            duration: course.duration,
            category: course.category,
            categories: course.categories,
            price: course.price,
            type: course.type,
            image: course.image,
            rating: course.rating,
            reviewCount: course.reviewCount,
            tags: course.tags,
            slug: course.slug,
            url: course.url,
            progress: course.progress,
            lastAccessed: course.lastAccessed,
            totalHours: course.totalHours,
            completed: course.completed || false,
            completedDate: course.completedDate,
            publishedAt: new Date().toISOString()
          }
        };

        // Create the course using Strapi's API
        await axios.post('http://localhost:1337/api/courses', courseData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`✅ Imported course: ${course.title}`);
      } catch (error) {
        console.error(`❌ Error importing course ${course.title}:`, error.response?.data || error.message);
      }
    }

    console.log('🎉 Course import completed!');
  } catch (error) {
    console.error('Error during import:', error.response?.data || error.message);
  }
}

// Run the import
importCourses(); 