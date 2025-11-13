import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaUsers, 
  FaBlog, 
  FaChartLine, 
  FaEye
} from 'react-icons/fa';
import { useAuthStore } from '../../app/store/authStore';

// Dashboard components
const StatsCards = React.lazy(() => import('../../features/admin/components/Dashboard/StatsCards'));
const AnalyticsChart = React.lazy(() => import('../../features/admin/components/Dashboard/AnalyticsChart'));
const RecentActivity = React.lazy(() => import('../../features/admin/components/Dashboard/RecentActivity'));

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

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
      value: '89',
      change: '+5%',
      trend: 'up' as const,
      icon: FaBlog,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: t('admin.stats.totalViews') || 'Total Views',
      value: '45.6K',
      change: '+23%',
      trend: 'up' as const,
      icon: FaEye,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: t('admin.stats.growth') || 'Growth Rate',
      value: '18.2%',
      change: '-2%',
      trend: 'down' as const,
      icon: FaChartLine,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
    </div>
  );
};

export default AdminDashboard;

