import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaLanguage } from 'react-icons/fa';
import { useAuthStore } from '../../../../app/store/authStore';
import { blogService } from '../../../blog/services/blogService';
import { translateBlogPost } from '../../../blog/services/translationService';
import { BlogPost } from '../../../blog/types/blog.types';

interface BlogEditorAdminProps {
  postId: string | null;
  onClose: () => void;
  onSave: () => void;
}

const BlogEditorAdmin: React.FC<BlogEditorAdminProps> = ({
  postId,
  onClose,
  onSave,
}) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    tags: [],
    image: '',
    isPublished: false,
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const { data: post } = useQuery<BlogPost>({
    queryKey: ['blogPost', postId],
    queryFn: () => blogService.getPost(postId!),
    enabled: !!postId,
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        tags: post.tags,
        image: post.image || '',
        isPublished: post.isPublished,
        translations: post.translations,
      });
    }
  }, [post]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<BlogPost>) => {
      if (postId) {
        return blogService.updatePost(postId, data);
      } else {
        return blogService.createPost(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      onSave();
    },
  });

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleTranslate = async () => {
    if (!formData.title || !formData.content || !formData.excerpt) {
      alert(t('admin.blog.translateError') || 'Please fill in title, content, and excerpt first');
      return;
    }

    setIsTranslating(true);
    try {
      const sourceLanguage = i18n.language || 'tr';
      const translations = await translateBlogPost(
        formData.title,
        formData.content,
        formData.excerpt,
        sourceLanguage
      );

      setFormData({
        ...formData,
        translations: {
          ...formData.translations,
          ...translations,
        },
      });

      alert(t('admin.blog.translateSuccess') || 'Translations completed successfully!');
    } catch (error) {
      console.error('Translation error:', error);
      alert(t('admin.blog.translateError') || 'Translation failed. Please check your API key.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure user is authenticated
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    const dataToSubmit = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title || ''),
      author: {
        id: user.id, // Use authenticated user's ID
        name: user.name || 'Unknown User',
      },
    };
    mutation.mutate(dataToSubmit);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {postId
                ? t('admin.blog.editPost') || 'Edit Post'
                : t('admin.blog.createPost') || 'Create Post'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.title') || 'Title'}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.slug') || 'Slug'}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder={generateSlug(formData.title || '')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('admin.blog.form.slugHint') || 'URL-friendly version of the title'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.image') || 'Image URL'}
              </label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('admin.blog.form.imageHint') || 'Enter image URL or upload an image'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.excerpt') || 'Excerpt'}
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.content') || 'Content'}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('admin.blog.form.published') || 'Published'}
                </span>
              </label>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating || !formData.title || !formData.content || !formData.excerpt}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <FaLanguage />
                <span>
                  {isTranslating
                    ? t('admin.blog.translating') || 'Translating...'
                    : t('admin.blog.translate') || 'Translate to All Languages'}
                </span>
              </button>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t('admin.blog.cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {mutation.isPending
                  ? t('admin.blog.saving') || 'Saving...'
                  : t('admin.blog.save') || 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BlogEditorAdmin;

