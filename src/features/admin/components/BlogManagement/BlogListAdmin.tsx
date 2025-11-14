import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaEllipsisV,
  FaHeading,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
  FaEye as FaEyeIcon,
  FaBookmark,
  FaSquare,
  FaCheckSquare,
  FaHeart,
  FaEdit,
  FaTrash,
  FaArchive,
  FaBoxOpen,
  FaShare,
  FaCircle,
} from 'react-icons/fa';
import { blogService } from '../../../blog/services/blogService';
import { BlogPost } from '../../../blog/types/blog.types';

interface BlogListAdminProps {
  searchQuery: string;
  onEdit: (postId: string) => void;
  onSelectedPostsChange?: (selectedPosts: Set<string>) => void;
}

const BlogListAdmin: React.FC<BlogListAdminProps> = ({ searchQuery, onEdit, onSelectedPostsChange }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [openActionsMenu, setOpenActionsMenu] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts', 'admin', searchQuery],
    queryFn: async () => {
      // Admin panelinde tüm postları getir (published + draft)
      const allPosts = await blogService.getAllPosts();
      if (!searchQuery) return allPosts;
      return allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
  });

  // Sync selectedPosts to parent when selectedPosts changes
  useEffect(() => {
    if (onSelectedPostsChange) {
      onSelectedPostsChange(selectedPosts);
    }
  }, [selectedPosts, onSelectedPostsChange]);

  // Clean up invalid selections when posts change
  useEffect(() => {
    if (posts && selectedPosts.size > 0) {
      const validSelected = Array.from(selectedPosts).filter(id => 
        posts.some(post => post.id === id)
      );
      if (validSelected.length !== selectedPosts.size) {
        setSelectedPosts(new Set(validSelected));
      }
    }
  }, [posts, selectedPosts]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const updateData: Partial<BlogPost> = {
        isPublished: !isPublished,
      };
      
      // If publishing, set publishedAt date
      if (isPublished === false) {
        updateData.publishedAt = new Date().toISOString();
      }
      // If unpublishing, keep publishedAt but mark as draft
      // (We don't delete publishedAt to keep history)
      
      try {
        const result = await blogService.updatePost(id, updateData);
        return result;
      } catch (error) {
        console.error('Error toggling publish status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both admin and public queries
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts', 'admin'] });
    },
    onError: (error) => {
      console.error('Failed to toggle publish status:', error);
      alert(t('admin.blog.toggleError') || 'Durum değiştirilemedi. Lütfen tekrar deneyin.');
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: async ({ id, isBookmarked }: { id: string; isBookmarked: boolean }) => {
      try {
        return await blogService.updatePost(id, { isBookmarked: !isBookmarked });
      } catch (error) {
        console.error('Error toggling bookmark:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both admin and public queries
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts', 'admin'] });
    },
    onError: (error) => {
      console.error('Failed to toggle bookmark:', error);
      alert(t('admin.blog.toggleError') || 'Yer işareti durumu değiştirilemedi. Lütfen tekrar deneyin.');
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorited }: { id: string; isFavorited: boolean }) => {
      try {
        return await blogService.updatePost(id, { isFavorited: !isFavorited });
      } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both admin and public queries
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts', 'admin'] });
    },
    onError: (error) => {
      console.error('Failed to toggle favorite:', error);
      alert(t('admin.blog.toggleError') || 'Favori durumu değiştirilemedi. Lütfen tekrar deneyin.');
    },
  });

  const toggleArchiveMutation = useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      try {
        return await blogService.updatePost(id, { isArchived: !isArchived });
      } catch (error) {
        console.error('Error toggling archive:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both admin and public queries
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts', 'admin'] });
    },
    onError: (error) => {
      console.error('Failed to toggle archive:', error);
      alert(t('admin.blog.toggleError') || 'Arşiv durumu değiştirilemedi. Lütfen tekrar deneyin.');
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.blog.confirmDelete') || 'Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleTogglePublish = (post: BlogPost) => {
    togglePublishMutation.mutate({ id: post.id, isPublished: post.isPublished });
  };

  const handleToggleBookmark = (post: BlogPost) => {
    toggleBookmarkMutation.mutate({ id: post.id, isBookmarked: post.isBookmarked || false });
  };

  const handleToggleFavorite = (post: BlogPost) => {
    toggleFavoriteMutation.mutate({ id: post.id, isFavorited: post.isFavorited || false });
  };

  const handleToggleArchive = (post: BlogPost) => {
    toggleArchiveMutation.mutate({ id: post.id, isArchived: post.isArchived || false });
  };

  const handleShare = async (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: url,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(url);
        alert(t('admin.blog.shareCopied') || 'Link kopyalandı!');
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
          alert(t('admin.blog.shareCopied') || 'Link kopyalandı!');
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError);
        }
      }
    }
  };

  const handleToggleSelection = (postId: string) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === posts?.length) {
      setSelectedPosts(new Set<string>());
    } else {
      setSelectedPosts(new Set(posts?.map((p) => p.id) || []));
    }
  };

  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedPosts(new Set<string>());
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

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('admin.blog.noPosts') || 'No blog posts yet'}
        </p>
      </div>
    );
  }

  // Helper function to render actions dropdown menu
  const renderActionsMenu = (post: BlogPost) => {
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenActionsMenu(openActionsMenu === post.id ? null : post.id);
          }}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          title={t('admin.blog.table.actions') || 'Actions'}
        >
          <FaEllipsisV />
        </button>
        {openActionsMenu === post.id && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenActionsMenu(null)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-200 dark:border-gray-700">
              <div className="py-1">
                <button
                  onClick={() => {
                    handleTogglePublish(post);
                    setOpenActionsMenu(null);
                  }}
                  disabled={togglePublishMutation.isPending}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {post.isPublished ? (
                    <FaEyeSlash size={18} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <FaEyeIcon size={18} className="text-gray-600 dark:text-gray-400" />
                  )}
                  <span>{post.isPublished ? t('admin.blog.unpublish') || 'Unpublish' : t('admin.blog.publish') || 'Publish'}</span>
                </button>
                
                <button
                  onClick={() => {
                    onEdit(post.id);
                    setOpenActionsMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                >
                  <FaEdit size={18} className="text-blue-600 dark:text-blue-400" />
                  <span>{t('admin.blog.editPost') || 'Edit Post'}</span>
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                
                <button
                  onClick={() => {
                    handleToggleBookmark(post);
                    setOpenActionsMenu(null);
                  }}
                  disabled={toggleBookmarkMutation.isPending}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaBookmark size={18} className={`${post.isBookmarked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{post.isBookmarked ? t('admin.blog.unbookmark') || 'Remove Bookmark' : t('admin.blog.bookmark') || 'Bookmark'}</span>
                </button>
                
                <button
                  onClick={() => {
                    handleToggleFavorite(post);
                    setOpenActionsMenu(null);
                  }}
                  disabled={toggleFavoriteMutation.isPending}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaHeart size={18} className={`${post.isFavorited ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{post.isFavorited ? t('admin.blog.unfavorite') || 'Remove Favorite' : t('admin.blog.favorite') || 'Favorite'}</span>
                </button>
                
                <button
                  onClick={() => {
                    handleShare(post);
                    setOpenActionsMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                >
                  <FaShare size={18} className="text-purple-600 dark:text-purple-400" />
                  <span>{t('admin.blog.share') || 'Share'}</span>
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                
                <button
                  onClick={() => {
                    handleToggleArchive(post);
                    setOpenActionsMenu(null);
                  }}
                  disabled={toggleArchiveMutation.isPending}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {post.isArchived ? (
                    <FaBoxOpen size={18} className="text-orange-600 dark:text-orange-400" />
                  ) : (
                    <FaArchive size={18} className="text-gray-400 dark:text-gray-500" />
                  )}
                  <span>{post.isArchived ? t('admin.blog.unarchive') || 'Unarchive' : t('admin.blog.archive') || 'Archive'}</span>
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                
                <button
                  onClick={() => {
                    handleDelete(post.id);
                    setOpenActionsMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                >
                  <FaTrash size={18} />
                  <span>{t('admin.blog.delete') || 'Delete'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Calculate how many empty rows to show (minimum 10 rows visible)
  const minVisibleRows = 10;
  const emptyRowsCount = Math.max(0, minVisibleRows - (posts?.length || 0));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* Selection Mode Toolbar */}
      {isSelectionMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 md:px-6 py-3 flex items-center justify-between border-b-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              title="Select All"
            >
              {selectedPosts.size === posts?.length ? (
                <FaCheckSquare size={20} />
              ) : (
                <FaSquare size={20} />
              )}
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedPosts.size} {t('admin.blog.selected') || 'selected'}
            </span>
          </div>
          <button
            onClick={handleExitSelectionMode}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            {t('admin.blog.cancel') || 'Cancel'}
          </button>
        </div>
      )}

      {/* Desktop Table View - Excel Style */}
      <div className="hidden md:block flex-1 overflow-auto">
        <table className="w-full border-collapse min-w-full table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 dark:border-gray-600 px-1 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800" style={{ width: '3%' }}>
                {/* Checkbox column */}
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800" style={{ width: '5%' }}>
                #
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800" style={{ width: '30%' }}>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <FaHeading className="text-sm sm:text-base lg:text-lg" />
                  <span className="hidden xl:inline text-xs">{t('admin.blog.table.title') || 'Başlık'}</span>
                </div>
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800" style={{ width: '15%' }}>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <FaInfoCircle className="text-sm sm:text-base lg:text-lg" />
                  <span className="hidden xl:inline text-xs">{t('admin.blog.table.status') || 'Durum'}</span>
                </div>
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800" style={{ width: '12%' }}>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <FaEye className="text-sm sm:text-base lg:text-lg" />
                  <span className="hidden xl:inline text-xs">{t('admin.blog.table.views') || 'Görüntülenme'}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {/* Posts rows */}
            {posts?.map((post, index) => (
              <motion.tr
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  selectedPosts.has(post.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-3 align-middle">
                  <button
                    onClick={() => handleToggleSelection(post.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mx-auto flex items-center justify-center"
                  >
                    {selectedPosts.has(post.id) ? (
                      <FaCheckSquare size={18} className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FaSquare size={18} />
                    )}
                  </button>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 py-3 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {index + 1}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                    {post.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs lg:max-w-md mt-1 hidden sm:block">
                    {post.excerpt.substring(0, 60)}...
                  </div>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 whitespace-nowrap text-center">
                  {(() => {
                    // Determine status based on post properties
                    if (post.isArchived) {
                      return (
                        <div className="flex items-center justify-center gap-2">
                          <FaCircle size={10} className="text-orange-500 dark:text-orange-400" />
                          <span className="text-xs text-orange-600 dark:text-orange-400 hidden sm:inline">
                            {t('admin.blog.archived') || 'Archived'}
                          </span>
                        </div>
                      );
                    } else if (post.isPublished) {
                      return (
                        <div className="flex items-center justify-center gap-2">
                          <FaCircle size={10} className="text-green-500 dark:text-green-400" />
                          <span className="text-xs text-green-600 dark:text-green-400 hidden sm:inline">
                            {t('admin.blog.published') || 'Published'}
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center justify-center gap-2">
                          <FaCircle size={10} className="text-gray-400 dark:text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
                            {t('admin.blog.draft') || 'Draft'}
                          </span>
                        </div>
                      );
                    }
                  })()}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center">
                  {post.views || 0}
                </td>
              </motion.tr>
            ))}
            
            {/* Empty rows (Excel style) */}
            {Array.from({ length: emptyRowsCount }).map((_, index) => (
              <tr key={`empty-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="border border-gray-300 dark:border-gray-600 px-1 py-3 h-12"></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 py-3 h-12 text-center text-xs text-gray-400">
                  {posts?.length ? posts.length + index + 1 : index + 1}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 h-12"></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 h-12"></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-3 h-12"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - No Scroll, Fully Responsive */}
      <div className="md:hidden">
        <div className="space-y-3">
          {posts?.map((post) => {
            let statusText = '';
            let statusClass = '';

            if (post.isArchived) {
              statusText = t('admin.blog.archived') || 'Archived';
              statusClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            } else if (post.isPublished) {
              statusText = t('admin.blog.published') || 'Published';
              statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            } else {
              statusText = t('admin.blog.draft') || 'Draft';
              statusClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            }

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${
                  selectedPosts.has(post.id) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                }`}
              >
                <div className="mb-3">
                  <button
                    onClick={() => handleToggleSelection(post.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    {selectedPosts.has(post.id) ? (
                      <FaCheckSquare size={20} className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FaSquare size={20} />
                    )}
                  </button>
                </div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  {renderActionsMenu(post)}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusClass}`}>
                    {statusText}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('admin.blog.table.views') || 'Views'}: <span className="font-medium">{post.views || 0}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogListAdmin;

