import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { blogService } from '../../../blog/services/blogService';
import { BlogPost } from '../../../blog/types/blog.types';
import {
  ToggleOffIcon,
  ToggleOnIcon,
  BookmarkIcon,
  CheckboxUncheckedIcon,
  CheckboxCheckedIcon,
  FavoriteIcon,
  EditIcon,
  DeleteIcon,
  ArchiveIcon,
  UnarchiveIcon,
  ShareIcon,
} from './BlogIcons';

interface BlogListAdminProps {
  searchQuery: string;
  onEdit: (postId: string) => void;
}

const BlogListAdmin: React.FC<BlogListAdminProps> = ({ searchQuery, onEdit }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      return blogService.updatePost(id, { 
        isPublished: !isPublished,
        ...(isPublished ? {} : { publishedAt: new Date().toISOString() })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: async ({ id, isBookmarked }: { id: string; isBookmarked: boolean }) => {
      return blogService.updatePost(id, { isBookmarked: !isBookmarked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorited }: { id: string; isFavorited: boolean }) => {
      return blogService.updatePost(id, { isFavorited: !isFavorited });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });

  const toggleArchiveMutation = useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      return blogService.updatePost(id, { isArchived: !isArchived });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
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
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts?.map((p) => p.id) || []));
    }
  };

  const handleEnterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedPosts(new Set());
  };

  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedPosts(new Set());
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Selection Mode Toolbar */}
      {isSelectionMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 flex items-center justify-between border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              title="Select All"
            >
              {selectedPosts.size === posts?.length ? (
                <CheckboxCheckedIcon size={20} />
              ) : (
                <CheckboxUncheckedIcon size={20} />
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

      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {isSelectionMode && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">
                {/* Checkbox column */}
              </th>
            )}
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
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedPosts.has(post.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              {isSelectionMode && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleSelection(post.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    {selectedPosts.has(post.id) ? (
                      <CheckboxCheckedIcon size={20} />
                    ) : (
                      <CheckboxUncheckedIcon size={20} />
                    )}
                  </button>
                </td>
              )}
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
                <div className="flex items-center gap-3">
                  {/* Toggle Publish/Unpublish */}
                  <button
                    onClick={() => handleTogglePublish(post)}
                    disabled={togglePublishMutation.isPending}
                    className={`p-2 rounded-lg transition-all ${
                      post.isPublished
                        ? 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${togglePublishMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={post.isPublished ? t('admin.blog.unpublish') || 'Unpublish' : t('admin.blog.publish') || 'Publish'}
                  >
                    {post.isPublished ? <ToggleOffIcon size={20} /> : <ToggleOnIcon size={20} />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(post.id)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all cursor-pointer"
                    title={t('admin.blog.editPost') || 'Edit Post'}
                  >
                    <EditIcon size={20} />
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={() => handleToggleBookmark(post)}
                    disabled={toggleBookmarkMutation.isPending}
                    className={`p-2 rounded-lg transition-all ${
                      post.isBookmarked
                        ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
                        : 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                    } ${toggleBookmarkMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={post.isBookmarked ? t('admin.blog.unbookmark') || 'Remove Bookmark' : t('admin.blog.bookmark') || 'Bookmark'}
                  >
                    <BookmarkIcon size={20} />
                  </button>

                  {/* Favorite */}
                  <button
                    onClick={() => handleToggleFavorite(post)}
                    disabled={toggleFavoriteMutation.isPending}
                    className={`p-2 rounded-lg transition-all ${
                      post.isFavorited
                        ? 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30'
                        : 'text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30'
                    } ${toggleFavoriteMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={post.isFavorited ? t('admin.blog.unfavorite') || 'Remove Favorite' : t('admin.blog.favorite') || 'Favorite'}
                  >
                    <FavoriteIcon size={20} />
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => handleShare(post)}
                    className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all cursor-pointer"
                    title={t('admin.blog.share') || 'Share'}
                  >
                    <ShareIcon size={20} />
                  </button>

                  {/* Archive/Unarchive */}
                  <button
                    onClick={() => handleToggleArchive(post)}
                    disabled={toggleArchiveMutation.isPending}
                    className={`p-2 rounded-lg transition-all ${
                      post.isArchived
                        ? 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
                        : 'text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                    } ${toggleArchiveMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={post.isArchived ? t('admin.blog.unarchive') || 'Unarchive' : t('admin.blog.archive') || 'Archive'}
                  >
                    {post.isArchived ? <UnarchiveIcon size={20} /> : <ArchiveIcon size={20} />}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all cursor-pointer"
                    title={t('admin.blog.delete') || 'Delete'}
                  >
                    <DeleteIcon size={20} />
                  </button>

                  {/* Enter Selection Mode (only show first time) */}
                  {!isSelectionMode && post === posts[0] && (
                    <button
                      onClick={handleEnterSelectionMode}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all cursor-pointer ml-2"
                      title={t('admin.blog.selectMultiple') || 'Select Multiple'}
                    >
                      <CheckboxUncheckedIcon size={20} />
                    </button>
                  )}
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

