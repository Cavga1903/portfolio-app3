import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { 
  FaUsers, 
  FaBlog, 
  FaChartLine, 
  FaEye,
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaProjectDiagram,
  FaTags,
  FaEyeSlash,
  FaHeart,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaGithub,
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle,
  FaTh,
  FaList
} from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../../components/Navbar';
import { LoginModal, SignupModal } from '../../features/auth';
import { useAuthStore } from '../../app/store/authStore';
import { blogService } from '../../features/blog/services/blogService';
import { BlogPost } from '../../features/blog/types/blog.types';
import { useUIStore } from '../../app/store/uiStore';
import { useDarkMode } from '../../hooks/useDarkMode';
import Toast from '../../components/Toast';

// Dashboard components
const StatsCards = React.lazy(() => import('../../features/admin/components/Dashboard/StatsCards'));
const AnalyticsChart = React.lazy(() => import('../../features/admin/components/Dashboard/AnalyticsChart'));
const RecentActivity = React.lazy(() => import('../../features/admin/components/Dashboard/RecentActivity'));

// Blog management components
const BlogListAdmin = React.lazy(() => import('../../features/admin/components/BlogManagement/BlogListAdmin'));
const BlogEditorAdmin = React.lazy(() => import('../../features/admin/components/BlogManagement/BlogEditorAdmin'));

