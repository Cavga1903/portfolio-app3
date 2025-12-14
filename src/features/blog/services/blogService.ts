import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  FieldValue,
} from 'firebase/firestore';
import { z } from 'zod';
import { db } from '../../../lib/firebase/config';
import { generateMetaDescription } from './seoService';
import {
  BlogPostSchema,
  BlogPost,
  BlogPostSlugSchema,
  ISODateStringSchema,
} from '../../shared/schemas';

/**
 * Helper function to convert Firestore document to BlogPost
 * Validates output with BlogPostSchema to ensure type safety
 */
const docToBlogPost = (docSnapshot: QueryDocumentSnapshot<DocumentData>, id: string, currentLanguage?: string): BlogPost => {
  const data = docSnapshot.data();
  const translations = data.translations || {};
  
  // If translations exist and current language is not the source language, use translation
  let title = data.title || '';
  let content = data.content || '';
  let excerpt = data.excerpt || '';
  
  if (currentLanguage && translations[currentLanguage]) {
    const translation = translations[currentLanguage];
    title = translation.title || title;
    content = translation.content || content;
    excerpt = translation.excerpt || excerpt;
  }
  
  // Convert Firestore Timestamp to ISO string
  const publishedAt = data.publishedAt?.toDate?.()?.toISOString() || 
    (typeof data.publishedAt === 'string' ? data.publishedAt : new Date().toISOString());
  const updatedAt = data.updatedAt?.toDate?.()?.toISOString() || 
    (typeof data.updatedAt === 'string' ? data.updatedAt : undefined);
  
  const blogPost = {
    id,
    title,
    slug: data.slug || '',
    content,
    excerpt,
    translations: translations,
    author: data.author || { id: '1', name: 'Tolga Çavga' },
    publishedAt,
    updatedAt,
    tags: data.tags || [],
    category: data.category,
    image: data.image,
    views: data.views || 0,
    likes: data.likes || 0,
    isPublished: data.isPublished ?? true,
    isBookmarked: data.isBookmarked || false,
    isFavorited: data.isFavorited || false,
    isArchived: data.isArchived || false,
    metaDescription: data.metaDescription,
    seoTitle: data.seoTitle,
    seoKeywords: data.seoKeywords || [],
  };
  
  // ✅ VALIDATE OUTPUT WITH ZOD
  return BlogPostSchema.parse(blogPost);
};

