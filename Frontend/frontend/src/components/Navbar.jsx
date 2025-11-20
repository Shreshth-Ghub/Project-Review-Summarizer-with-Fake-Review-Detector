import { Search, Moon, Sun, Menu, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border-b border-gray-200 dark:border-dark-border"
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <div className="flex items-center space-x-3">
              {/* Modern Logo */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 40 40" className="w-6 h-6">
                  {/* Shield shape */}
                  <path
                    d="M20 4 L32 8 L32 18 Q32 28 20 36 Q8 28 8 18 L8 8 Z"
                    fill="white"
                    opacity="0.95"
                  />
                  {/* Check mark */}
                  <path
                    d="M16 20 L19 23 L26 14"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Star sparkle */}
                  <circle cx="28" cy="11" r="1.5" fill="white" />
                  <circle cx="12" cy="14" r="1" fill="white" opacity="0.7" />
                </svg>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 blur-md opacity-40"></div>
              </div>
              
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Smart Review Analyzer
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI-Powered Fake Detection
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, reviews, or analytics..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
