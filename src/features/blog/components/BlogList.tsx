import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import { blogService } from '../services/blogService';

interface BlogListProps {
  searchQuery: string;
  category: string | null;
}

const BlogList: React.FC<BlogListProps> = ({ searchQuery, category }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts', searchQuery, category],
    queryFn: async () => {
      const allPosts = await blogService.getPosts();
      
      // Filter by search query
      let filtered = allPosts;
      if (searchQuery) {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by category
      if (category) {
        filtered = filtered.filter((post) => post.tags.includes(category));
      }
      
      return filtered;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {t('blog.noPosts') || 'No posts found'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => navigate(`/blog/${post.slug}`)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTag />
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 transition-all">
                  {t('blog.readMore') || 'Read more'}
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default BlogList;

