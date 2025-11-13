import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsChart: React.FC = () => {
  const { t } = useTranslation();

  // Mock data
  const data = [
    { name: 'Jan', views: 4000, posts: 2400 },
    { name: 'Feb', views: 3000, posts: 1398 },
    { name: 'Mar', views: 2000, posts: 9800 },
    { name: 'Apr', views: 2780, posts: 3908 },
    { name: 'May', views: 1890, posts: 4800 },
    { name: 'Jun', views: 2390, posts: 3800 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {t('admin.analytics.title') || 'Analytics Overview'}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="posts"
            stroke="#8b5cf6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AnalyticsChart;

