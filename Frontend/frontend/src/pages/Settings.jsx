import { motion } from 'framer-motion';

const Settings = ({ darkMode }) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Application and model settings will be configurable here.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Model Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detection Threshold
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="75"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model Version
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>v1.0.0 (Current)</option>
              <option>v0.9.5</option>
              <option>v0.9.0</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
