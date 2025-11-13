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
import { db } from '../../../lib/firebase/config';
import { BlogPost } from '../types/blog.types';

// Helper function to convert Firestore document to BlogPost
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
  
  return {
    id,
    title,
    slug: data.slug || '',
    content,
    excerpt,
    translations: translations,
    author: data.author || { id: '1', name: 'Tolga Çavga' },
    publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    tags: data.tags || [],
    category: data.category,
    image: data.image,
    views: data.views || 0,
    likes: data.likes || 0,
    isPublished: data.isPublished ?? true,
  };
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
        posts.push(docToBlogPost(docSnapshot, docSnapshot.id, currentLanguage));
      });
      
      return posts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to API if Firestore fails
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blog/posts`);
        if (response.ok) {
          return await response.json();
        }
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
      }
      throw error;
    }
  },

  getPost: async (slug: string, currentLanguage?: string): Promise<BlogPost> => {
    try {
      const postsRef = collection(db, 'blogPosts');
      const q = query(postsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Post not found');
      }
      
      const docSnapshot = querySnapshot.docs[0];
      return docToBlogPost(docSnapshot, docSnapshot.id, currentLanguage);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      // Fallback to API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blog/posts/${slug}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
      }
      throw error;
    }
  },

  createPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      const postsRef = collection(db, 'blogPosts');
      const postData = {
        ...post,
        publishedAt: post.publishedAt ? Timestamp.fromDate(new Date(post.publishedAt)) : Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(postsRef, postData);
      const docSnapshot = await getDoc(docRef);
      
      if (!docSnapshot.exists()) {
        throw new Error('Failed to create post');
      }
      
      return docToBlogPost(docSnapshot, docRef.id);
    } catch (error) {
      console.error('Error creating blog post:', error);
      // Fallback to API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blog/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
      }
      throw error;
    }
  },

  updatePost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      const postRef = doc(db, 'blogPosts', id);
      const updateData: Record<string, FieldValue | unknown> = {
        ...post,
        updatedAt: Timestamp.now(),
      };
      
      // Convert date strings to Timestamps if present
      if (post.publishedAt) {
        updateData.publishedAt = Timestamp.fromDate(new Date(post.publishedAt));
      }
      if (post.updatedAt) {
        updateData.updatedAt = Timestamp.fromDate(new Date(post.updatedAt));
      }
      
      await updateDoc(postRef, updateData as Record<string, FieldValue>);
      const docSnapshot = await getDoc(postRef);
      
      if (!docSnapshot.exists()) {
        throw new Error('Post not found');
      }
      
      return docToBlogPost(docSnapshot, id);
    } catch (error) {
      console.error('Error updating blog post:', error);
      // Fallback to API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blog/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
      }
      throw error;
    }
  },

  deletePost: async (id: string): Promise<void> => {
    try {
      const postRef = doc(db, 'blogPosts', id);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      // Fallback to API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blog/posts/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
        throw error;
      }
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

