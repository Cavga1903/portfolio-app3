/**
 * Image Upload Service
 * Handles image uploads to Firebase Storage
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../lib/firebase/config';

export interface ImageUploadResult {
  url: string;
  thumbnailUrl?: string;
  path: string;
}

/**
 * Resize image on client side (basic implementation)
 * For production, consider using a Cloud Function or image processing service
 */
const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image to Firebase Storage
 * @param file - Image file to upload
 * @param postId - Blog post ID (for organizing files)
 * @param createThumbnail - Whether to create a thumbnail version
 * @returns Upload result with URLs
 */
export const uploadBlogImage = async (
  file: File,
  postId: string,
  createThumbnail: boolean = true
): Promise<ImageUploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Upload main image (resized to 1200x800)
    const resizedImage = await resizeImage(file, 1200, 800, 0.85);
    const imageRef = ref(storage, `blog-images/${postId}/${fileName}`);
    await uploadBytes(imageRef, resizedImage);
    const imageUrl = await getDownloadURL(imageRef);

    let thumbnailUrl: string | undefined;

    // Create thumbnail if requested
    if (createThumbnail) {
      const thumbnail = await resizeImage(file, 400, 300, 0.7);
      const thumbnailRef = ref(storage, `blog-images/${postId}/thumb_${fileName}`);
      await uploadBytes(thumbnailRef, thumbnail);
      thumbnailUrl = await getDownloadURL(thumbnailRef);
    }

    return {
      url: imageUrl,
      thumbnailUrl,
      path: `blog-images/${postId}/${fileName}`,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error instanceof Error ? error : new Error('Failed to upload image');
  }
};

/**
 * Delete image from Firebase Storage
 * @param path - Storage path of the image to delete
 */
export const deleteBlogImage = async (path: string): Promise<void> => {
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - image might not exist
  }
};

/**
 * Delete all images for a blog post
 * Note: Firebase Storage doesn't have a built-in way to list files
 * This would require a Cloud Function or storing image paths in Firestore
 */
export const deletePostImages = async (): Promise<void> => {
  try {
    // Note: Firebase Storage doesn't have a built-in way to list files
    // This would require a Cloud Function or storing image paths in Firestore
    // For now, this is a placeholder
    console.warn('deletePostImages: Requires Cloud Function or Firestore path tracking');
  } catch (error) {
    console.error('Error deleting post images:', error);
  }
};

