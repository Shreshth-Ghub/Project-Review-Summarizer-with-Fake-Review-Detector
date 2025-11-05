import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Package, Users, BarChart } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBar, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = ({ darkMode }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load statistics');
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    toast.loading('Analyzing reviews...', { id: 'analyze' });
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        product_name: selectedProduct
      });
      setAnalysisData(response.data.data);
      toast.success('Analysis complete!', { id: 'analyze' });
    } catch (error) {
      toast.error('Analysis failed', { id: 'analyze' });
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, trend, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg hover:shadow-2xl transition-all"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-semibold">{change}</span>
            </div>
          )}
        </div>

        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Real-time analytics and fake review detection insights
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Export Report
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Package}
            label="Total Reviews"
            value={stats.total_reviews.toLocaleString()}
            change="+12%"
            trend="up"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Genuine Reviews"
            value={stats.genuine_reviews.toLocaleString()}
            change="+8%"
            trend="up"
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={AlertCircle}
            label="Fake Reviews"
            value={stats.fake_reviews.toLocaleString()}
            change="-5%"
            trend="down"
            color="from-red-500 to-red-600"
          />
          <StatCard
            icon={BarChart}
            label="Fake Percentage"
            value={`${stats.fake_percentage.toFixed(1)}%`}
            color="from-orange-500 to-orange-600"
          />
        </div>
      )}

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Product Analysis
          </h2>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product...</option>
            {products.map((product, index) => (
              <option key={index} value={product}>{product}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Analyze Reviews
          </motion.button>

          {analysisData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.fake_stats.total_reviews}
                  </div>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Genuine</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.fake_stats.genuine_reviews}
                  </div>
                </div>
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fake Reviews</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.fake_stats.fake_reviews}
                  </div>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.fake_stats.avg_rating.toFixed(1)} ⭐
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Summary</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {analysisData.summary.summary_text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-md font-semibold text-green-600 dark:text-green-400 mb-2">Pros</h4>
                  <ul className="space-y-2">
                    {analysisData.summary.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-red-600 dark:text-red-400 mb-2">Cons</h4>
                  <ul className="space-y-2">
                    {analysisData.summary.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all text-left">
              <div className="flex items-center space-x-3">
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
              </div>
            </button>

            <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:shadow-lg transition-all text-left">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5" />
                <span>Scrape URL</span>
              </div>
            </button>

            <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>Detect Fake Review</span>
              </div>
            </button>
          </div>

          <div className="mt-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white">Active Users</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">1,234</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">+15% from last month</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
