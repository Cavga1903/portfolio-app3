import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaSearch } from 'react-icons/fa';

// Blog management components
const BlogListAdmin = React.lazy(() => import('../../features/admin/components/BlogManagement/BlogListAdmin'));
const BlogEditorAdmin = React.lazy(() => import('../../features/admin/components/BlogManagement/BlogEditorAdmin'));

const AdminBlogManagement: React.FC = () => {
  const { t } = useTranslation();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEdit = (postId: string) => {
    setEditingPost(postId);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('admin.blog.title') || 'Blog Management'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('admin.blog.subtitle') || 'Manage your blog posts'}
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <FaPlus />
              <span>{t('admin.blog.create') || 'Create Post'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.blog.search') || 'Search posts...'}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </motion.div>

        {/* Blog List */}
        <React.Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg" />}>
          <BlogListAdmin
            searchQuery={searchQuery}
            onEdit={handleEdit}
          />
        </React.Suspense>

        {/* Editor Modal */}
        {showEditor && (
          <React.Suspense fallback={null}>
            <BlogEditorAdmin
              postId={editingPost}
              onClose={handleCloseEditor}
              onSave={handleCloseEditor}
            />
          </React.Suspense>
        )}
      </main>
    </div>
  );
};

export default AdminBlogManagement;

