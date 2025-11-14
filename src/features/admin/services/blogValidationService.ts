/**
 * Blog Validation Service
 * Validates blog post data before saving/publishing
 */

import { BlogPost } from '../../blog/types/blog.types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates blog post title
 */
const validateTitle = (title: string | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!title || title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Başlık gereklidir',
    });
  } else if (title.trim().length < 5) {
    errors.push({
      field: 'title',
      message: 'Başlık en az 5 karakter olmalıdır',
    });
  } else if (title.trim().length > 200) {
    errors.push({
      field: 'title',
      message: 'Başlık en fazla 200 karakter olabilir',
    });
  }
  
  return errors;
};

/**
 * Validates blog post content
 */
const validateContent = (content: string | undefined, minWords: number = 10): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!content || content.trim().length === 0) {
    errors.push({
      field: 'content',
      message: 'İçerik gereklidir',
    });
  } else {
    // Create a temporary DOM element to extract text content
    // This properly handles nested HTML tags and entities
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Get all text content, including from nested elements
    let textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up: remove extra whitespace, normalize spaces
    textContent = textContent
      .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
      .trim();
    
    // Count words (split by whitespace and filter empty strings)
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount < minWords) {
      errors.push({
        field: 'content',
        message: `İçerik en az ${minWords} kelime olmalıdır (şu an: ${wordCount})`,
      });
    }
  }
  
  return errors;
};

/**
 * Validates blog post slug
 */
const validateSlug = (slug: string | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!slug || slug.trim().length === 0) {
    errors.push({
      field: 'slug',
      message: 'Slug gereklidir',
    });
  } else {
    // Slug format: lowercase, alphanumeric, hyphens only
    const slugRegex = /^[a-z0-9-]+$/;
    
    if (!slugRegex.test(slug)) {
      errors.push({
        field: 'slug',
        message: 'Slug sadece küçük harf, rakam ve tire (-) içerebilir',
      });
    }
    
    if (slug.length < 3) {
      errors.push({
        field: 'slug',
        message: 'Slug en az 3 karakter olmalıdır',
      });
    }
    
    if (slug.length > 100) {
      errors.push({
        field: 'slug',
        message: 'Slug en fazla 100 karakter olabilir',
      });
    }
    
    // Check for consecutive hyphens
    if (slug.includes('--')) {
      errors.push({
        field: 'slug',
        message: 'Slug ardışık tire içeremez',
      });
    }
    
    // Check for leading/trailing hyphens
    if (slug.startsWith('-') || slug.endsWith('-')) {
      errors.push({
        field: 'slug',
        message: 'Slug tire ile başlayamaz veya bitemez',
      });
    }
  }
  
  return errors;
};

/**
 * Validates excerpt
 */
const validateExcerpt = (excerpt: string | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (excerpt && excerpt.length > 500) {
    errors.push({
      field: 'excerpt',
      message: 'Özet en fazla 500 karakter olabilir',
    });
  }
  
  return errors;
};

/**
 * Validates tags
 */
const validateTags = (tags: string[] | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (tags) {
    if (tags.length > 10) {
      errors.push({
        field: 'tags',
        message: 'En fazla 10 etiket ekleyebilirsiniz',
      });
    }
    
    tags.forEach((tag, index) => {
      if (!tag || tag.trim().length === 0) {
        errors.push({
          field: `tags[${index}]`,
          message: 'Etiket boş olamaz',
        });
      } else if (tag.length > 30) {
        errors.push({
          field: `tags[${index}]`,
          message: 'Etiket en fazla 30 karakter olabilir',
        });
      }
    });
  }
  
  return errors;
};

/**
 * Validates image URL
 */
const validateImage = (image: string | undefined, required: boolean = false): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (required && (!image || image.trim().length === 0)) {
    errors.push({
      field: 'image',
      message: 'Kapak görseli gereklidir',
    });
  } else if (image && image.trim().length > 0) {
    // Basic URL validation
    try {
      new URL(image);
    } catch {
      errors.push({
        field: 'image',
        message: 'Geçerli bir görsel URL\'si giriniz',
      });
    }
  }
  
  return errors;
};

/**
 * Validates a draft blog post (before saving)
 */
export const validateDraft = (post: Partial<BlogPost>): ValidationResult => {
  const errors: ValidationError[] = [
    ...validateTitle(post.title),
    ...validateContent(post.content, 10), // Minimum 10 words for draft
    ...validateSlug(post.slug),
    ...validateExcerpt(post.excerpt),
    ...validateTags(post.tags),
    ...validateImage(post.image, false), // Image not required for draft
  ];
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a blog post before publishing
 */
export const validateForPublish = (post: Partial<BlogPost>): ValidationResult => {
  const errors: ValidationError[] = [
    ...validateTitle(post.title),
    ...validateContent(post.content, 50), // Minimum 50 words for publishing
    ...validateSlug(post.slug),
    ...validateExcerpt(post.excerpt),
    ...validateTags(post.tags),
    ...validateImage(post.image, true), // Image required for publishing
  ];
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get error message for a specific field
 */
export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  return errors.find(error => error.field === field)?.message;
};

/**
 * Check if a field has errors
 */
export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(error => error.field === field);
};

