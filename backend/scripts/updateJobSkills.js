const mongoose = require('mongoose');
const JobDescription = require('../schema/jobDescriptionModel');
require('dotenv').config();

async function updateJobSkills() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const batch = 1000; // Process in batches
    let processed = 0;
    
    // Get total count
    const total = await JobDescription.countDocuments();
    console.log(`Found ${total} jobs to update`);

    while (processed < total) {
      const jobs = await JobDescription.find({})
        .skip(processed)
        .limit(batch);

      for (const job of jobs) {
        if (typeof job.skills === 'string') {
          job.skills = job.skills
            .split(/[,;()]/)
            .map(skill => skill
              .replace(/e\.g\.|and|or/gi, '')
              .trim()
              .toLowerCase()
            )
            .filter(skill => skill.length > 0);
          
          await job.save();
        }
        processed++;
        
        if (processed % 100 === 0) {
          console.log(`Processed ${processed}/${total} jobs`);
        }
      }
    }

    console.log('Finished updating jobs');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateJobSkills(); 