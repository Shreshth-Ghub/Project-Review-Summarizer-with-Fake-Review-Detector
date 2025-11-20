import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Analytics = ({ darkMode }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Charts and deeper analytics will appear here.
        </p>
      </motion.div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.total_reviews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Reviews Analyzed
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.genuine_reviews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Genuine Reviews
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.fake_reviews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Fake Reviews Detected
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.fake_percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Detection Accuracy
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Trend Analysis
        </h2>
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-blue-500/20 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Advanced charts and visualizations coming soon
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
