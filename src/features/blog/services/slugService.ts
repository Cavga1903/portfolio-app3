/**
 * Slug Service
 * Handles slug generation and uniqueness checking
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';

/**
 * Generate a URL-friendly slug from a title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    // Replace Turkish characters
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

/**
 * Check if a slug is available (unique)
 * @param slug - The slug to check
 * @param excludeId - Post ID to exclude from check (for updates)
 * @returns true if slug is available, false if already taken
 */
export const checkSlugAvailability = async (
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const postsRef = collection(db, 'blogPosts');
    const q = query(postsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    // If no documents found, slug is available
    if (querySnapshot.empty) {
      return true;
    }
    
    // If excludeId is provided, check if all found docs are the excluded one
    if (excludeId) {
      return querySnapshot.docs.every(doc => doc.id !== excludeId);
    }
    
    // Slug is taken
    return false;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    // On error, assume slug is available to allow saving
    return true;
  }
};

/**
 * Generate a unique slug by appending a number if needed
 * @param baseSlug - The base slug to make unique
 * @param excludeId - Post ID to exclude from check
 * @returns A unique slug
 */
export const generateUniqueSlug = async (
  baseSlug: string,
  excludeId?: string
): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 100; // Prevent infinite loop
  
  while (!(await checkSlugAvailability(slug, excludeId)) && counter < maxAttempts) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  if (counter >= maxAttempts) {
    // Fallback: append timestamp
    slug = `${baseSlug}-${Date.now()}`;
  }
  
  return slug;
};

