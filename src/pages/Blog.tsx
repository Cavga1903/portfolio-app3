import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import SkeletonLoader from '../components/SkeletonLoader';

// Lazy load blog components
const BlogList = React.lazy(() => import('../features/blog/components/BlogList'));
const BlogFilters = React.lazy(() => import('../features/blog/components/BlogFilters'));

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-6 md:px-8 lg:px-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('blog.title') || 'Blog'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('blog.subtitle') || 'Discover the latest insights, tutorials, and stories'}
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('blog.searchPlaceholder') || 'Search articles...'}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:col-span-1">
              <Suspense fallback={<SkeletonLoader type="about" />}>
                <BlogFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </Suspense>
            </aside>

            {/* Main Content - Blog List */}
            <main className="lg:col-span-3">
              <Suspense fallback={<SkeletonLoader type="projects" />}>
                <BlogList
                  searchQuery={searchQuery}
                  category={selectedCategory}
                />
              </Suspense>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

