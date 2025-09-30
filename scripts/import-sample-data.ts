/**
 * Sample data import script for PLB Assembly 2.0 Course Management System
 */

import { Strapi } from '@strapi/strapi';

export default async function importSampleData(strapi: Strapi) {
  console.log('Starting sample data import...');

  try {
    // Create sample instructors
    const instructors = await createSampleInstructors(strapi);
    console.log(`Created ${instructors.length} instructors`);

    // Create sample courses
    const courses = await createSampleCourses(strapi, instructors);
    console.log(`Created ${courses.length} courses`);

    // Create sample reviews
    const reviews = await createSampleReviews(strapi, courses);
    console.log(`Created ${reviews.length} reviews`);

    console.log('Sample data import completed successfully!');
  } catch (error) {
    console.error('Error importing sample data:', error);
  }
}

async function createSampleInstructors(strapi: Strapi) {
  const instructorsData = [
    {
      name: 'George Peng',
      slug: 'george-peng',
      role: 'Property Investment Expert',
      bio: 'George Peng is a seasoned property investment expert with over 15 years of experience in the Singapore real estate market. He specializes in HDB investment strategies and has helped thousands of investors maximize their returns.',
      longBio: 'George Peng is a renowned property investment expert with over 15 years of experience in the Singapore real estate market. He has successfully guided thousands of investors through the complexities of property investment, with a particular focus on HDB properties. George holds a Master\'s degree in Real Estate from the National University of Singapore and is a certified property investment advisor. His expertise spans across residential, commercial, and industrial properties, with a proven track record of helping clients achieve above-market returns.',
      specialty: 'HDB Investment',
      experience: '15+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/georgepeng',
        email: 'george@plbassembly.com'
      },
      stats: {
        coursesCreated: 0
      },
      showOnFacilitatorsPage: true
    },
    {
      name: 'Marc Chan',
      slug: 'marc-chan',
      role: 'Investment Strategist',
      bio: 'Marc Chan is an investment strategist with expertise in property investment and financial planning. He has over 12 years of experience helping individuals build wealth through strategic property investments.',
      longBio: 'Marc Chan is a highly respected investment strategist with over 12 years of experience in property investment and financial planning. He specializes in helping individuals build long-term wealth through strategic property investments. Marc holds a Bachelor\'s degree in Finance and is a certified financial planner. His approach combines traditional investment principles with modern market analysis to help clients make informed decisions.',
      specialty: 'Investment Strategy',
      experience: '12+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/marcchan',
        twitter: 'https://twitter.com/marcchan',
        email: 'marc@plbassembly.com'
      },
      stats: {
        coursesCreated: 0
      },
      showOnFacilitatorsPage: true
    },
    {
      name: 'Sarah Lim',
      slug: 'sarah-lim',
      role: 'Property Consultant',
      bio: 'Sarah Lim is a property consultant specializing in residential investments and market analysis. She has helped hundreds of clients navigate the property market with confidence.',
      longBio: 'Sarah Lim is a dedicated property consultant with extensive experience in residential investments and market analysis. She has successfully helped hundreds of clients navigate the complexities of the property market with confidence and clarity. Sarah holds a degree in Real Estate and is a licensed property consultant. Her expertise includes market research, property valuation, and investment strategy development.',
      specialty: 'Residential Investment',
      experience: '8+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahlim',
        instagram: 'https://instagram.com/sarahlim',
        email: 'sarah@plbassembly.com'
      },
      stats: {
        coursesCreated: 0
      },
      showOnFacilitatorsPage: true
    }
  ];

  const instructors = [];
  for (const instructorData of instructorsData) {
    const instructor = await strapi.entityService.create('api::instructor.instructor', {
      data: instructorData
    });
    instructors.push(instructor);
  }

  return instructors;
}

