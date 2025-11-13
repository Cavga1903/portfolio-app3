import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBlog, 
  FaChartLine, 
  FaEye,
  FaPlus
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import Navbar from '../../components/Navbar';
import { LoginModal, SignupModal } from '../../features/auth';
import { useAuthStore } from '../../app/store/authStore';
import { blogService } from '../../features/blog/services/blogService';
import { BlogPost } from '../../features/blog/types/blog.types';

// Dashboard components
const StatsCards = React.lazy(() => import('../../features/admin/components/Dashboard/StatsCards'));
const AnalyticsChart = React.lazy(() => import('../../features/admin/components/Dashboard/AnalyticsChart'));
const RecentActivity = React.lazy(() => import('../../features/admin/components/Dashboard/RecentActivity'));

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Fetch blog statistics
  const { data: blogStats, isLoading: statsLoading } = useQuery({
    queryKey: ['blogStats'],
    queryFn: () => blogService.getStats(),
  });

  // Fetch recent blog posts (all posts, not just published)
  const { data: recentPosts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ['adminBlogPosts'],
    queryFn: async () => {
      // Get all posts (including drafts) for admin
      const postsRef = collection(db, 'blogPosts');
      const q = query(postsRef, orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const posts: BlogPost[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        posts.push({
          id: docSnapshot.id,
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          author: data.author || { id: '1', name: 'Unknown' },
          publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          tags: data.tags || [],
          category: data.category,
          image: data.image,
          views: data.views || 0,
          likes: data.likes || 0,
          isPublished: data.isPublished ?? false,
        });
      });
      return posts.slice(0, 5); // Get latest 5 posts
    },
  });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('admin.dashboard.title') || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('admin.dashboard.welcome') || 'Welcome back'}, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/blog')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <FaPlus />
                <span>{t('admin.blog.manage') || 'Manage Blog'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <React.Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />}>
            <StatsCards stats={stats} />
          </React.Suspense>
        </motion.div>

        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('admin.dashboard.recentPosts') || 'Recent Blog Posts'}
              </h2>
              <button
                onClick={() => navigate('/admin/blog')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('admin.dashboard.viewAll') || 'View All'}
              </button>
            </div>
            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded-lg" />
                ))}
              </div>
            ) : recentPosts && recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/admin/blog?edit=${post.id}`)}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          post.isPublished
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {post.isPublished
                          ? t('admin.dashboard.published') || 'Published'
                          : t('admin.dashboard.draft') || 'Draft'}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>{t('admin.dashboard.noPosts') || 'No blog posts yet'}</p>
                <button
                  onClick={() => navigate('/admin/blog')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t('admin.dashboard.createFirst') || 'Create Your First Post'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <React.Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg" />}>
              <AnalyticsChart />
            </React.Suspense>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <React.Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg" />}>
              <RecentActivity />
            </React.Suspense>
          </motion.div>
        </div>
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
    </div>
  );
};

export default AdminDashboard;

