const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: [true, 'Resume URL is required']
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true
  },
  content: {
    type: String
  },
  parsedInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  analysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ATSScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  strict: false  // This allows for dynamic fields
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume; 