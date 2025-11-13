import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaTag, FaUser, FaEye } from 'react-icons/fa';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types/blog.types';

interface BlogPostContentProps {
  slug: string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ slug }) => {
  const { t } = useTranslation();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blogPost', slug],
    queryFn: () => blogService.getPost(slug),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded-lg" />
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {t('blog.postNotFound') || 'Post not found'}
        </p>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover"
        />
      )}
      
      <div className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <FaUser />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
          {post.views && (
            <div className="flex items-center gap-2">
              <FaEye />
              <span>{post.views} views</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
            >
              <FaTag className="inline mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </motion.article>
  );
};

export default BlogPostContent;

