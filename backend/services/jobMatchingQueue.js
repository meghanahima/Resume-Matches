const Queue = require('bull');
const matchingQueue = new Queue('job-matching');

matchingQueue.process(async (job) => {
  // Process job matches in background
}); 