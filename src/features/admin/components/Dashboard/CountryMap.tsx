import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../../../hooks/useDarkMode';
import { FaGlobe, FaUsers, FaEye, FaSync } from 'react-icons/fa';

interface CountryData {
  country: string;
  countryCode: string;
  visitors: number;
  pageViews: number;
  percentage: number;
}

// API endpoint for fetching analytics data
const API_ENDPOINT = import.meta.env.VITE_ANALYTICS_API_ENDPOINT || '/api/analytics/countries';

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  'TR': '🇹🇷',
  'US': '🇺🇸',
  'DE': '🇩🇪',
  'GB': '🇬🇧',
  'FR': '🇫🇷',
  'NL': '🇳🇱',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'CA': '🇨🇦',
  'AU': '🇦🇺',
  'JP': '🇯🇵',
  'CN': '🇨🇳',
  'BR': '🇧🇷',
  'IN': '🇮🇳',
  'RU': '🇷🇺',
};

const CountryMap: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from Google Analytics API
  const fetchCountryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setCountryData(result.data);
        if (result.lastUpdated) {
          setLastUpdated(new Date(result.lastUpdated));
        } else {
          setLastUpdated(new Date());
        }
      } else {
        throw new Error(result.error || 'Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics data');
      // Keep existing data if available, don't clear it on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountryData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchCountryData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const totalVisitors = countryData.reduce((sum, country) => sum + country.visitors, 0);
  const totalPageViews = countryData.reduce((sum, country) => sum + country.pageViews, 0);

  // Show error message if API call failed
  if (error && countryData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="text-center py-8">
          <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-2`}>
            {t('admin.analytics.error') || 'Veri yüklenirken bir hata oluştu'}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {error}
          </p>
          <button
            onClick={fetchCountryData}
            className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {t('admin.analytics.retry') || 'Tekrar Dene'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl shadow-lg p-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaGlobe className={`text-2xl ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <div>
            <h3 className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('admin.analytics.countries') || 'Ülke Dağılımı'}
            </h3>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t('admin.analytics.realTime') || 'Canlı Veriler'}
            </p>
          </div>
        </div>
        <button
          onClick={fetchCountryData}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={t('admin.analytics.refresh') || 'Yenile'}
        >
          <FaSync className={`${isLoading ? 'animate-spin' : ''}`} size={18} />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`rounded-lg p-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className={`text-sm ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('admin.analytics.visitors') || 'Ziyaretçiler'}
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {totalVisitors.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-lg p-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <FaEye className={`text-sm ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('admin.analytics.pageViews') || 'Sayfa Görüntülenmeleri'}
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {totalPageViews.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Country List */}
      <div className="space-y-3">
        <h4 className={`text-sm font-semibold mb-3 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('admin.analytics.topCountries') || 'En Çok Ziyaret Edilen Ülkeler'}
        </h4>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              isDarkMode ? 'border-blue-400' : 'border-blue-600'
            }`} />
          </div>
        ) : countryData.length === 0 ? (
          <div className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p>{t('admin.analytics.noData') || 'Veri bulunamadı'}</p>
          </div>
        ) : (
          countryData.map((country, index) => (
            <motion.div
              key={country.countryCode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-50 hover:bg-gray-100'
              } transition-colors`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">
                  {countryFlags[country.countryCode] || '🌍'}
                </span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {country.country}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {country.visitors.toLocaleString()} {t('admin.analytics.visitors') || 'ziyaretçi'}
                    </span>
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {country.pageViews.toLocaleString()} {t('admin.analytics.pageViews') || 'görüntülenme'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold w-12 text-right ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {country.percentage}%
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Last Updated */}
      <div className={`mt-4 pt-4 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <p className={`text-xs text-center ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {t('admin.analytics.lastUpdated') || 'Son Güncelleme'}: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

export default CountryMap;