async function createSampleCourses(strapi: Strapi, instructors: any[]) {
  const coursesData = [
    {
      title: 'Making The Right Move',
      slug: 'making-the-right-move',
      description: 'Learn the essential strategies for successful property investment in Singapore\'s HDB market. This comprehensive course covers market analysis, investment timing, and risk management.',
      shortDescription: 'Master HDB investment strategies with expert guidance',
      sku: 'COURSE-001',
      price: 149.99,
      salePrice: 129.99,
      status: 'Published',
      type: 'Course',
      category: 'HDB Investment',
      categories: ['HDB Investment', 'Property Investment'],
      level: 'All Levels',
      duration: '2 hours 30 minutes',
      totalHours: 2.5,
      featured: false,
      virtual: true,
      downloadable: false,
      stock: 'In stock',
      stockQuantity: 116,
      students: 245,
      rating: 4.8,
      reviewCount: 23,
      tags: ['HDB', 'Investment', 'Property'],
      instructors: [instructors[0].id],
      curriculum: [
        {
          id: 1,
          title: 'Market Analysis & 2025 Outlook',
          duration: '2h 15m',
          lessons: [
            {
              id: 1,
              title: 'Understanding Rate Cut Impacts',
              type: 'video',
              duration: '25:30'
            },
            {
              id: 2,
              title: 'Market Trends Analysis',
              type: 'video',
              duration: '30:45'
            },
            {
              id: 3,
              title: 'Investment Opportunities',
              type: 'text',
              duration: '15:00'
            }
          ]
        },
        {
          id: 2,
          title: 'Investment Strategies',
          duration: '1h 45m',
          lessons: [
            {
              id: 4,
              title: 'Buy and Hold Strategy',
              type: 'video',
              duration: '35:20'
            },
            {
              id: 5,
              title: 'Flipping Properties',
              type: 'video',
              duration: '28:15'
            }
          ]
        }
      ],
      highlights: ['Expert market analysis', 'Real-world case studies', 'Actionable strategies'],
      requirements: ['Interest in property investment', 'Basic understanding of real estate'],
      targetAudience: ['First-time investors', 'Property enthusiasts', 'Wealth builders'],
      whatYouWillLearn: ['Market analysis techniques', 'Investment timing strategies', 'Risk management'],
      datePublished: new Date('2023-05-15')
    },
    {
      title: 'Advanced Property Investment',
      slug: 'advanced-property-investment',
      description: 'Take your property investment skills to the next level with advanced strategies and techniques used by professional investors.',
      shortDescription: 'Advanced strategies for experienced property investors',
      sku: 'COURSE-002',
      price: 299.99,
      salePrice: null,
      status: 'Published',
      type: 'Masterclass',
      category: 'Investment Strategy',
      categories: ['Investment Strategy', 'Advanced Techniques'],
      level: 'Advanced',
      duration: '4 hours 15 minutes',
      totalHours: 4.25,
      featured: true,
      virtual: true,
      downloadable: true,
      stock: 'In stock',
      stockQuantity: 50,
      students: 89,
      rating: 4.9,
      reviewCount: 15,
      tags: ['Advanced', 'Strategy', 'Professional'],
      instructors: [instructors[1].id, instructors[2].id],
      curriculum: [
        {
          id: 1,
          title: 'Advanced Market Analysis',
          duration: '2h 30m',
          lessons: [
            {
              id: 1,
              title: 'Technical Analysis',
              type: 'video',
              duration: '45:00'
            },
            {
              id: 2,
              title: 'Fundamental Analysis',
              type: 'video',
              duration: '50:00'
            },
            {
              id: 3,
              title: 'Case Study Analysis',
              type: 'video',
              duration: '55:00'
            }
          ]
        }
      ],
      highlights: ['Professional-grade analysis', 'Advanced techniques', 'Expert mentorship'],
      requirements: ['Basic property investment knowledge', 'Previous investment experience'],
      targetAudience: ['Experienced investors', 'Property professionals', 'Wealth managers'],
      whatYouWillLearn: ['Advanced analysis techniques', 'Professional strategies', 'Portfolio optimization'],
      datePublished: new Date('2023-06-01')
    },
    {
      title: 'Property Investment Fundamentals',
      slug: 'property-investment-fundamentals',
      description: 'Start your property investment journey with this comprehensive fundamentals course covering all the basics you need to know.',
      shortDescription: 'Essential knowledge for property investment beginners',
      sku: 'COURSE-003',
      price: 99.99,
      salePrice: 79.99,
      status: 'Published',
      type: 'Course',
      category: 'Property Investment',
      categories: ['Property Investment', 'Fundamentals'],
      level: 'Beginner',
      duration: '3 hours 20 minutes',
      totalHours: 3.33,
      featured: false,
      virtual: true,
      downloadable: false,
      stock: 'In stock',
      stockQuantity: 200,
      students: 156,
      rating: 4.6,
      reviewCount: 31,
      tags: ['Fundamentals', 'Beginner', 'Basics'],
      instructors: [instructors[2].id],
      curriculum: [
        {
          id: 1,
          title: 'Introduction to Property Investment',
          duration: '1h 30m',
          lessons: [
            {
              id: 1,
              title: 'What is Property Investment?',
              type: 'video',
              duration: '20:00'
            },
            {
              id: 2,
              title: 'Types of Properties',
              type: 'video',
              duration: '25:00'
            },
            {
              id: 3,
              title: 'Investment vs Speculation',
              type: 'text',
              duration: '15:00'
            }
          ]
        }
      ],
      highlights: ['Beginner-friendly', 'Comprehensive coverage', 'Practical examples'],
      requirements: ['No prior experience needed', 'Interest in property investment'],
      targetAudience: ['Beginners', 'First-time investors', 'Property enthusiasts'],
      whatYouWillLearn: ['Property investment basics', 'Market understanding', 'Getting started'],
      datePublished: new Date('2023-04-10')
    }
  ];

  const courses = [];
  for (const courseData of coursesData) {
    const course = await strapi.entityService.create('api::course.course', {
      data: courseData
    });
    courses.push(course);
  }

  return courses;
}

async function createSampleReviews(strapi: Strapi, courses: any[]) {
  const reviewsData = [
    {
      course: courses[0].id,
      user: 1, // Assuming user ID 1 exists
      rating: 5,
      title: 'Excellent Course!',
      comment: 'This course provided valuable insights into HDB investment. George\'s explanations are clear and practical. Highly recommended for anyone interested in property investment.',
      verified: true
    },
    {
      course: courses[0].id,
      user: 2, // Assuming user ID 2 exists
      rating: 4,
      title: 'Very Informative',
      comment: 'Great course with lots of useful information. The market analysis section was particularly helpful. Would have liked more case studies though.',
      verified: true
    },
    {
      course: courses[1].id,
      user: 3, // Assuming user ID 3 exists
      rating: 5,
      title: 'Advanced and Comprehensive',
      comment: 'This masterclass is exactly what I needed to take my investment skills to the next level. The advanced techniques are well explained and practical.',
      verified: true
    },
    {
      course: courses[2].id,
      user: 4, // Assuming user ID 4 exists
      rating: 5,
      title: 'Perfect for Beginners',
      comment: 'As someone new to property investment, this course was perfect. Sarah explains everything clearly and the fundamentals are well covered.',
      verified: false
    }
  ];

  const reviews = [];
  for (const reviewData of reviewsData) {
    try {
      const review = await strapi.entityService.create('api::review.review', {
        data: reviewData
      });
      reviews.push(review);
    } catch (error) {
      console.log(`Skipping review creation (user might not exist): ${error.message}`);
    }
  }

  return reviews;
}
