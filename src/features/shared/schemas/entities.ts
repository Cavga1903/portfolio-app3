/**
 * Core Entity Schemas - Single Source of Truth
 * 
 * God Mode Rule #1.3: "Strict Typing: `any` is forbidden. Zod schemas at every boundary."
 * 
 * This file defines the canonical Zod schemas for all core entities in the application.
 * All API boundaries, form validations, and data transformations MUST use these schemas.
 * 
 * @module entities
 */

import { z } from 'zod';
import { VALIDATION } from '../../../utils/constants';

// ============================================================================
// USER ENTITY SCHEMAS
// ============================================================================

/**
 * User Role Enum
 * Defines the allowed user roles in the system
 */
export const UserRoleSchema = z.enum(['admin', 'user'], {
  errorMap: () => ({ message: 'Role must be either "admin" or "user"' }),
});

/**
 * User Avatar Schema
 * Optional avatar URL with validation
 */
export const UserAvatarSchema = z
  .string()
  .url('Avatar must be a valid URL')
  .optional()
  .describe('Optional URL to user avatar image');

/**
 * User Entity Schema
 * Complete user profile with all required and optional fields
 */
export const UserSchema = z.object({
  id: z
    .string()
    .min(1, 'User ID is required')
    .describe('Unique user identifier (Firebase UID)'),
  
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .describe('User email address (must be @cavgalabs.com domain)'),
  
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .describe('User display name'),
  
  role: UserRoleSchema.describe('User role (admin or user)'),
  
  avatar: UserAvatarSchema,
});

/**
 * User Type (inferred from schema)
 * Use this type instead of manually defining User interface
 */
export type User = z.infer<typeof UserSchema>;

/**
 * User Role Type
 */
export type UserRole = z.infer<typeof UserRoleSchema>;

// ============================================================================
// BLOG POST ENTITY SCHEMAS
// ============================================================================

/**
 * Blog Post Translation Schema
 * Multi-language support for blog posts
 */
export const BlogPostTranslationSchema = z.object({
  title: z
    .string()
    .min(1, 'Translation title is required')
    .max(200, 'Translation title must be less than 200 characters')
    .describe('Translated blog post title'),
  
  content: z
    .string()
    .min(1, 'Translation content is required')
    .describe('Translated blog post content (HTML)'),
  
  excerpt: z
    .string()
    .min(1, 'Translation excerpt is required')
    .max(500, 'Translation excerpt must be less than 500 characters')
    .describe('Translated blog post excerpt'),
});

/**
 * Blog Post Author Schema
 * Author information embedded in blog post
 */
export const BlogPostAuthorSchema = z.object({
  id: z
    .string()
    .min(1, 'Author ID is required')
    .describe('Author user ID'),
  
  name: z
    .string()
    .min(1, 'Author name is required')
    .max(100, 'Author name must be less than 100 characters')
    .describe('Author display name'),
  
  avatar: z
    .string()
    .url('Avatar must be a valid URL')
    .optional()
    .describe('Optional author avatar URL'),
});

/**
 * Blog Post Slug Schema
 * URL-friendly slug validation (lowercase, alphanumeric, hyphens only)
 */
export const BlogPostSlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(200, 'Slug must be less than 200 characters')
  .regex(
    /^[a-z0-9-]+$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  )
  .describe('URL-friendly blog post identifier');

/**
 * ISO Date String Schema
 * Validates ISO 8601 date strings
 */
export const ISODateStringSchema = z
  .string()
  .datetime('Invalid ISO date format')
  .describe('ISO 8601 formatted date string');

/**
 * Blog Post Entity Schema
 * Complete blog post with all fields, translations, and SEO metadata
 */