type TabType = 'overview' | 'blog' | 'projects' | 'categories';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  views?: number;
  likes?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  rows: number;
  postCount?: number;
  projectCount?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Portfolio Website',
      description: 'Modern portfolio website built with React and TypeScript',
      image: 'https://via.placeholder.com/400x300',
      githubUrl: 'https://github.com/example/portfolio',
      liveUrl: 'https://example.com',
      technologies: ['React', 'TypeScript', 'TailwindCSS'],
      category: 'Web Development',
      isPublished: true,
      createdAt: new Date().toISOString(),
      views: 1200,
      likes: 45
    },
    {
      id: '2',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      image: 'https://via.placeholder.com/400x300',
      githubUrl: 'https://github.com/example/ecommerce',
      technologies: ['React', 'Node.js', 'MongoDB'],
      category: 'Web Development',
      isPublished: true,
      createdAt: new Date().toISOString(),
      views: 850,
      likes: 32
    }
  ]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Tutorials', slug: 'tutorials', description: 'Eğitim içerikleri', color: '#3B82F6', rows: 5, postCount: 12, projectCount: 0, isActive: true },
    { id: '2', name: 'Articles', slug: 'articles', description: 'Makale içerikleri', color: '#10B981', rows: 3, postCount: 8, projectCount: 0, isActive: true },
    { id: '3', name: 'News', slug: 'news', description: 'Haber içerikleri', color: '#F59E0B', rows: 4, postCount: 5, projectCount: 0, isActive: true },
  ]);
  const [editingCategories, setEditingCategories] = useState<{ [key: string]: Partial<Category> }>({});
  const [openCategoryAccordions, setOpenCategoryAccordions] = useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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
    const tab = searchParams.get('tab') as TabType;
    if (tab) setActiveTab(tab);
    if (editId) {
      setEditingPost(editId);
      setShowEditor(true);
      setActiveTab('blog');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleCreate = () => {
    setEditingPost(null);
    setShowEditor(true);
    setActiveTab('blog');
  };

  const handleEdit = (postId: string) => {
    setEditingPost(postId);
    setShowEditor(true);
    setActiveTab('blog');
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleCreateProject = () => {
    setEditingProject({
      id: '',
      title: '',
      description: '',
      technologies: [],
      category: '',
      isPublished: false,
      createdAt: new Date().toISOString()
    });
    setActiveTab('projects');
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setActiveTab('projects');
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    
    if (editingProject.id) {
      // Update existing project
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id ? { ...editingProject, updatedAt: new Date().toISOString() } : p
      ));
      addToast({
        message: t('admin.projects.updateSuccess') || 'Proje güncellendi',
        type: 'success',
      });
    } else {
      // Create new project
      const newProject: Project = {
        ...editingProject,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setProjects(prev => [...prev, newProject]);
      addToast({
        message: t('admin.projects.createSuccess') || 'Proje oluşturuldu',
        type: 'success',
      });
    }
    setEditingProject(null);
  };

  // Fetch blog statistics
  const { data: blogStats, isLoading: statsLoading } = useQuery({
    queryKey: ['blogStats'],
    queryFn: () => blogService.getStats(),
  });

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
      
      const firebaseError = error as { code?: string; message?: string; stack?: string };
      if (firebaseError?.code === 'permission-denied' || firebaseError?.message?.includes('permission')) {
        errorMessage = 'İzin hatası: Firebase security rules kontrol edin. Kullanıcınızın admin rolü olduğundan emin olun.';
      }
      
      addToast({
        message: errorMessage,
        type: 'error',
      });
    },
  });

  const handleBulkAction = (action: string, type: 'blog' | 'project' = 'blog') => {
    if (type === 'blog') {
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
            if (postIds.length > 0) publishMutation.mutate(postIds);
            break;
          case 'unpublish':
            if (postIds.length > 0) unpublishMutation.mutate(postIds);
            break;
          case 'archive':
            if (postIds.length > 0) archiveMutation.mutate(postIds);
            break;
          case 'bookmark':
            if (postIds.length > 0) {
              const allPosts = queryClient.getQueryData<BlogPost[]>(['blogPosts', 'admin']) || [];
              const selectedPostsData = allPosts.filter(p => postIds.includes(p.id));
              const allBookmarked = selectedPostsData.length > 0 && selectedPostsData.every(p => p.isBookmarked);
              bookmarkMutation.mutate({ postIds, toggle: !allBookmarked });
            }
            break;
          case 'favorite':
            if (postIds.length > 0) {
              const allPosts = queryClient.getQueryData<BlogPost[]>(['blogPosts', 'admin']) || [];
              const selectedPostsData = allPosts.filter(p => postIds.includes(p.id));
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
            if (postIds.length === 1) {
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
              }
            }
            break;
        }
      } catch (error) {
        console.error('Error in handleBulkAction:', error);
        addToast({
          message: t('admin.blog.actionError') || 'Bir hata oluştu. Lütfen tekrar deneyin.',
          type: 'error',
        });
      }
    } else if (type === 'project') {
      const projectIds = Array.from(selectedProjects);
      
      if (projectIds.length === 0) {
        addToast({
          message: t('admin.projects.noSelection') || 'Lütfen en az bir proje seçin',
          type: 'info',
        });
        return;
      }

      switch (action) {
        case 'delete':
          if (window.confirm(t('admin.projects.deleteConfirm', { count: projectIds.length }) || `${projectIds.length} projeyi silmek istediğinize emin misiniz?`)) {
            setProjects(prev => prev.filter(p => !projectIds.includes(p.id)));
            setSelectedProjects(new Set());
            addToast({
              message: t('admin.projects.deleteSuccess', { count: projectIds.length }) || `${projectIds.length} proje silindi`,
              type: 'success',
            });
          }
          break;
        case 'publish':
          setProjects(prev => prev.map(p => 
            projectIds.includes(p.id) ? { ...p, isPublished: true, updatedAt: new Date().toISOString() } : p
          ));
          setSelectedProjects(new Set());
          addToast({
            message: t('admin.projects.publishSuccess', { count: projectIds.length }) || `${projectIds.length} proje yayınlandı`,
            type: 'success',
          });
          break;
        case 'unpublish':
          setProjects(prev => prev.map(p => 
            projectIds.includes(p.id) ? { ...p, isPublished: false, updatedAt: new Date().toISOString() } : p
          ));
          setSelectedProjects(new Set());
          addToast({
            message: t('admin.projects.unpublishSuccess', { count: projectIds.length }) || `${projectIds.length} proje yayından kaldırıldı`,
            type: 'success',
          });
          break;
      }
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

  const stats = [
    {
      title: t('admin.stats.totalUsers') || 'Total Users',
      value: '1,234',
      change: '+12%',
      trend: 'up' as const,
      icon: FaUsers,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('admin.stats.totalPosts') || 'Total Posts',
      value: statsLoading ? '...' : String(blogStats?.totalPosts || 0),
      change: blogStats?.publishedPosts ? `${blogStats.publishedPosts} published` : '0',
      trend: 'up' as const,
      icon: FaBlog,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: t('admin.stats.totalViews') || 'Total Views',
      value: statsLoading ? '...' : blogStats?.totalViews ? `${(blogStats.totalViews / 1000).toFixed(1)}K` : '0',
      change: blogStats?.draftPosts ? `${blogStats.draftPosts} drafts` : '0',
      trend: 'up' as const,
      icon: FaEye,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: t('admin.stats.growth') || 'Published Rate',
      value: statsLoading ? '...' : blogStats?.totalPosts 
        ? `${Math.round((blogStats.publishedPosts / blogStats.totalPosts) * 100)}%`
        : '0%',
      change: blogStats?.draftPosts ? `${blogStats.draftPosts} drafts` : '0',
      trend: 'up' as const,
      icon: FaChartLine,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const filteredProjects = projects.filter(p => 
    projectSearchQuery === '' || 
    p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    p.technologies.some(t => t.toLowerCase().includes(projectSearchQuery.toLowerCase()))
  );

  const filteredCategories = categories.filter(c => 
    categorySearchQuery === '' || 
    c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

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
                {t('admin.dashboard.subtitle') || 'Manage your content'}, {user?.name}
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
                title={t('admin.actions.create') || 'İşlemler'}
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
                          handleCreateProject();
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
                          setActiveTab('categories');
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
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col min-h-0 max-w-7xl w-full">
        {/* Tabs Navigation */}
        <div className={`mb-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <nav className="flex space-x-8 overflow-x-auto">
            {(['overview', 'blog', 'projects', 'categories'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? isDarkMode
                      ? 'border-blue-400 text-blue-400'
                      : 'border-blue-600 text-blue-600'
                    : isDarkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && (t('admin.tabs.overview') || 'Genel Bakış')}
                {tab === 'blog' && (t('admin.tabs.blog') || 'Blog Yönetimi')}
                {tab === 'projects' && (t('admin.tabs.projects') || 'Proje Yönetimi')}
                {tab === 'categories' && (t('admin.tabs.categories') || 'Kategori Yönetimi')}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <React.Suspense fallback={<div className={`animate-pulse h-32 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} />}>
                <StatsCards stats={stats} />
              </React.Suspense>

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <React.Suspense fallback={<div className={`animate-pulse h-96 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />}>
                    <AnalyticsChart />
                  </React.Suspense>
                </div>
                <div>
                  <React.Suspense fallback={<div className={`animate-pulse h-96 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />}>
                    <RecentActivity />
                  </React.Suspense>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Blog Management Header */}
              <div className={`rounded-lg border shadow-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`px-6 py-4 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBulkAction('publish', 'blog')}
                        disabled={selectedPosts.size === 0}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          selectedPosts.size === 0
                            ? isDarkMode
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        <FaEye size={14} />
                        <span>{t('admin.blog.publish') || 'Yayınla'}</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('unpublish', 'blog')}
                        disabled={selectedPosts.size === 0}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          selectedPosts.size === 0
                            ? isDarkMode
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-gray-600 hover:bg-gray-700 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                        }`}
                      >
                        <FaEyeSlash size={14} />
                        <span>{t('admin.blog.unpublish') || 'Yayından Kaldır'}</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete', 'blog')}
                        disabled={selectedPosts.size === 0}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          selectedPosts.size === 0
                            ? isDarkMode
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        <FaTrash size={14} />
                        <span>{t('admin.blog.delete') || 'Sil'}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-4 pt-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="text"
                      value={blogSearchQuery}
                      onChange={(e) => setBlogSearchQuery(e.target.value)}
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
                        searchQuery={blogSearchQuery}
                        onEdit={handleEdit}
                        onSelectedPostsChange={handleSelectedPostsChange}
                      />
                    </React.Suspense>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Project Management Header */}
              <div className={`rounded-lg border shadow-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`px-6 py-4 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FaProjectDiagram className={`text-xl ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                      <span className={`font-semibold text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t('admin.projects.title') || 'Proje Yönetimi'}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {projects.length} {t('admin.projects.total') || 'proje'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {viewMode === 'grid' ? <FaList size={18} /> : <FaTh size={18} />}
                      </button>
                      <button
                        onClick={() => handleBulkAction('publish', 'project')}
                        disabled={selectedProjects.size === 0}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          selectedProjects.size === 0
                            ? isDarkMode
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        <FaEye size={14} />
                        <span>{t('admin.projects.publish') || 'Yayınla'}</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete', 'project')}
                        disabled={selectedProjects.size === 0}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          selectedProjects.size === 0
                            ? isDarkMode
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        <FaTrash size={14} />
                        <span>{t('admin.projects.delete') || 'Sil'}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-4 pt-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="text"
                      value={projectSearchQuery}
                      onChange={(e) => setProjectSearchQuery(e.target.value)}
                      placeholder={t('admin.projects.search') || 'Proje ara...'}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Project Editor */}
                  {editingProject && (
                    <div className={`rounded-lg border p-6 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {editingProject.id ? t('admin.projects.edit') || 'Proje Düzenle' : t('admin.projects.create') || 'Yeni Proje Oluştur'}
                        </h3>
                        <button
                          onClick={() => setEditingProject(null)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FaTimes size={18} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {t('admin.projects.title') || 'Başlık'} *
                          </label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder={t('admin.projects.titlePlaceholder') || 'Proje başlığı'}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {t('admin.projects.description') || 'Açıklama'} *
                          </label>
                          <textarea
                            value={editingProject.description}
                            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                            rows={4}
                            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder={t('admin.projects.descriptionPlaceholder') || 'Proje açıklaması'}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {t('admin.projects.githubUrl') || 'GitHub URL'}
                            </label>
                            <input
                              type="url"
                              value={editingProject.githubUrl || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              placeholder="https://github.com/..."
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {t('admin.projects.liveUrl') || 'Canlı URL'}
                            </label>
                            <input
                              type="url"
                              value={editingProject.liveUrl || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {t('admin.projects.technologies') || 'Teknolojiler'} (virgülle ayırın)
                          </label>
                          <input
                            type="text"
                            value={editingProject.technologies.join(', ')}
                            onChange={(e) => setEditingProject({ 
                              ...editingProject, 
                              technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                            })}
                            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="React, TypeScript, TailwindCSS"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingProject.isPublished}
                              onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {t('admin.projects.published') || 'Yayınlandı'}
                            </span>
                          </label>
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                          <button
                            onClick={() => setEditingProject(null)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {t('admin.projects.cancel') || 'İptal'}
                          </button>
                          <button
                            onClick={handleSaveProject}
                            disabled={!editingProject.title || !editingProject.description}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                              !editingProject.title || !editingProject.description
                                ? isDarkMode
                                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            <FaSave size={16} />
                            <span>{t('admin.projects.save') || 'Kaydet'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Projects List */}
                  {!editingProject && (
                    <div className={viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-4'
                    }>
                      {filteredProjects.length === 0 ? (
                        <div className={`col-span-full rounded-lg p-12 text-center ${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {projectSearchQuery 
                              ? t('admin.projects.noResults') || 'Arama sonucu bulunamadı'
                              : t('admin.projects.noProjects') || 'Henüz proje yok'
                            }
                          </p>
                        </div>
                      ) : (
                        filteredProjects.map((project) => (
                          <div
                            key={project.id}
                            className={`rounded-lg border p-4 transition-all ${
                              isDarkMode
                                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedProjects.has(project.id)}
                                  onChange={(e) => {
                                    const newSet = new Set(selectedProjects);
                                    if (e.target.checked) {
                                      newSet.add(project.id);
                                    } else {
                                      newSet.delete(project.id);
                                    }
                                    setSelectedProjects(newSet);
                                  }}
                                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <h3 className={`font-semibold ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {project.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                {project.isPublished ? (
                                  <FaCheckCircle className="text-green-500" size={16} />
                                ) : (
                                  <FaTimesCircle className="text-gray-400" size={16} />
                                )}
                                <button
                                  onClick={() => handleEditProject(project)}
                                  className={`p-1.5 rounded transition-colors ${
                                    isDarkMode
                                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                                      : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  <FaEdit size={14} />
                                </button>
                              </div>
                            </div>
                            <p className={`text-sm mb-3 line-clamp-2 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.technologies.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className={`text-xs px-2 py-1 rounded ${
                                    isDarkMode
                                      ? 'bg-gray-700 text-gray-300'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 3 && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  isDarkMode
                                    ? 'bg-gray-700 text-gray-300'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-4">
                                {project.githubUrl && (
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-1 ${
                                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                                    }`}
                                  >
                                    <FaGithub size={12} />
                                    <span>GitHub</span>
                                  </a>
                                )}
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-1 ${
                                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                                    }`}
                                  >
                                    <FaGlobe size={12} />
                                    <span>Live</span>
                                  </a>
                                )}
                              </div>
                              <div className={`flex items-center gap-2 ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {project.views && (
                                  <span className="flex items-center gap-1">
                                    <FaEye size={10} />
                                    {project.views}
                                  </span>
                                )}
                                {project.likes && (
                                  <span className="flex items-center gap-1">
                                    <FaHeart size={10} />
                                    {project.likes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Category Management Header */}
              <div ref={categoryManagementRef} className={`rounded-lg border shadow-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`px-6 py-4 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FaTags className={`text-xl ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`font-semibold text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t('admin.categories.title') || 'Kategori Yönetimi'}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {categories.length} {t('admin.categories.total') || 'kategori'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const newId = Date.now().toString();
                        const newCategory: Category = { 
                          id: newId, 
                          name: 'Yeni Kategori', 
                          slug: 'yeni-kategori',
                          rows: 5, 
                          description: '', 
                          color: '#10B981',
                          postCount: 0,
                          projectCount: 0,
                          isActive: true 
                        };
                        setCategories(prev => [...prev, newCategory]);
                        setOpenCategoryAccordions(prev => ({ ...prev, [newId]: true }));
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaPlus size={16} />
                      <span>{t('admin.categories.addNew') || 'Yeni Kategori Ekle'}</span>
                    </button>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-4 pt-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="text"
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      placeholder={t('admin.categories.search') || 'Kategori ara...'}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  {/* Category List */}
                  <div className="space-y-3">
                    {filteredCategories.length === 0 ? (
                      <div className={`rounded-lg p-12 text-center ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      }`}>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {categorySearchQuery 
                            ? t('admin.categories.noResults') || 'Arama sonucu bulunamadı'
                            : t('admin.categories.noCategories') || 'Henüz kategori yok'
                          }
                        </p>
                      </div>
                    ) : (
                      filteredCategories.map((category) => {
                        const isOpen = openCategoryAccordions[category.id] || false;
                        const editing = editingCategories[category.id] || { 
                          name: category.name, 
                          slug: category.slug,
                          rows: category.rows,
                          description: category.description || '',
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
                                {category.postCount !== undefined && category.postCount > 0 && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isDarkMode
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {category.postCount} post
                                  </span>
                                )}
                                {category.projectCount !== undefined && category.projectCount > 0 && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isDarkMode
                                      ? 'bg-purple-900/30 text-purple-400'
                                      : 'bg-purple-100 text-purple-600'
                                  }`}>
                                    {category.projectCount} proje
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
                                        {t('admin.categories.name') || 'Kategori Adı'} *
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
                                                slug: category.slug,
                                                rows: category.rows,
                                                description: category.description || '',
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
                                        {t('admin.categories.slug') || 'URL Slug'} *
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
                                                slug: category.slug,
                                                rows: category.rows,
                                                description: category.description || '',
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
                                                slug: category.slug,
                                                rows: category.rows,
                                                description: category.description || '',
                                                color: category.color || '#10B981',
                                                isActive: category.isActive !== false
                                              }, 
                                              description: e.target.value 
                                            }
                                          }));
                                        }}
                                        rows={3}
                                        className={`w-full px-4 py-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        placeholder={t('admin.categories.descriptionPlaceholder') || 'Kategori açıklaması'}
                                      />
                                    </div>
                                    {/* Color and Rows Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                      {/* Category Color Input */}
                                      <div>
                                        <label className={`block text-base font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          {t('admin.categories.color') || 'Renk'} *
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
                                                    slug: category.slug,
                                                    rows: category.rows,
                                                    description: category.description || '',
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
                                                    slug: category.slug,
                                                    rows: category.rows,
                                                    description: category.description || '',
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
                                          {t('admin.categories.rows') || 'Satır Sayısı'} *
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
                                                  slug: category.slug,
                                                  rows: category.rows,
                                                  description: category.description || '',
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
                                                  slug: category.slug,
                                                  rows: category.rows,
                                                  description: category.description || '',
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
                                            if (!editing.name || !editing.slug) {
                                              addToast({
                                                message: t('admin.categories.validationError') || 'Lütfen kategori adı ve slug girin',
                                                type: 'error',
                                              });
                                              return;
                                            }
                                            setCategories(prev => prev.map(cat => 
                                              cat.id === category.id 
                                                ? { 
                                                    ...cat, 
                                                    name: editing.name!, 
                                                    slug: editing.slug!,
                                                    rows: editing.rows!,
                                                    description: editing.description,
                                                    color: editing.color!,
                                                    isActive: editing.isActive !== false,
                                                    updatedAt: new Date().toISOString()
                                                  }
                                                : cat
                                            ));
                                            setEditingCategories(prev => {
                                              const newState = { ...prev };
                                              delete newState[category.id];
                                              return newState;
                                            });
                                            addToast({
                                              message: t('admin.categories.updateSuccess') || 'Kategori güncellendi',
                                              type: 'success',
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
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

export default AdminDashboard;
