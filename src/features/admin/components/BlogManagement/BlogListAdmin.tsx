import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { blogService } from '../../../blog/services/blogService';
import { BlogPost } from '../../../blog/types/blog.types';

interface BlogListAdminProps {
  searchQuery: string;
  onEdit: (postId: string) => void;
}

const BlogListAdmin: React.FC<BlogListAdminProps> = ({ searchQuery, onEdit }) => {
  const { t } = useTranslation();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts', searchQuery],
    queryFn: async () => {
      const allPosts = await blogService.getPosts();
      if (!searchQuery) return allPosts;
      return allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.blog.confirmDelete') || 'Are you sure you want to delete this post?')) {
      await blogService.deletePost(id);
      // TODO: Invalidate query
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('admin.blog.table.title') || 'Title'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('admin.blog.table.status') || 'Status'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('admin.blog.table.views') || 'Views'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('admin.blog.table.actions') || 'Actions'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts?.map((post) => (
            <motion.tr
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {post.excerpt.substring(0, 50)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    post.isPublished
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {post.isPublished
                    ? t('admin.blog.published') || 'Published'
                    : t('admin.blog.draft') || 'Draft'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {post.views || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(post.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogListAdmin;

