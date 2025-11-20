import { Home, BarChart3, Upload, Settings, TrendingUp, Shield, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ open, darkMode }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'text-blue-500' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', color: 'text-purple-500' },
    { icon: Upload, label: 'Upload & Analyze', path: '/upload', color: 'text-green-500' },
    { icon: Shield, label: 'Fake Detection', path: '/detection', color: 'text-red-500' },
    { icon: FileText, label: 'Reports', path: '/reports', color: 'text-orange-500' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-500' },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: open ? 256 : 80 }}
      className="fixed left-0 top-16 bottom-0 backdrop-blur-lg bg-white/90 dark:bg-dark-card/90 border-r border-gray-200 dark:border-dark-border z-40 transition-all duration-300"
    >
      <div className="h-full flex flex-col py-6">
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                }`
              }
            >
              <item.icon className={`w-5 h-5 ${open ? '' : 'mx-auto'} ${item.color}`} />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-medium text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Stats Section */}
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 pb-4"
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Model Accuracy
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                95.3%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Fake detection rate
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
