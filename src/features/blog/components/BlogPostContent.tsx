import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaTag, FaUser, FaEye } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types/blog.types';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface BlogPostContentProps {
  slug: string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ slug }) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blogPost', slug, i18n.language],
    queryFn: () => blogService.getPost(slug, i18n.language),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className={`animate-pulse h-12 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className={`animate-pulse h-64 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className={`text-lg ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {t('blog.postNotFound') || 'Post not found'}
        </p>
      </div>
    );
  }

  // Check if content is Markdown (starts with #, -, >, etc.) or HTML
  const isMarkdown = post.content.trim().match(/^[#->*`\d]/) && !post.content.trim().startsWith('<');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl shadow-lg overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover"
        />
      )}
      
      <div className="p-6 md:p-8">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {post.title}
        </h1>
        
        <div className={`flex flex-wrap items-center gap-4 text-sm mb-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
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
              className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode
                  ? 'bg-blue-900/30 text-blue-400'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              <FaTag className="inline mr-1" />
              {tag}
            </span>
          ))}
        </div>

        {/* Render Markdown or HTML content */}
        {isMarkdown ? (
          <div className={`prose prose-lg max-w-none ${
            isDarkMode 
              ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-gray-900 prose-blockquote:text-gray-300 prose-a:text-blue-400 prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300' 
              : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-100 prose-blockquote:text-gray-700 prose-a:text-blue-600'
          }`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div
            className={`prose prose-lg max-w-none ${
              isDarkMode 
                ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-gray-900 prose-blockquote:text-gray-300 prose-a:text-blue-400 prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300' 
                : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-100 prose-blockquote:text-gray-700 prose-a:text-blue-600'
            }`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </div>
    </motion.article>
  );
};

export default BlogPostContent;

