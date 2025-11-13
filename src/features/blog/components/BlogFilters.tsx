import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTag } from 'react-icons/fa';

interface BlogFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();

  const categories = [
    { id: 'all', name: t('blog.categories.all') || 'All Posts', count: 12 },
    { id: 'tutorial', name: t('blog.categories.tutorial') || 'Tutorials', count: 5 },
    { id: 'article', name: t('blog.categories.article') || 'Articles', count: 4 },
    { id: 'news', name: t('blog.categories.news') || 'News', count: 3 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FaTag />
        {t('blog.categories.title') || 'Categories'}
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              onCategoryChange(category.id === 'all' ? null : category.id)
            }
            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedCategory === category.id ||
              (category.id === 'all' && selectedCategory === null)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{category.name}</span>
              <span className="text-sm opacity-75">({category.count})</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogFilters;

