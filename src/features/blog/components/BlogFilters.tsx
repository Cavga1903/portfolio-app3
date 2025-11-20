import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTag } from 'react-icons/fa';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface BlogFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const categories = [
    { id: 'all', name: t('blog.categories.all') || 'All Posts', count: 12 },
    { id: 'tutorial', name: t('blog.categories.tutorial') || 'Tutorials', count: 5 },
    { id: 'article', name: t('blog.categories.article') || 'Articles', count: 4 },
    { id: 'news', name: t('blog.categories.news') || 'News', count: 3 },
  ];

  return (
    <div className={`rounded-xl shadow-lg p-6 sticky top-4 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
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
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

