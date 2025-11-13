import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaBlog, FaUser, FaEdit } from 'react-icons/fa';

const RecentActivity: React.FC = () => {
  const { t } = useTranslation();

  const activities = [
    {
      id: '1',
      type: 'post',
      action: 'created',
      title: 'New blog post published',
      time: '2 hours ago',
      icon: FaBlog,
      color: 'text-blue-500',
    },
    {
      id: '2',
      type: 'user',
      action: 'registered',
      title: 'New user registered',
      time: '5 hours ago',
      icon: FaUser,
      color: 'text-green-500',
    },
    {
      id: '3',
      type: 'post',
      action: 'updated',
      title: 'Blog post updated',
      time: '1 day ago',
      icon: FaEdit,
      color: 'text-purple-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {t('admin.activity.title') || 'Recent Activity'}
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
                <Icon />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivity;

