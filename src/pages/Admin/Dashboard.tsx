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
import Navbar from '../../components/Navbar';
import { LoginModal, SignupModal } from '../../features/auth';
import { useAuthStore } from '../../app/store/authStore';
import { blogService } from '../../features/blog/services/blogService';

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

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
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
            transition={{ delay: 0.3 }}
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

