import apiClient from '../../../api/client';
import { endpoints } from '../../../api/endpoints';
import { BlogPost } from '../types/blog.types';

export const blogService = {
  getPosts: async (): Promise<BlogPost[]> => {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<BlogPost[]>(endpoints.blog.posts);
    // return response.data;
    
    // Mock data for now
    return [
      {
        id: '1',
        title: 'Getting Started with React',
        slug: 'getting-started-with-react',
        content: 'Full content here...',
        excerpt: 'Learn the basics of React and start building modern web applications.',
        author: {
          id: '1',
          name: 'Tolga Çavga',
          avatar: '/avatars/tolga.jpg',
        },
        publishedAt: new Date().toISOString(),
        tags: ['React', 'JavaScript', 'Web Development'],
        category: 'Tutorial',
        image: '/blog/react-intro.jpg',
        views: 1234,
        likes: 56,
        isPublished: true,
      },
      {
        id: '2',
        title: 'Building Scalable Applications',
        slug: 'building-scalable-applications',
        content: 'Full content here...',
        excerpt: 'Best practices for building applications that scale.',
        author: {
          id: '1',
          name: 'Tolga Çavga',
        },
        publishedAt: new Date().toISOString(),
        tags: ['Architecture', 'Best Practices'],
        category: 'Article',
        views: 890,
        likes: 42,
        isPublished: true,
      },
    ];
  },

  getPost: async (slug: string): Promise<BlogPost> => {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<BlogPost>(endpoints.blog.post(slug));
    // return response.data;
    
    // Mock data
    const posts = await blogService.getPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) throw new Error('Post not found');
    return post;
  },

  createPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await apiClient.post<BlogPost>(endpoints.blog.create, post);
    return response.data;
  },

  updatePost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await apiClient.put<BlogPost>(endpoints.blog.update(id), post);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.blog.delete(id));
  },
};

