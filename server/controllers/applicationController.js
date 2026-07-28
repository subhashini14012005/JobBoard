const Application = require('../models/Application');
const Job = require('../models/Job');
const { mockJobs } = require('./jobController');

let mockApplications = [
  {
    _id: 'app_101',
    job: {
      _id: 'job_1',
      title: 'Senior Full Stack Engineer',
      company: 'TechCorp Solutions',
      location: 'Remote'
    },
    seeker: {
      _id: 'seeker_demo_101',
      name: 'Alex Rivera (Demo Seeker)',
      email: 'seeker@demo.com'
    },
    employer: 'employer_demo_202',
    coverLetter: 'I have 6 years of experience building modern React and Node.js applications with high throughput and clean architectures. Excited about TechCorp!',
    resumeUrl: 'https://example.com/resumes/alex_rivera_cv.pdf',
    status: 'Interview',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// @desc Submit new job application (Seeker only)
// @route POST /api/applications
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    if (!jobId || !coverLetter) {
      return res.status(400).json({ message: 'Please provide job ID and cover letter' });
    }

    if (Application.db && Application.db.readyState === 1) {
      const targetJob = await Job.findById(jobId);
      if (!targetJob) {
        return res.status(404).json({ message: 'Target job posting not found' });
      }

      // Check if seeker already applied
      const existingApp = await Application.findOne({
        job: jobId,
        seeker: req.user._id
      });

      if (existingApp) {
        return res.status(400).json({ message: 'You have already submitted an application for this job' });
      }

      const application = await Application.create({
        job: jobId,
        seeker: req.user._id,
        employer: targetJob.employer,
        coverLetter,
        resumeUrl: resumeUrl || 'https://example.com/resume-placeholder.pdf',
        status: 'Submitted'
      });

      return res.status(201).json(application);
    }

    // Fallback in-memory behavior
    const targetJob = mockJobs.find(j => j._id === jobId) || {
      _id: jobId,
      title: 'Position Applicant',
      company: 'TechCorp Solutions',
      employer: 'employer_demo_202'
    };

    const duplicate = mockApplications.find(a => a.job._id === jobId && a.seeker._id === req.user._id);
    if (duplicate) {
      return res.status(400).json({ message: 'You have already submitted an application for this job' });
    }

    const newApp = {
      _id: 'app_' + Date.now(),
      job: targetJob,
      seeker: {
        _id: req.user._id || 'seeker_demo_101',
        name: req.user.name || 'Demo Seeker',
        email: req.user.email || 'seeker@demo.com'
      },
      employer: targetJob.employer || 'employer_demo_202',
      coverLetter,
      resumeUrl: resumeUrl || 'https://example.com/resume-placeholder.pdf',
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };

    mockApplications.unshift(newApp);
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error processing application' });
  }
};

// @desc Get applications submitted by current seeker
// @route GET /api/applications/mine
const getMyApplications = async (req, res) => {
  try {
    if (Application.db && Application.db.readyState === 1) {
      const applications = await Application.find({ seeker: req.user._id })
        .populate('job', 'title company location salaryRange jobType status')
        .sort({ createdAt: -1 });
      return res.json(applications);
    }

    const apps = mockApplications.filter(a => a.seeker._id === req.user._id || a.seeker._id === 'seeker_demo_101');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// @desc Get applicants for a specific job (Employer only)
// @route GET /api/applications/job/:jobId
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (Application.db && Application.db.readyState === 1) {
      const applications = await Application.find({ job: jobId })
        .populate('seeker', 'name email bio')
        .populate('job', 'title company')
        .sort({ createdAt: -1 });
      return res.json(applications);
    }

    const apps = mockApplications.filter(a => (a.job._id || a.job) === jobId);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates for job' });
  }
};

// @desc Update application status (Employer only)
// @route PATCH /api/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Submitted', 'Under Review', 'Interview', 'Accepted', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid application status provided' });
    }

    if (Application.db && Application.db.readyState === 1) {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application record not found' });
      }

      application.status = status;
      await application.save();
      return res.json(application);
    }

    const app = mockApplications.find(a => a._id === req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Application record not found' });
    }

    app.status = status;
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate status' });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
};