export const blogService = {
  getPosts: async (currentLanguage?: string): Promise<BlogPost[]> => {
    try {
      const postsRef = collection(db, 'blogPosts');
      const q = query(
        postsRef,
        where('isPublished', '==', true),
        orderBy('publishedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts: BlogPost[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        // ✅ Already validated in docToBlogPost
        posts.push(docToBlogPost(docSnapshot, docSnapshot.id, currentLanguage));
      });
      
      return posts;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error fetching blog posts:', error.errors);
        throw new Error(`Invalid blog post data: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get all posts including drafts (for admin panel)
  getAllPosts: async (currentLanguage?: string): Promise<BlogPost[]> => {
    try {
      const postsRef = collection(db, 'blogPosts');
      // Try to order by updatedAt first
      try {
        const q = query(
          postsRef,
          orderBy('updatedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const posts: BlogPost[] = [];
        
        querySnapshot.forEach((docSnapshot) => {
          posts.push(docToBlogPost(docSnapshot, docSnapshot.id, currentLanguage));
        });
        
        return posts;
      } catch (orderError) {
        // If orderBy fails (index doesn't exist), get all and sort manually
        const querySnapshot = await getDocs(postsRef);
        const posts: BlogPost[] = [];
        
        querySnapshot.forEach((docSnapshot) => {
          posts.push(docToBlogPost(docSnapshot, docSnapshot.id, currentLanguage));
        });
        
        // Sort manually by updatedAt or publishedAt
        posts.sort((a, b) => {
          const dateA = new Date(b.updatedAt || b.publishedAt || 0).getTime();
          const dateB = new Date(a.updatedAt || a.publishedAt || 0).getTime();
          return dateA - dateB;
        });
        
        return posts;
      }
    } catch (error) {
      console.error('Error fetching all blog posts:', error);
      throw error;
    }
  },

  getPost: async (slug: string, currentLanguage?: string): Promise<BlogPost> => {
    try {
      // ✅ VALIDATE SLUG FORMAT
      const slugValidation = BlogPostSlugSchema.safeParse(slug);
      if (!slugValidation.success) {
        throw new Error(`Invalid slug format: ${slugValidation.error.errors.map(e => e.message).join(', ')}`);
      }
      
      const postsRef = collection(db, 'blogPosts');
      const q = query(postsRef, where('slug', '==', slugValidation.data));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Post not found');
      }
      
      const docSnapshot = querySnapshot.docs[0];
      // ✅ Already validated in docToBlogPost
      return docToBlogPost(docSnapshot, docSnapshot.id, currentLanguage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error fetching blog post:', error.errors);
        throw new Error(`Invalid slug: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  getPostById: async (id: string, currentLanguage?: string): Promise<BlogPost> => {
    try {
      const postRef = doc(db, 'blogPosts', id);
      const docSnapshot = await getDoc(postRef);
      
      if (!docSnapshot.exists()) {
        throw new Error('Post not found');
      }
      
      return docToBlogPost(docSnapshot as QueryDocumentSnapshot<DocumentData>, id, currentLanguage);
    } catch (error) {
      console.error('Error fetching blog post by ID:', error);
      throw error;
    }
  },

  createPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      // ✅ VALIDATE REQUIRED FIELDS
      if (!post.title || !post.slug || !post.content || !post.excerpt || !post.author) {
        throw new Error('Missing required fields: title, slug, content, excerpt, and author are required');
      }
      
      // ✅ VALIDATE SLUG FORMAT
      const slugValidation = BlogPostSlugSchema.safeParse(post.slug);
      if (!slugValidation.success) {
        throw new Error(`Invalid slug format: ${slugValidation.error.errors.map(e => e.message).join(', ')}`);
      }
      
      const postsRef = collection(db, 'blogPosts');
      
      // Generate meta description if not provided
      const metaDescription = post.metaDescription || 
        (post.content ? generateMetaDescription(post.content) : undefined);
      
      // Prepare post data with validated fields
      const postData: Record<string, FieldValue | unknown> = {
        title: post.title,
        slug: slugValidation.data, // ✅ Validated slug
        content: post.content,
        excerpt: post.excerpt,
        author: post.author,
        tags: post.tags || [],
        category: post.category || null,
        image: post.image || null,
        isPublished: post.isPublished || false,
        isBookmarked: post.isBookmarked || false,
        isFavorited: post.isFavorited || false,
        isArchived: post.isArchived || false,
        views: post.views || 0,
        likes: post.likes || 0,
        metaDescription: metaDescription || null,
        seoTitle: post.seoTitle || null,
        seoKeywords: post.seoKeywords || [],
        translations: post.translations || {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      // Only set publishedAt if post is published
      if (post.isPublished) {
        if (post.publishedAt) {
          // ✅ VALIDATE DATE FORMAT
          const dateValidation = ISODateStringSchema.safeParse(post.publishedAt);
          if (!dateValidation.success) {
            throw new Error(`Invalid publishedAt date format: ${dateValidation.error.errors.map(e => e.message).join(', ')}`);
          }
          postData.publishedAt = Timestamp.fromDate(new Date(dateValidation.data));
        } else {
          postData.publishedAt = Timestamp.now();
        }
      }
      
      const docRef = await addDoc(postsRef, postData);
      const docSnapshot = await getDoc(docRef);
      
      if (!docSnapshot.exists()) {
        throw new Error('Failed to create post');
      }
      
      // ✅ Already validated in docToBlogPost
      return docToBlogPost(docSnapshot, docRef.id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error creating blog post:', error.errors);
        throw new Error(`Invalid blog post data: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  updatePost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      // ✅ VALIDATE ID
      if (!id || id.trim().length === 0) {
        throw new Error('Post ID is required');
      }
      
      const postRef = doc(db, 'blogPosts', id);
      const updateData: Record<string, FieldValue> = {
        updatedAt: Timestamp.now(),
      };
      
      // ✅ TYPE-SAFE FIELD UPDATES WITH VALIDATION
      if (post.title !== undefined) {
        const titleValidation = BlogPostSchema.shape.title.safeParse(post.title);
        if (!titleValidation.success) {
          throw new Error(`Invalid title: ${titleValidation.error.errors.map(e => e.message).join(', ')}`);
        }
        updateData.title = post.title;
      }
      
      if (post.slug !== undefined) {
        // ✅ VALIDATE SLUG FORMAT
        const slugValidation = BlogPostSlugSchema.safeParse(post.slug);
        if (!slugValidation.success) {
          throw new Error(`Invalid slug format: ${slugValidation.error.errors.map(e => e.message).join(', ')}`);
        }
        updateData.slug = slugValidation.data;
      }
      
      if (post.content !== undefined) {
        const contentValidation = BlogPostSchema.shape.content.safeParse(post.content);
        if (!contentValidation.success) {
          throw new Error(`Invalid content: ${contentValidation.error.errors.map(e => e.message).join(', ')}`);
        }
        updateData.content = post.content;
      }
      
      if (post.excerpt !== undefined) {
        const excerptValidation = BlogPostSchema.shape.excerpt.safeParse(post.excerpt);
        if (!excerptValidation.success) {
          throw new Error(`Invalid excerpt: ${excerptValidation.error.errors.map(e => e.message).join(', ')}`);
        }
        updateData.excerpt = post.excerpt;
      }
      
      if (post.tags !== undefined) {
        updateData.tags = post.tags;
      }
      
      if (post.category !== undefined) {
        updateData.category = post.category || null;
      }
      
      if (post.image !== undefined) {
        if (post.image) {
          // ✅ VALIDATE URL FORMAT
          const urlValidation = BlogPostSchema.shape.image.safeParse(post.image);
          if (!urlValidation.success) {
            throw new Error(`Invalid image URL: ${urlValidation.error.errors.map(e => e.message).join(', ')}`);
          }
        }
        updateData.image = post.image || null;
      }
      
      if (post.isPublished !== undefined) {
        updateData.isPublished = post.isPublished;
      }
      
      if (post.isBookmarked !== undefined) {
        updateData.isBookmarked = post.isBookmarked;
      }
      
      if (post.isFavorited !== undefined) {
        updateData.isFavorited = post.isFavorited;
      }
      
      if (post.isArchived !== undefined) {
        updateData.isArchived = post.isArchived;
      }
      
      if (post.views !== undefined) {
        const viewsValidation = BlogPostSchema.shape.views.safeParse(post.views);
        if (!viewsValidation.success) {
          throw new Error(`Invalid views: ${viewsValidation.error.errors.map(e => e.message).join(', ')}`);
        }
        updateData.views = post.views;
      }
      
      if (post.likes !== undefined) {
        const likesValidation = BlogPostSchema.shape.likes.safeParse(post.likes);
        if (!likesValidation.success) {
          throw new Error(`Invalid likes: ${likesValidation.error.errors.map(e => e.message).join(', ')}`);
        }
        updateData.likes = post.likes;
      }
      
      if (post.metaDescription !== undefined) {
        if (post.metaDescription) {
          const metaValidation = BlogPostSchema.shape.metaDescription.safeParse(post.metaDescription);
          if (!metaValidation.success) {
            throw new Error(`Invalid meta description: ${metaValidation.error.errors.map(e => e.message).join(', ')}`);
          }
        }
        updateData.metaDescription = post.metaDescription || null;
      }
      
      if (post.seoTitle !== undefined) {
        if (post.seoTitle) {
          const seoTitleValidation = BlogPostSchema.shape.seoTitle.safeParse(post.seoTitle);
          if (!seoTitleValidation.success) {
            throw new Error(`Invalid SEO title: ${seoTitleValidation.error.errors.map(e => e.message).join(', ')}`);
          }
        }
        updateData.seoTitle = post.seoTitle || null;
      }
      
      if (post.seoKeywords !== undefined) {
        updateData.seoKeywords = post.seoKeywords;
      }
      
      if (post.translations !== undefined) {
        updateData.translations = post.translations;
      }
      
      // Handle publishedAt: only set if publishing (isPublished becomes true)
      if (post.publishedAt) {
        // ✅ VALIDATE DATE FORMAT
        const dateValidation = ISODateStringSchema.safeParse(post.publishedAt);
        if (!dateValidation.success) {
          throw new Error(`Invalid publishedAt date format: ${dateValidation.error.errors.map(e => e.message).join(', ')}`);
        }
        updateData.publishedAt = Timestamp.fromDate(new Date(dateValidation.data));
      } else if (post.isPublished === true) {
        // If publishing but no publishedAt provided, set it to now
        updateData.publishedAt = Timestamp.now();
      }
      // If unpublishing (isPublished becomes false), we keep publishedAt for history
      // but don't need to update it
      
      await updateDoc(postRef, updateData);
      const docSnapshot = await getDoc(postRef);
      
      if (!docSnapshot.exists()) {
        throw new Error('Post not found');
      }
      
      // ✅ Already validated in docToBlogPost
      return docToBlogPost(docSnapshot, id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error updating blog post:', error.errors);
        throw new Error(`Invalid blog post data: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  deletePost: async (id: string): Promise<void> => {
    try {
      const postRef = doc(db, 'blogPosts', id);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Get blog statistics
  getStats: async () => {
    try {
      const postsRef = collection(db, 'blogPosts');
      
      // Get all posts
      const allPostsSnapshot = await getDocs(postsRef);
      const allPosts = allPostsSnapshot.size;
      
      // Get published posts
      const publishedQuery = query(postsRef, where('isPublished', '==', true));
      const publishedSnapshot = await getDocs(publishedQuery);
      const publishedPosts = publishedSnapshot.size;
      
      // Get draft posts
      const draftQuery = query(postsRef, where('isPublished', '==', false));
      const draftSnapshot = await getDocs(draftQuery);
      const draftPosts = draftSnapshot.size;
      
      // Calculate total views
      let totalViews = 0;
      allPostsSnapshot.forEach((doc) => {
        const data = doc.data();
        totalViews += data.views || 0;
      });
      
      return {
        totalPosts: allPosts,
        publishedPosts,
        draftPosts,
        totalViews,
      };
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      return {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
      };
    }
  },
};

