const elasticlunr = require('elasticlunr');

function createJobIndex(jobs) {
  const index = elasticlunr(function () {
    this.addField('skills');
    this.addField('jobTitle');
    this.addField('jobDescription');
    this.setRef('jobId');
  });

  jobs.forEach(job => index.addDoc(job));
  return index;
} 