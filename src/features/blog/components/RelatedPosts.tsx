import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types/blog.types';

interface RelatedPostsProps {
  currentSlug: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentSlug }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data: posts } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts', 'related', i18n.language],
    queryFn: () => blogService.getPosts(i18n.language),
  });

  const relatedPosts = posts
    ?.filter((post: BlogPost) => post.slug !== currentSlug)
    .slice(0, 3) || [];

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('blog.relatedPosts') || 'Related Posts'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post: BlogPost, index: number) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;

