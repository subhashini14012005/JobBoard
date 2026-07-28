const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverLetter: {
      type: String,
      required: [true, 'Please provide a cover letter or introductory statement']
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Interview', 'Accepted', 'Rejected'],
      default: 'Submitted'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
