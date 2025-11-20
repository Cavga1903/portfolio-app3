import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../../features/blog/services/blogService';
import { useUIStore } from '../../app/store/uiStore';
import { useDarkMode } from '../../hooks/useDarkMode';
import Toast from '../../components/Toast';
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp, FaBlog, FaProjectDiagram, FaTags, FaEye, FaEyeSlash, FaBookmark, FaHeart, FaShare, FaArchive, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { BlogPost } from '../../features/blog/types/blog.types';
import Navbar from '../../components/Navbar';
import { LoginModal, SignupModal } from '../../features/auth';

// Blog management components
const BlogListAdmin = React.lazy(() => import('../../features/admin/components/BlogManagement/BlogListAdmin'));
const BlogEditorAdmin = React.lazy(() => import('../../features/admin/components/BlogManagement/BlogEditorAdmin'));

const AdminBlogManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; rows: number; description?: string; slug?: string; color?: string; postCount?: number; isActive?: boolean }>>([
    { id: '1', name: 'Tutorials', rows: 5, description: 'Eğitim içerikleri', slug: 'tutorials', color: '#3B82F6', postCount: 12, isActive: true },
    { id: '2', name: 'Articles', rows: 3, description: 'Makale içerikleri', slug: 'articles', color: '#10B981', postCount: 8, isActive: true },
    { id: '3', name: 'News', rows: 4, description: 'Haber içerikleri', slug: 'news', color: '#F59E0B', postCount: 5, isActive: true },
  ]);
  const [editingCategories, setEditingCategories] = useState<{ [key: string]: { name: string; rows: number; description?: string; slug?: string; color?: string; isActive?: boolean } }>({});
  const [openCategoryAccordions, setOpenCategoryAccordions] = useState<{ [key: string]: boolean }>({});
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  
  // Memoize the callback to prevent unnecessary re-renders
  const handleSelectedPostsChange = useCallback((newSelectedPosts: Set<string>) => {
    setSelectedPosts(newSelectedPosts);
  }, []);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const categoryManagementRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { addToast, toasts, removeToast } = useUIStore();
  const { isDarkMode } = useDarkMode();

  // Check if edit parameter is in URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingPost(editId);
      setShowEditor(true);
      // Remove edit parameter from URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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

  // Mutations for bulk operations
  const publishMutation = useMutation({
    mutationFn: async (postIds: string[]) => {
      const results = await Promise.all(
        postIds.map((id) => blogService.updatePost(id, { isPublished: true }))
      );
      return { postIds, count: results.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setSelectedPosts(new Set());
      addToast({
        message: t('admin.blog.publishSuccess', { count: data.count }) || `${data.count} post yayınlandı`,
        type: 'success',
      });
    },
    onError: (error) => {
      console.error('Error publishing posts:', error);
      addToast({
        message: t('admin.blog.publishError') || 'Postlar yayınlanırken bir hata oluştu',
        type: 'error',
      });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: async (postIds: string[]) => {
      const results = await Promise.all(
        postIds.map((id) => blogService.updatePost(id, { isPublished: false }))
      );
      return { postIds, count: results.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setSelectedPosts(new Set());
      addToast({
        message: t('admin.blog.unpublishSuccess', { count: data.count }) || `${data.count} post yayından kaldırıldı`,
        type: 'success',
      });
    },
    onError: (error) => {
      console.error('Error unpublishing posts:', error);
      addToast({
        message: t('admin.blog.unpublishError') || 'Postlar yayından kaldırılırken bir hata oluştu',
        type: 'error',
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (postIds: string[]) => {
      const results = await Promise.all(
        postIds.map((id) => blogService.updatePost(id, { isArchived: true }))
      );
      return { postIds, count: results.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setSelectedPosts(new Set());
      addToast({
        message: t('admin.blog.archiveSuccess', { count: data.count }) || `${data.count} post arşivlendi`,
        type: 'success',
      });
    },
    onError: (error) => {
      console.error('Error archiving posts:', error);
      addToast({
        message: t('admin.blog.archiveError') || 'Postlar arşivlenirken bir hata oluştu',
        type: 'error',
      });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async ({ postIds, toggle }: { postIds: string[]; toggle: boolean }) => {
      const results = await Promise.all(
        postIds.map((id) => blogService.updatePost(id, { isBookmarked: toggle }))
      );
      return { postIds, count: results.length, toggle };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setSelectedPosts(new Set());
      addToast({
        message: data.toggle
          ? (t('admin.blog.bookmarkSuccess', { count: data.count }) || `${data.count} post yer işareti eklendi`)
          : (t('admin.blog.bookmarkRemoveSuccess', { count: data.count }) || `${data.count} post yer işaretinden kaldırıldı`),
        type: 'success',
      });
    },
    onError: (error) => {
      console.error('Error bookmarking posts:', error);
      addToast({
        message: t('admin.blog.bookmarkError') || 'Yer işareti işlemi sırasında bir hata oluştu',
        type: 'error',
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({ postIds, toggle }: { postIds: string[]; toggle: boolean }) => {
      const results = await Promise.all(
        postIds.map((id) => blogService.updatePost(id, { isFavorited: toggle }))
      );
      return { postIds, count: results.length, toggle };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setSelectedPosts(new Set());
      addToast({
        message: data.toggle
          ? (t('admin.blog.favoriteSuccess', { count: data.count }) || `${data.count} post favorilere eklendi`)
          : (t('admin.blog.favoriteRemoveSuccess', { count: data.count }) || `${data.count} post favorilerden kaldırıldı`),
        type: 'success',
      });
    },
    onError: (error) => {
      console.error('Error favoriting posts:', error);
      addToast({
        message: t('admin.blog.favoriteError') || 'Favori işlemi sırasında bir hata oluştu',
        type: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postIds: string[]) => {
      await Promise.all(postIds.map((id) => blogService.deletePost(id)));
      return { count: postIds.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setSelectedPosts(new Set());
      addToast({
        message: t('admin.blog.deleteSuccess', { count: data.count }) || `${data.count} post silindi`,
        type: 'success',
      });
    },
    onError: (error: unknown) => {
      console.error('Error deleting posts:', error);
      let errorMessage = t('admin.blog.deleteError') || 'Postlar silinirken bir hata oluştu';
      
      // Check if it's a Firebase permission error
      const firebaseError = error as { code?: string; message?: string; stack?: string };
      if (firebaseError?.code === 'permission-denied' || firebaseError?.message?.includes('permission')) {
        errorMessage = 'İzin hatası: Firebase security rules kontrol edin. Kullanıcınızın admin rolü olduğundan emin olun.';
        console.error('Firebase Permission Error Details:', {
          code: firebaseError?.code,
          message: firebaseError?.message,
          stack: firebaseError?.stack,
        });
      }
      
      addToast({
        message: errorMessage,
        type: 'error',
      });
    },
  });

  const handleBulkAction = (action: string) => {
    const postIds = Array.from(selectedPosts);
    
    if (postIds.length === 0 && action !== 'share') {
      addToast({
        message: t('admin.blog.noSelection') || 'Lütfen en az bir post seçin',
        type: 'info',
      });
      setIsActionsMenuOpen(false);
      return;
    }

    try {
      switch (action) {
        case 'publish':
          if (postIds.length > 0) {
            publishMutation.mutate(postIds);
          }
          break;
        case 'unpublish':
          if (postIds.length > 0) {
            unpublishMutation.mutate(postIds);
          }
          break;
        case 'archive':
          if (postIds.length > 0) {
            archiveMutation.mutate(postIds);
          }
          break;
        case 'bookmark':
          if (postIds.length > 0) {
            // Get current posts to check bookmark status
            const allPosts = queryClient.getQueryData<BlogPost[]>(['blogPosts', 'admin']) || [];
            const selectedPostsData = allPosts.filter(p => postIds.includes(p.id));
            // If all are bookmarked, unbookmark them; otherwise bookmark them
            const allBookmarked = selectedPostsData.length > 0 && selectedPostsData.every(p => p.isBookmarked);
            bookmarkMutation.mutate({ postIds, toggle: !allBookmarked });
          }
          break;
        case 'favorite':
          if (postIds.length > 0) {
            // Get current posts to check favorite status
            const allPosts = queryClient.getQueryData<BlogPost[]>(['blogPosts', 'admin']) || [];
            const selectedPostsData = allPosts.filter(p => postIds.includes(p.id));
            // If all are favorited, unfavorite them; otherwise favorite them
            const allFavorited = selectedPostsData.length > 0 && selectedPostsData.every(p => p.isFavorited);
            favoriteMutation.mutate({ postIds, toggle: !allFavorited });
          }
          break;
        case 'delete':
          if (postIds.length > 0) {
            const confirmMessage = t('admin.blog.deleteConfirm', { count: postIds.length }) || `${postIds.length} postu silmek istediğinize emin misiniz?`;
            if (window.confirm(confirmMessage)) {
              deleteMutation.mutate(postIds);
            }
          }
          break;
        case 'edit':
          if (postIds.length === 1) {
            handleEdit(postIds[0]);
          } else {
            addToast({
              message: t('admin.blog.singleEditOnly') || 'Lütfen sadece bir post seçin',
              type: 'info',
            });
          }
          break;
        case 'share':
          // Share functionality - could open share dialog or copy link
          if (postIds.length === 1) {
            // Get post slug from cache
            const allPosts = queryClient.getQueryData<BlogPost[]>(['blogPosts', 'admin']) || [];
            const post = allPosts.find(p => p.id === postIds[0]);
            if (post) {
              const postUrl = `${window.location.origin}/blog/${post.slug}`;
              navigator.clipboard.writeText(postUrl).then(() => {
                addToast({
                  message: t('admin.blog.linkCopied') || 'Link kopyalandı',
                  type: 'success',
                });
              }).catch((err) => {
                console.error('Failed to copy link:', err);
                addToast({
                  message: t('admin.blog.linkCopyError') || 'Link kopyalanamadı',
                  type: 'error',
                });
              });
            } else {
              addToast({
                message: t('admin.blog.postNotFound') || 'Post bulunamadı',
                type: 'error',
              });
            }
          }
          break;
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error in handleBulkAction:', error);
      addToast({
        message: t('admin.blog.actionError') || 'Bir hata oluştu. Lütfen tekrar deneyin.',
        type: 'error',
      });
    }
    
    setIsActionsMenuOpen(false);
  };

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };

    if (isActionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsMenuOpen]);

  return (
    <div className={`min-h-screen pt-16 flex flex-col ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      {/* Header */}
      <header className={`shadow-sm border-b flex-shrink-0 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('admin.dashboard.title') || 'Dashboard'}
              </h1>
              <p className={`text-xs sm:text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('admin.dashboard.subtitle') || 'Manage your content'}
              </p>
            </div>
            <div className="relative" ref={actionsMenuRef}>
              <button
                onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
                title={t('admin.blog.create') || 'İşlemler'}
              >
                <FaPlus size={18} />
              </button>
              {isActionsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsActionsMenuOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-xl z-20 border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="py-1">
                      {/* Create Actions */}
                      <div className="px-3 py-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t('admin.actions.create') || 'Oluştur'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleCreate();
                          setIsActionsMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaPlus size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                        <span>{t('admin.blog.create') || 'Yeni Post Oluştur'}</span>
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement project creation
                          setIsActionsMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaPlus size={18} className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
                        <span>{t('admin.projects.create') || 'Yeni Proje Ekle'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsActionsMenuOpen(false);
                          // Scroll to category management section after a short delay
                          setTimeout(() => {
                            categoryManagementRef.current?.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }, 100);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaPlus size={18} className={isDarkMode ? "text-green-400" : "text-green-600"} />
                        <span>{t('admin.categories.create') || 'Kategori Ekle'}</span>
                      </button>
                      
                      <div className={`border-t my-1 ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      }`} />
                      
                      {/* General Actions */}
                      <div className="px-3 py-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t('admin.actions.general') || 'Genel İşlemler'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBulkAction('publish')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaEye size={18} className={isDarkMode ? "text-green-400" : "text-green-600"} />
                        <span>{t('admin.blog.publish') || 'Yayınla'}</span>
                        {selectedPosts.size > 0 && (
                          <span className="ml-auto text-xs text-gray-500">({selectedPosts.size})</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleBulkAction('unpublish')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaEyeSlash size={18} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                        <span>{t('admin.blog.unpublish') || 'Yayından Kaldır'}</span>
                        {selectedPosts.size > 0 && (
                          <span className="ml-auto text-xs text-gray-500">({selectedPosts.size})</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleBulkAction('edit')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaEdit size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                        <span>{t('admin.blog.editPost') || 'Düzenle'}</span>
                      </button>
                      
                      <div className={`border-t my-1 ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      }`} />
                      
                      {/* Organization Actions */}
                      <div className="px-3 py-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t('admin.actions.organization') || 'Organizasyon'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBulkAction('bookmark')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaBookmark size={18} className={isDarkMode ? "text-yellow-400" : "text-yellow-600"} />
                        <span>{t('admin.blog.bookmark') || 'Yer İşareti'}</span>
                        {selectedPosts.size > 0 && (
                          <span className="ml-auto text-xs text-gray-500">({selectedPosts.size})</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleBulkAction('favorite')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaHeart size={18} className={isDarkMode ? "text-pink-400" : "text-pink-600"} />
                        <span>{t('admin.blog.favorite') || 'Favori'}</span>
                        {selectedPosts.size > 0 && (
                          <span className="ml-auto text-xs text-gray-500">({selectedPosts.size})</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleBulkAction('share')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaShare size={18} className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
                        <span>{t('admin.blog.share') || 'Paylaş'}</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('archive')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaArchive size={18} className={isDarkMode ? "text-orange-400" : "text-orange-600"} />
                        <span>{t('admin.blog.archive') || 'Arşivle'}</span>
                        {selectedPosts.size > 0 && (
                          <span className="ml-auto text-xs text-gray-500">({selectedPosts.size})</span>
                        )}
                      </button>
                      
                      <div className={`border-t my-1 ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      }`} />
                      
                      {/* Danger Actions */}
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                          isDarkMode
                            ? 'text-red-400 hover:bg-red-900/20'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <FaTrash size={18} />
                        <span>{t('admin.blog.delete') || 'Sil'}</span>
                        {selectedPosts.size > 0 && (
                          <span className="ml-auto text-xs text-gray-500">({selectedPosts.size})</span>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col min-h-0 max-w-6xl">
        {/* Management Sections */}
        <div className="mb-4 sm:mb-6 space-y-4">
          {/* Blog Management */}
          <div className={`rounded-lg border shadow-sm w-full ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-6 py-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <FaBlog className={`text-xl ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('admin.blog.title') || 'Blog Yönetimi'}
                </span>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-4 pt-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('admin.blog.search') || 'Post ara...'}
                        className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    {/* Blog List Table */}
                    <div className="w-full">
                      <React.Suspense fallback={<div className={`animate-pulse h-96 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />}>
                        <BlogListAdmin
                          searchQuery={searchQuery}
                          onEdit={handleEdit}
                          onSelectedPostsChange={handleSelectedPostsChange}
                        />
                      </React.Suspense>
                    </div>
            </div>
          </div>

          {/* Project Management */}
          <div className={`rounded-lg border shadow-sm w-full ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-6 py-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <FaProjectDiagram className={`text-xl ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <span className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('admin.projects.title') || 'Proje Yönetimi'}
                </span>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-4 pt-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                      <input
                        type="text"
                        placeholder="Proje ara..."
                        className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    {/* Project List Placeholder */}
                    <div className={`rounded-xl shadow-lg p-12 text-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {t('admin.projects.comingSoon') || 'Yakında eklenecek...'}
                      </p>
                    </div>
            </div>
          </div>

          {/* Category Management */}
          <div ref={categoryManagementRef} className={`rounded-lg border shadow-sm w-full ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-6 py-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <FaTags className={`text-xl ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('admin.categories.title') || 'Kategori Yönetimi'}
                </span>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-4 pt-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                      <input
                        type="text"
                        placeholder="Kategori ara..."
                        className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    {/* Add New Category Button */}
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          const newId = Date.now().toString();
                          const newCategory = { 
                            id: newId, 
                            name: 'Yeni Kategori', 
                            rows: 5, 
                            description: '', 
                            slug: '', 
                            color: '#10B981',
                            postCount: 0,
                            isActive: true 
                          };
                          setCategories(prev => [...prev, newCategory]);
                          setOpenCategoryAccordions(prev => ({ ...prev, [newId]: true }));
                        }}
                        className="w-full px-4 py-3 text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <FaPlus size={18} />
                        <span>{t('admin.categories.addNew') || 'Yeni Kategori Ekle'}</span>
                      </button>
                    </div>
                    {/* Category List */}
                    <div className="space-y-3">
                      {categories.map((category) => {
                        const isOpen = openCategoryAccordions[category.id] || false;
                        const editing = editingCategories[category.id] || { 
                          name: category.name, 
                          rows: category.rows,
                          description: category.description || '',
                          slug: category.slug || '',
                          color: category.color || '#10B981',
                          isActive: category.isActive !== false
                        };
                        
                        return (
                          <div key={category.id} className={`rounded-lg border shadow-sm ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-200'
                          }`}>
                            <button
                              onClick={() => {
                                setOpenCategoryAccordions(prev => ({
                                  ...prev,
                                  [category.id]: !prev[category.id]
                                }));
                              }}
                              className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors rounded-lg border-b ${
                                isDarkMode
                                  ? 'hover:bg-gray-700/50 border-gray-700'
                                  : 'hover:bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: editing.color || '#10B981' }}
                                />
                                <FaTags className={`text-lg ${
                                  isDarkMode ? 'text-green-400' : 'text-green-600'
                                }`} />
                                <span className={`font-semibold text-base ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {editing.name}
                                </span>
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  ({editing.rows} satır)
                                </span>
                                {category.postCount !== undefined && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isDarkMode
                                      ? 'bg-gray-700 text-gray-400'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {category.postCount} post
                                  </span>
                                )}
                                {editing.isActive === false && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isDarkMode
                                      ? 'bg-red-900/30 text-red-400'
                                      : 'bg-red-100 text-red-600'
                                  }`}>
                                    Pasif
                                  </span>
                                )}
                              </div>
                              {isOpen ? (
                                <FaChevronUp className={`text-lg ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                              ) : (
                                <FaChevronDown className={`text-lg ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                              )}
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 pb-6 space-y-5 pt-4">
                                    {/* Category Name Input */}
                                    <div>
                                      <label className={`block text-base font-semibold mb-3 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        {t('admin.categories.name') || 'Kategori Adı'}
                                      </label>
                                      <input
                                        type="text"
                                        value={editing.name}
                                        onChange={(e) => {
                                          setEditingCategories(prev => ({
                                            ...prev,
                                            [category.id]: { 
                                              ...prev[category.id] || { 
                                                name: category.name, 
                                                rows: category.rows,
                                                description: category.description || '',
                                                slug: category.slug || '',
                                                color: category.color || '#10B981',
                                                isActive: category.isActive !== false
                                              }, 
                                              name: e.target.value 
                                            }
                                          }));
                                        }}
                                        className={`w-full px-4 py-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                          isDarkMode
                                            ? 'bg-gray-800 border-gray-700 text-white'
                                            : 'bg-white border-gray-200 text-gray-900'
                                        }`}
                                        placeholder={t('admin.categories.namePlaceholder') || 'Kategori adını girin'}
                                      />
                                    </div>
                                    {/* Category Slug Input */}
                                    <div>
                                      <label className={`block text-base font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t('admin.categories.slug') || 'URL Slug'}
                                      </label>
                                      <input
                                        type="text"
                                        value={editing.slug || ''}
                                        onChange={(e) => {
                                          const slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                          setEditingCategories(prev => ({
                                            ...prev,
                                            [category.id]: { 
                                              ...prev[category.id] || { 
                                                name: category.name, 
                                                rows: category.rows,
                                                description: category.description || '',
                                                slug: category.slug || '',
                                                color: category.color || '#10B981',
                                                isActive: category.isActive !== false
                                              }, 
                                              slug 
                                            }
                                          }));
                                        }}
                                        className={`w-full px-4 py-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        placeholder={t('admin.categories.slugPlaceholder') || 'kategori-url-slug'}
                                      />
                                    </div>
                                    {/* Category Description Input */}
                                    <div>
                                      <label className={`block text-base font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t('admin.categories.description') || 'Açıklama'}
                                      </label>
                                      <textarea
                                        value={editing.description || ''}
                                        onChange={(e) => {
                                          setEditingCategories(prev => ({
                                            ...prev,
                                            [category.id]: { 
                                              ...prev[category.id] || { 
                                                name: category.name, 
                                                rows: category.rows,
                                                description: category.description || '',
                                                slug: category.slug || '',
                                                color: category.color || '#10B981',
                                                isActive: category.isActive !== false
                                              }, 
                                              description: e.target.value 
                                            }
                                          }));
                                        }}
                                        rows={3}
                                        className="w-full px-4 py-3 text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white resize-none"
                                        placeholder={t('admin.categories.descriptionPlaceholder') || 'Kategori açıklaması'}
                                      />
                                    </div>
                                    {/* Color and Rows Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                      {/* Category Color Input */}
                                      <div>
                                        <label className={`block text-base font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          {t('admin.categories.color') || 'Renk'}
                                        </label>
                                        <div className="flex items-center gap-3">
                                          <input
                                            type="color"
                                            value={editing.color || '#10B981'}
                                            onChange={(e) => {
                                              setEditingCategories(prev => ({
                                                ...prev,
                                                [category.id]: { 
                                                  ...prev[category.id] || { 
                                                    name: category.name, 
                                                    rows: category.rows,
                                                    description: category.description || '',
                                                    slug: category.slug || '',
                                                    color: category.color || '#10B981',
                                                    isActive: category.isActive !== false
                                                  }, 
                                                  color: e.target.value 
                                                }
                                              }));
                                            }}
                                            className={`w-16 h-12 rounded-lg border cursor-pointer ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                          />
                                          <input
                                            type="text"
                                            value={editing.color || '#10B981'}
                                            onChange={(e) => {
                                              setEditingCategories(prev => ({
                                                ...prev,
                                                [category.id]: { 
                                                  ...prev[category.id] || { 
                                                    name: category.name, 
                                                    rows: category.rows,
                                                    description: category.description || '',
                                                    slug: category.slug || '',
                                                    color: category.color || '#10B981',
                                                    isActive: category.isActive !== false
                                                  }, 
                                                  color: e.target.value 
                                                }
                                              }));
                                            }}
                                            className={`flex-1 px-4 py-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            placeholder="#10B981"
                                          />
                                        </div>
                                      </div>
                                      {/* Rows Input */}
                                      <div>
                                        <label className={`block text-base font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          {t('admin.categories.rows') || 'Satır Sayısı'}
                                        </label>
                                        <input
                                          type="number"
                                          min="1"
                                          max="20"
                                          value={editing.rows}
                                          onChange={(e) => {
                                            const rows = parseInt(e.target.value) || 1;
                                            setEditingCategories(prev => ({
                                              ...prev,
                                              [category.id]: { 
                                                ...prev[category.id] || { 
                                                  name: category.name, 
                                                  rows: category.rows,
                                                  description: category.description || '',
                                                  slug: category.slug || '',
                                                  color: category.color || '#10B981',
                                                  isActive: category.isActive !== false
                                                }, 
                                                rows 
                                              }
                                            }));
                                          }}
                                          className={`w-full px-4 py-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                          placeholder={t('admin.categories.rowsPlaceholder') || 'Kaç satır gösterilecek'}
                                        />
                                      </div>
                                    </div>
                                    {/* Active Status Toggle */}
                                    <div>
                                      <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={editing.isActive !== false}
                                          onChange={(e) => {
                                            setEditingCategories(prev => ({
                                              ...prev,
                                              [category.id]: { 
                                                ...prev[category.id] || { 
                                                  name: category.name, 
                                                  rows: category.rows,
                                                  description: category.description || '',
                                                  slug: category.slug || '',
                                                  color: category.color || '#10B981',
                                                  isActive: category.isActive !== false
                                                }, 
                                                isActive: e.target.checked 
                                              }
                                            }));
                                          }}
                                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                        />
                                        <span className={`text-base font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          {t('admin.categories.isActive') || 'Aktif'}
                                        </span>
                                      </label>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className={`flex gap-3 justify-between pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const confirmMessage = t('admin.categories.deleteConfirm') || 'Bu kategoriyi silmek istediğinize emin misiniz?';
                                          if (window.confirm(confirmMessage)) {
                                            setCategories(prev => prev.filter(cat => cat.id !== category.id));
                                            setEditingCategories(prev => {
                                              const newState = { ...prev };
                                              delete newState[category.id];
                                              return newState;
                                            });
                                            setOpenCategoryAccordions(prev => {
                                              const newState = { ...prev };
                                              delete newState[category.id];
                                              return newState;
                                            });
                                          }
                                        }}
                                        className="px-5 py-2.5 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                                      >
                                        <FaTrash size={16} />
                                        <span>{t('admin.categories.delete') || 'Sil'}</span>
                                      </button>
                                      <div className="flex gap-3">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingCategories(prev => {
                                              const newState = { ...prev };
                                              delete newState[category.id];
                                              return newState;
                                            });
                                          }}
                                          className={`px-5 py-2.5 text-base font-medium rounded-lg transition-colors flex items-center gap-2 ${isDarkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                                        >
                                          <FaTimes size={16} />
                                          <span>{t('admin.categories.cancel') || 'İptal'}</span>
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCategories(prev => prev.map(cat => 
                                              cat.id === category.id 
                                                ? { 
                                                    ...cat, 
                                                    name: editing.name, 
                                                    rows: editing.rows,
                                                    description: editing.description,
                                                    slug: editing.slug,
                                                    color: editing.color,
                                                    isActive: editing.isActive
                                                  }
                                                : cat
                                            ));
                                            setEditingCategories(prev => {
                                              const newState = { ...prev };
                                              delete newState[category.id];
                                              return newState;
                                            });
                                          }}
                                          className="px-5 py-2.5 text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                          <FaSave size={16} />
                                          <span>{t('admin.categories.save') || 'Kaydet'}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
            </div>
          </div>
        </div>


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

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[999999] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            isVisible={true}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
            type={toast.type}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminBlogManagement;

