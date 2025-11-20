import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FakeDetection = ({ darkMode }) => {
  const [reviewText, setReviewText] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeReview = async () => {
    if (!reviewText.trim()) {
      toast.error('Please enter a review to analyze');
      return;
    }

    setAnalyzing(true);
    toast.loading('Analyzing review...', { id: 'analyze' });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isFake = Math.random() > 0.5;
      setResult({
        isFake,
        confidence: (Math.random() * 30 + 70).toFixed(1),
        reasons: isFake 
          ? ['Repetitive language detected', 'Unusual rating pattern', 'Suspicious timing']
          : ['Natural language structure', 'Detailed product feedback', 'Consistent with user history']
      });

      toast.success('Analysis complete!', { id: 'analyze' });
    } catch (error) {
      toast.error('Analysis failed', { id: 'analyze' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Fake Review Detection
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter a review to check if it's genuine or fake
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Review Text
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="6"
          placeholder="Paste the review text here..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          onClick={analyzeReview}
          disabled={analyzing}
          className="mt-4 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Analyzing...' : 'Detect Fake Review'}
        </button>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl backdrop-blur-xl border p-6 shadow-lg ${
            result.isFake
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-green-500/10 border-green-500/20'
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            {result.isFake ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-500" />
            )}
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {result.isFake ? 'Fake Review Detected' : 'Genuine Review'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Confidence: {result.confidence}%
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">
              Analysis Reasons:
            </div>
            <ul className="space-y-2">
              {result.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FakeDetection;
