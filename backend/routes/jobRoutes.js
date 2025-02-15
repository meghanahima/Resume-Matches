// When a job is updated
router.put("/update-job/:jobId", async (req, res) => {
  try {
    // Update job logic...
    
    // Clear all analysis caches since job data changed
    cacheService.clearAllAnalysis();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 