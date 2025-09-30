// TypeScript interfaces for Frontend Course CRUD API
// Copy this file to your frontend project

export interface Course {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string; // Rich text
  shortDescription?: string;
  sku: string; // Unique identifier
  price: number; // Decimal
  salePrice?: number; // Decimal
  status: CourseStatus;
  type: CourseType;
  category: string;
  categories?: string[]; // JSON array
  level?: string; // e.g., "Beginner", "Intermediate", "Advanced"
  duration?: string; // e.g., "6 weeks", "3 hours 55 minutes"
  totalHours?: number; // Decimal
  image?: MediaObject; // Media relation
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  stock: StockStatus;
  stockQuantity?: number;
  students: number;
  rating: number; // 0-5 decimal
  reviewCount: number;
  tags?: string[]; // JSON array
  instructors: Instructor[]; // Many-to-many relation
  curriculum?: CourseModule[]; // Component array
  highlights?: string[]; // JSON array
  requirements?: string[]; // JSON array
  targetAudience?: string[]; // JSON array
  whatYouWillLearn?: string[]; // JSON array
  previewUrl?: string;
  datePublished?: string; // ISO datetime
  reviews: Review[]; // One-to-many relation
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  publishedAt: string; // ISO datetime
}

export interface MediaObject {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: MediaFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFormats {
  thumbnail?: MediaFormat;
  small?: MediaFormat;
  medium?: MediaFormat;
  large?: MediaFormat;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

export interface Instructor {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: MediaObject;
  socialLinks?: SocialLinks;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  whatsapp?: string;
  email?: string;
}

export interface CourseModule {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  videoUrl?: string;
  resources?: string[];
}

export interface Review {
  id: number;
  documentId: string;
  rating: number; // 1-5
  title?: string;
  comment?: string;
  author: string;
  email?: string;
  verified: boolean;
  course: number; // Course ID
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Enums
export type CourseStatus = 'Published' | 'Draft' | 'Archived';
export type CourseType = 'Course' | 'Book' | 'Event' | 'Webinar' | 'Masterclass' | 'Workshop';
export type StockStatus = 'In stock' | 'Limited stock' | 'Out of stock';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface ApiErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// Request Types
export interface CreateCourseRequest {
  data: Omit<Course, 'id' | 'documentId' | 'createdAt' | 'updatedAt' | 'publishedAt'>;
}

export interface UpdateCourseRequest {
  data: Partial<Omit<Course, 'id' | 'documentId' | 'createdAt' | 'updatedAt' | 'publishedAt'>>;
}

// Filter Types
export interface CourseFilters {
  category?: string;
  type?: CourseType;
  level?: string;
  status?: CourseStatus;
  featured?: boolean;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  search?: string;
}

export interface CourseQueryParams {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  filters?: CourseFilters;
  sort?: string; // e.g., "title:asc", "price:desc"
  populate?: string; // e.g., "image,instructors,reviews"
}

// Form Types
export interface CourseFormData {
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  salePrice?: number;
  status: CourseStatus;
  type: CourseType;
  category: string;
  categories?: string[];
  level?: string;
  duration?: string;
  totalHours?: number;
  image?: File | string; // File for upload or string for existing image ID
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  stock: StockStatus;
  stockQuantity?: number;
  students?: number;
  tags?: string[];
  highlights?: string[];
  requirements?: string[];
  targetAudience?: string[];
  whatYouWillLearn?: string[];
  previewUrl?: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Hook Return Types
export interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  refetch: () => Promise<void>;
}

export interface UseCourseReturn {
  course: Course | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCourseMutationReturn {
  createCourse: (data: CourseFormData) => Promise<Course>;
  updateCourse: (id: number, data: Partial<CourseFormData>) => Promise<Course>;
  deleteCourse: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface CourseCardProps {
  course: Course;
  onClick?: (course: Course) => void;
  showActions?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export interface CourseListProps {
  courses: Course[];
  loading?: boolean;
  error?: string | null;
  onCourseClick?: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface CourseFiltersProps {
  filters: CourseFilters;
  onFiltersChange: (filters: CourseFilters) => void;
  onClearFilters: () => void;
}

// Utility Types
export type SortField = 'title' | 'price' | 'createdAt' | 'updatedAt' | 'rating' | 'students';
export type SortDirection = 'asc' | 'desc';
export type SortOption = `${SortField}:${SortDirection}`;

// API Service Interface
export interface CourseApiService {
  getCourses(params?: CourseQueryParams): Promise<ApiResponse<Course[]>>;
  getCourse(id: number): Promise<ApiResponse<Course>>;
  createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>>;
  updateCourse(id: number, data: UpdateCourseRequest): Promise<ApiResponse<Course>>;
  deleteCourse(id: number): Promise<ApiResponse<{ id: string }>>;
}

// Constants
export const COURSE_STATUSES: CourseStatus[] = ['Published', 'Draft', 'Archived'];
export const COURSE_TYPES: CourseType[] = ['Course', 'Book', 'Event', 'Webinar', 'Masterclass', 'Workshop'];
export const STOCK_STATUSES: StockStatus[] = ['In stock', 'Limited stock', 'Out of stock'];
export const COURSE_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 25,
};

export const MAX_PAGE_SIZE = 100;
export const MIN_RATING = 0;
export const MAX_RATING = 5;
