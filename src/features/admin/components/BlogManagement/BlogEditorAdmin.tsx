import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaLanguage, FaExclamationCircle } from 'react-icons/fa';
import { useAuthStore } from '../../../../app/store/authStore';
import { blogService } from '../../../blog/services/blogService';
import { translateBlogPost } from '../../../blog/services/translationService';
import { validateDraft, validateForPublish, getFieldError, hasFieldError, ValidationError } from '../../services/blogValidationService';
import { generateSlug, checkSlugAvailability, generateUniqueSlug } from '../../../blog/services/slugService';
import { uploadBlogImage } from '../../services/imageUploadService';
import { RichTextEditor } from './RichTextEditor';
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
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: post } = useQuery<BlogPost>({
    queryKey: ['blogPost', postId],
    queryFn: () => blogService.getPostById(postId!),
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
      // Invalidate both admin and public queries
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', postId] });
      onSave();
    },
    onError: (error) => {
      console.error('Error saving post:', error);
      // You can add toast notification here if needed
    },
  });

  const handleTitleChange = (title: string) => {
    const newSlug = formData.slug || generateSlug(title);
    setFormData({
      ...formData,
      title,
      slug: newSlug,
    });
    
    // Clear validation errors when user types
    if (hasFieldError(validationErrors, 'title')) {
      setValidationErrors(validationErrors.filter(e => e.field !== 'title'));
    }
  };

  // Check slug availability when slug changes
  useEffect(() => {
    const checkSlug = async () => {
      if (!formData.slug || formData.slug.length < 3) {
        setSlugError(null);
        return;
      }

      // Don't check if it's the same as the original post slug
      if (postId && post && post.slug === formData.slug) {
        setSlugError(null);
        return;
      }

      setIsCheckingSlug(true);
      setSlugError(null);

      try {
        const isAvailable = await checkSlugAvailability(formData.slug, postId || undefined);
        if (!isAvailable) {
          setSlugError(t('admin.blog.slugTaken') || 'Bu slug zaten kullanılıyor');
        }
      } catch (error) {
        console.error('Error checking slug:', error);
      } finally {
        setIsCheckingSlug(false);
      }
    };

    const timeoutId = setTimeout(checkSlug, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.slug, postId, post, t]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure user is authenticated
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Generate slug if not provided
    let finalSlug = formData.slug || generateSlug(formData.title || '');
    
    // Ensure slug is unique
    if (!postId || (post && post.slug !== finalSlug)) {
      const isAvailable = await checkSlugAvailability(finalSlug, postId || undefined);
      if (!isAvailable) {
        finalSlug = await generateUniqueSlug(finalSlug, postId || undefined);
      }
    }

    // Validate based on publish status
    const validation = formData.isPublished
      ? validateForPublish({ ...formData, slug: finalSlug })
      : validateDraft({ ...formData, slug: finalSlug });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      // Scroll to first error
      const firstErrorField = validation.errors[0]?.field;
      if (firstErrorField) {
        const element = document.querySelector(`[data-field="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Clear validation errors
    setValidationErrors([]);
    setSlugError(null);
    
    const dataToSubmit = {
      ...formData,
      slug: finalSlug,
      author: {
        id: user.id,
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
            <div data-field="title">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.title') || 'Title'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  hasFieldError(validationErrors, 'title')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              />
              {hasFieldError(validationErrors, 'title') && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <FaExclamationCircle className="w-4 h-4" />
                  <span>{getFieldError(validationErrors, 'title')}</span>
                </div>
              )}
            </div>

            <div data-field="slug">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.slug') || 'Slug'}
                <span className="text-red-500 ml-1">*</span>
                {isCheckingSlug && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {t('admin.blog.checkingSlug') || 'Kontrol ediliyor...'}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  const newSlug = e.target.value.toLowerCase().trim();
                  setFormData({ ...formData, slug: newSlug });
                  setSlugError(null);
                  if (hasFieldError(validationErrors, 'slug')) {
                    setValidationErrors(validationErrors.filter(e => e.field !== 'slug'));
                  }
                }}
                placeholder={generateSlug(formData.title || '')}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  hasFieldError(validationErrors, 'slug') || slugError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              />
              {(hasFieldError(validationErrors, 'slug') || slugError) && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <FaExclamationCircle className="w-4 h-4" />
                  <span>{slugError || getFieldError(validationErrors, 'slug')}</span>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('admin.blog.form.slugHint') || 'URL-friendly version of the title'}
              </p>
            </div>

            <div data-field="image">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.image') || 'Image URL'}
                {formData.isPublished && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    if (hasFieldError(validationErrors, 'image')) {
                      setValidationErrors(validationErrors.filter(e => e.field !== 'image'));
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={`flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    hasFieldError(validationErrors, 'image')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                />
                <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingImage || !postId}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !postId) return;

                      setIsUploadingImage(true);
                      try {
                        const result = await uploadBlogImage(file, postId, true);
                        setFormData({ ...formData, image: result.url });
                        if (hasFieldError(validationErrors, 'image')) {
                          setValidationErrors(validationErrors.filter(e => e.field !== 'image'));
                        }
                      } catch (error) {
                        console.error('Image upload error:', error);
                        alert(error instanceof Error ? error.message : 'Görsel yüklenirken bir hata oluştu');
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }}
                  />
                  {isUploadingImage ? t('admin.blog.uploading') || 'Yükleniyor...' : t('admin.blog.upload') || 'Yükle'}
                </label>
              </div>
              {hasFieldError(validationErrors, 'image') && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <FaExclamationCircle className="w-4 h-4" />
                  <span>{getFieldError(validationErrors, 'image')}</span>
                </div>
              )}
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
                {!postId && (
                  <span className="text-amber-600 dark:text-amber-400 ml-1">
                    ({t('admin.blog.saveFirst') || 'Önce kaydedin'})
                  </span>
                )}
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

            <div data-field="content">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.blog.form.content') || 'Content'}
                <span className="text-red-500 ml-1">*</span>
                {formData.isPublished && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({t('admin.blog.minWords') || 'Min 50 kelime'})
                  </span>
                )}
              </label>
              <RichTextEditor
                content={formData.content || ''}
                onChange={(html) => {
                  // Only update content field, preserve other fields
                  setFormData((prev) => ({ ...prev, content: html }));
                  if (hasFieldError(validationErrors, 'content')) {
                    setValidationErrors(validationErrors.filter(e => e.field !== 'content'));
                  }
                }}
                placeholder={t('admin.blog.form.contentPlaceholder') || 'İçeriğinizi buraya yazın...'}
                error={hasFieldError(validationErrors, 'content')}
                minHeight="400px"
              />
              {hasFieldError(validationErrors, 'content') && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <FaExclamationCircle className="w-4 h-4" />
                  <span>{getFieldError(validationErrors, 'content')}</span>
                </div>
              )}
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

