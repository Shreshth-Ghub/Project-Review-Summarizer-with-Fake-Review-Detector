import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon, FileText, Image as ImageIcon, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadAnalysis = ({ darkMode }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  // ADD: For image preview
  const [previewUrl, setPreviewUrl] = useState('');
  const [isImage, setIsImage] = useState(false);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    toast.success(`File ${uploadedFile.name} selected!`);
    // If the file is image, generate a temporary preview URL
    if (uploadedFile.type.startsWith('image/')) {
      setIsImage(true);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    } else {
      setIsImage(false);
      setPreviewUrl('');
    }
  };

  // Optional: Remove uploaded file and preview
  const handleRemove = () => {
    setFile(null);
    setPreviewUrl('');
    setIsImage(false);
  };

  const handleAnalyze = async () => {
    if (!file && !url) {
      toast.error('Please upload a file or enter a URL');
      return;
    }

    setUploading(true);
    toast.loading('Analyzing...', { id: 'analyze' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setResults({
        totalReviews: 150,
        fakeReviews: 45,
        genuineReviews: 105,
        fakePercentage: 30,
        avgRating: 4.2
      });

      toast.success('Analysis complete!', { id: 'analyze' });
    } catch (error) {
      toast.error('Analysis failed', { id: 'analyze' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Upload & Analyze
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a dataset or image and run analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Upload File
            </h2>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl p-8 text-center relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.json,.png,.jpg,.jpeg"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CSV, XLSX, JSON, PNG, JPG (MAX. 10MB)
                </p>
              </div>
            </label>
            {/* DRAG AND DROP FUNCTIONALITY can be added here */}
          </div>

          {/* FILE/IMAGE PREVIEW SECTION - THIS IS THE UPGRADE */}
          {file && (
            <div className="mt-4 relative p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex flex-col items-center justify-center">
              <div className="flex items-center space-x-3 mb-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.name}
                </span>
              </div>
              {isImage && (
                <div className="relative mt-2 mb-2">
                  <img
                    src={previewUrl}
                    alt="preview"
                    style={{
                      maxWidth: '370px',
                      maxHeight: '250px',
                      borderRadius: '12px',
                      border: '2px solid #3182ce',
                      boxShadow: '0 4px 20px 0 rgba(0,0,0,.18)'
                    }}
                    className="shadow-lg"
                  />
                  <button
                    onClick={handleRemove}
                    className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 hover:bg-red-600 transition-all shadow"
                    aria-label="Remove image"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* URL Scraping Section (unchanged) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <LinkIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Scrape URL
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://amazon.com/product/..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Supported platforms:</strong> Amazon, Flipkart, eBay, AliExpress
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyze}
        disabled={uploading || (!file && !url)}
        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Analyzing...' : 'Analyze Reviews'}
      </motion.button>

      {/* Results Section (unchanged) */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Analysis Results
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reviews</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.totalReviews}
              </div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Genuine</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.genuineReviews}
              </div>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fake</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.fakeReviews}
              </div>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fake %</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.fakePercentage}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadAnalysis;
