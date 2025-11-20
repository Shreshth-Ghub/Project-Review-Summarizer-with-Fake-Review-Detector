import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

const Reports = ({ darkMode }) => {
  const reports = [
    { name: 'Monthly Analysis Report', date: '2025-11-01', size: '2.4 MB' },
    { name: 'Fake Review Detection Summary', date: '2025-10-15', size: '1.8 MB' },
    { name: 'Product Analysis Report', date: '2025-10-01', size: '3.2 MB' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Download and view generated reports
        </p>
      </motion.div>

      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {report.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {report.date} • {report.size}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