export const BlogPostSchema = z.object({
  id: z
    .string()
    .min(1, 'Blog post ID is required')
    .describe('Unique blog post identifier'),
  
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .describe('Blog post title'),
  
  slug: BlogPostSlugSchema,
  
  content: z
    .string()
    .min(1, 'Content is required')
    .describe('Blog post content (HTML)'),
  
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be less than 500 characters')
    .describe('Blog post excerpt/summary'),
  
  translations: z
    .record(z.string(), BlogPostTranslationSchema)
    .optional()
    .describe('Multi-language translations (key: language code, value: translation)'),
  
  author: BlogPostAuthorSchema.describe('Blog post author information'),
  
  publishedAt: ISODateStringSchema.describe('Publication date (ISO 8601)'),
  
  updatedAt: ISODateStringSchema
    .optional()
    .describe('Last update date (ISO 8601)'),
  
  tags: z
    .array(z.string().min(1).max(50))
    .default([])
    .describe('Blog post tags (array of strings)'),
  
  category: z
    .string()
    .max(100, 'Category must be less than 100 characters')
    .optional()
    .describe('Blog post category'),
  
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .describe('Blog post cover image URL'),
  
  views: z
    .number()
    .int('Views must be an integer')
    .nonnegative('Views cannot be negative')
    .default(0)
    .describe('Number of views'),
  
  likes: z
    .number()
    .int('Likes must be an integer')
    .nonnegative('Likes cannot be negative')
    .default(0)
    .describe('Number of likes'),
  
  isPublished: z
    .boolean()
    .default(false)
    .describe('Publication status'),
  
  isBookmarked: z
    .boolean()
    .default(false)
    .optional()
    .describe('Bookmark status'),
  
  isFavorited: z
    .boolean()
    .default(false)
    .optional()
    .describe('Favorite status'),
  
  isArchived: z
    .boolean()
    .default(false)
    .optional()
    .describe('Archive status'),
  
  // SEO fields
  metaDescription: z
    .string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional()
    .describe('SEO meta description'),
  
  seoTitle: z
    .string()
    .max(60, 'SEO title must be less than 60 characters')
    .optional()
    .describe('SEO optimized title'),
  
  seoKeywords: z
    .array(z.string().min(1).max(50))
    .default([])
    .optional()
    .describe('SEO keywords array'),
});

/**
 * Blog Post Type (inferred from schema)
 * Use this type instead of manually defining BlogPost interface
 */
export type BlogPost = z.infer<typeof BlogPostSchema>;

/**
 * Blog Post Translation Type
 */
export type BlogPostTranslation = z.infer<typeof BlogPostTranslationSchema>;

/**
 * Blog Post Author Type
 */
export type BlogPostAuthor = z.infer<typeof BlogPostAuthorSchema>;

/**
 * Blog Category Schema
 * Category information for blog posts
 */
export const BlogCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Category name is required').max(100),
  slug: BlogPostSlugSchema,
  count: z.number().int().nonnegative().default(0),
});

/**
 * Blog Category Type
 */
export type BlogCategory = z.infer<typeof BlogCategorySchema>;

// ============================================================================
// CONTACT FORM SCHEMAS
// ============================================================================

/**
 * Contact Form Submission Schema
 * Validates contact form data before submission
 * 
 * Constraints match VALIDATION constants from utils/constants.ts
 */
export const ContactFormSubmissionSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`)
    .max(100, 'Name must be less than 100 characters')
    .describe('Contact form submitter name'),
  
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .describe('Contact form submitter email'),
  
  message: z
    .string()
    .min(VALIDATION.MIN_MESSAGE_LENGTH, `Message must be at least ${VALIDATION.MIN_MESSAGE_LENGTH} characters`)
    .max(VALIDATION.MAX_MESSAGE_LENGTH, `Message must be less than ${VALIDATION.MAX_MESSAGE_LENGTH} characters`)
    .describe('Contact form message content'),
});

/**
 * Contact Form Submission Type
 */
export type ContactFormSubmission = z.infer<typeof ContactFormSubmissionSchema>;

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

/**
 * Login Request Schema
 * Validates login form input
 */
export const LoginRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .refine(
      (email) => email.toLowerCase().endsWith('@cavgalabs.com'),
      'Only @cavgalabs.com email addresses are allowed'
    )
    .describe('User email (must be @cavgalabs.com domain)'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
    .describe('User password'),
});

/**
 * Login Request Type
 */
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * Signup Request Schema
 * Validates signup form input
 */
export const SignupRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .refine(
      (email) => email.toLowerCase().endsWith('@cavgalabs.com'),
      'Only @cavgalabs.com email addresses are allowed'
    )
    .describe('User email (must be @cavgalabs.com domain)'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
    .describe('User password'),
  
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .describe('User display name'),
});

/**
 * Signup Request Type
 */
export type SignupRequest = z.infer<typeof SignupRequestSchema>;

/**
 * Auth Response Schema
 * Standardized authentication response
 */
export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z
    .string()
    .min(1, 'Token is required')
    .describe('JWT authentication token'),
});

/**
 * Auth Response Type
 */
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ============================================================================
// EXPORT ALL SCHEMAS AND TYPES
// ============================================================================

export {
  // Schemas
  UserSchema,
  UserRoleSchema,
  BlogPostSchema,
  BlogPostTranslationSchema,
  BlogPostAuthorSchema,
  BlogPostSlugSchema,
  BlogCategorySchema,
  ContactFormSubmissionSchema,
  LoginRequestSchema,
  SignupRequestSchema,
  AuthResponseSchema,
  // Types
  type User,
  type UserRole,
  type BlogPost,
  type BlogPostTranslation,
  type BlogPostAuthor,
  type BlogCategory,
  type ContactFormSubmission,
  type LoginRequest,
  type SignupRequest,
  type AuthResponse,
};
