const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 3600, // 1 hour default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
});

// Add helper methods
const cacheService = {
  // Get cache with key prefix
  getAnalyzedJobs: (resumeId) => {
    return cache.get(`analyzed_jobs_${resumeId}`);
  },

  // Set cache with key prefix
  setAnalyzedJobs: (resumeId, data) => {
    return cache.set(`analyzed_jobs_${resumeId}`, data, 3600);
  },

  // Invalidate cache when jobs are updated
  invalidateAnalysis: (resumeId) => {
    cache.del(`analyzed_jobs_${resumeId}`);
  },

  clearAllResumeData: () => {
    const keys = cache.keys();
    keys.forEach((key) => {
      if (key.startsWith("analyzed_jobs_")){
        cache.del(key);
      }
    })
  },

  // Clear all analysis caches
  // clearAllAnalysis: () => {
  //   const keys = cache.keys();
  //   const analysisKeys = keys.filter((key) => key.startsWith("analyzed_jobs_"));
  //   analysisKeys.forEach((key) => cache.del(key));
  // },
};

module.exports = cacheService;
