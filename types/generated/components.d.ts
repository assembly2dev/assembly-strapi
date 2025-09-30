import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCourseModule extends Struct.ComponentSchema {
  collectionName: 'components_shared_course_modules';
  info: {
    description: 'Course module containing multiple lessons';
    displayName: 'Course Module';
  };
  attributes: {
    duration: Schema.Attribute.String;
    lessons: Schema.Attribute.Component<'shared.lesson', true>;
    moduleId: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedInstructorStats extends Struct.ComponentSchema {
  collectionName: 'components_shared_instructor_stats';
  info: {
    description: 'Statistics and metrics for instructors';
    displayName: 'Instructor Stats';
  };
  attributes: {
    coursesCreated: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedLesson extends Struct.ComponentSchema {
  collectionName: 'components_shared_lessons';
  info: {
    description: 'Individual lesson within a course module';
    displayName: 'Lesson';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    duration: Schema.Attribute.String;
    lessonId: Schema.Attribute.Integer & Schema.Attribute.Required;
    order: Schema.Attribute.Integer;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['video', 'text', 'quiz', 'assignment']
    > &
      Schema.Attribute.Required;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media and contact links for instructors';
    displayName: 'Social Links';
  };
  attributes: {
    email: Schema.Attribute.Email;
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    whatsapp: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.course-module': SharedCourseModule;
      'shared.instructor-stats': SharedInstructorStats;
      'shared.lesson': SharedLesson;
      'shared.social-links': SharedSocialLinks;
    }
  }
}
