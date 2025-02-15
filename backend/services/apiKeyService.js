const jobsApiKeys = [
    'AIzaSyA96FvIGYUT25DoCFH9uJeH1gRJbbwWkJE',
    'AIzaSyAQtjhjtBlc-caF0gLJnV490D_GWMuJleQ',
    'AIzaSyDrJN8CWlNNQdaqr9Rk8739JGIr0kuqC-E',
    'AIzaSyAkZDkhTN3wNypVuepYOEB9QLtiKhMoisc',
    'AIzaSyCnX6RzvsuYFKiNnaJ4RLt9c_BxaykoIjc'
];

const resumeApiKey = 'AIzaSyAGmnDFAnw8Qyzy4P1JTtP-hEerNOfI0gU';

class ApiKeyService {
    constructor() {
        this.currentKeyIndex = 0;
        this.failedKeys = new Set();
    }

    getJobsApiKey() {
        // If all keys have failed, reset the failed keys set
        if (this.failedKeys.size === jobsApiKeys.length) {
            this.failedKeys.clear();
        }

        // Find the next working key
        while (this.failedKeys.has(this.currentKeyIndex)) {
            this.currentKeyIndex = (this.currentKeyIndex + 1) % jobsApiKeys.length;
        }

        return jobsApiKeys[this.currentKeyIndex];
    }

    markKeyAsFailed() {
        this.failedKeys.add(this.currentKeyIndex);
        this.currentKeyIndex = (this.currentKeyIndex + 1) % jobsApiKeys.length;
    }

    getResumeApiKey() {
        return resumeApiKey;
    }

    resetFailedKeys() {
        this.failedKeys.clear();
    }
}

module.exports = new ApiKeyService(); 