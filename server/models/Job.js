const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please add location (e.g., Remote, San Francisco, CA)'],
      trim: true
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'],
      default: 'Full-time'
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Customer Support', 'Other'],
      default: 'Engineering'
    },
    salaryRange: {
      type: String,
      required: [true, 'Please add a salary range'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add job description']
    },
    requirements: {
      type: [String],
      default: []
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
