const Job = require('../models/Job');

// In-memory fallback dataset for seamless demo experience
let mockJobs = [
  {
    _id: 'job_1',
    title: 'Senior Full Stack Engineer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    jobType: 'Full-time',
    category: 'Engineering',
    salaryRange: '$130,000 - $160,000 / year',
    description: 'We are seeking a seasoned Senior Full Stack Engineer to lead front-end architecture and backend microservices using React, Node.js, and MongoDB.',
    requirements: ['5+ years React & Node.js experience', 'Proficiency in MongoDB & Mongoose', 'Experience with AWS or Docker', 'Strong REST API design skills'],
    employer: 'employer_demo_202',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'job_2',
    title: 'Lead UI/UX Product Designer',
    company: 'CreativePulse Studio',
    location: 'San Francisco, CA (Hybrid)',
    jobType: 'Full-time',
    category: 'Design',
    salaryRange: '$120,000 - $150,000 / year',
    description: 'Design intuitive, world-class user interfaces for enterprise web apps. Collaborate closely with product managers and engineers to craft high-conversion user journeys.',
    requirements: ['4+ years UI/UX product design', 'Figma mastery & interactive prototyping', 'Deep understanding of accessibility standards', 'Portfolio showcasing end-to-end design systems'],
    employer: 'employer_demo_202',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    _id: 'job_3',
    title: 'DevOps & Cloud Architect',
    company: 'CloudScale Infrastructure',
    location: 'Remote',
    jobType: 'Contract',
    category: 'Engineering',
    salaryRange: '$90 - $120 / hour',
    description: 'Help scale our Kubernetes clusters, optimize CI/CD pipelines, and migrate legacy backend services to serverless infrastructure.',
    requirements: ['Expertise in AWS, Terraform, & Kubernetes', 'CI/CD pipeline automation (GitHub Actions)', 'Strong Linux administration background'],
    employer: 'employer_demo_202',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    _id: 'job_4',
    title: 'Growth Marketing Manager',
    company: 'Nexus Digital Media',
    location: 'New York, NY',
    jobType: 'Full-time',
    category: 'Marketing',
    salaryRange: '$95,000 - $120,000 / year',
    description: 'Drive user acquisition across organic and paid channels. Manage SEO, PPC campaigns, content strategy, and user lifecycle retention funnels.',
    requirements: ['3+ years B2B SaaS marketing experience', 'Data analytics with Google Analytics & Mixpanel', 'Proven track record of scaling user conversion'],
    employer: 'employer_demo_202',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'job_5',
    title: 'Frontend React Developer',
    company: 'NextGen Interfaces',
    location: 'Remote',
    jobType: 'Part-time',
    category: 'Engineering',
    salaryRange: '$60 - $80 / hour',
    description: 'Build fast, responsive web dashboards with modern React, Tailwind CSS, and state management frameworks.',
    requirements: ['Solid JavaScript ES6+ & TypeScript', 'React component architecture', 'State management (Redux or Context API)'],
    employer: 'employer_demo_202',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

// @desc Get all jobs with filtering & search
// @route GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { search, category, location, jobType } = req.query;

    if (Job.db && Job.db.readyState === 1) {
      let query = { status: 'active' };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (jobType && jobType !== 'All') {
        query.jobType = jobType;
      }

      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }

      const jobs = await Job.find(query).sort({ createdAt: -1 }).populate('employer', 'name email companyName');
      return res.json(jobs);
    }

    // Fallback filtering on in-memory jobs
    let filtered = mockJobs.filter(j => j.status === 'active');

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(j => j.category === category);
    }

    if (jobType && jobType !== 'All') {
      filtered = filtered.filter(j => j.jobType === jobType);
    }

    if (location) {
      filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching jobs' });
  }
};

// @desc Get single job detail
// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    if (Job.db && Job.db.readyState === 1) {
      const job = await Job.findById(req.params.id).populate('employer', 'name email companyName bio');
      if (!job) {
        return res.status(404).json({ message: 'Job posting not found' });
      }
      return res.json(job);
    }

    const job = mockJobs.find(j => j._id === req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving job details' });
  }
};

// @desc Post new job (Employer only)
// @route POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, company, location, jobType, category, salaryRange, description, requirements } = req.body;

    if (!title || !company || !location || !salaryRange || !description) {
      return res.status(400).json({ message: 'Please fill in all required job fields' });
    }

    const reqArray = Array.isArray(requirements)
      ? requirements
      : typeof requirements === 'string'
      ? requirements.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    if (Job.db && Job.db.readyState === 1) {
      const job = await Job.create({
        title,
        company,
        location,
        jobType: jobType || 'Full-time',
        category: category || 'Engineering',
        salaryRange,
        description,
        requirements: reqArray,
        employer: req.user._id,
        status: 'active'
      });
      return res.status(201).json(job);
    }

    const newJob = {
      _id: 'job_' + Date.now(),
      title,
      company,
      location,
      jobType: jobType || 'Full-time',
      category: category || 'Engineering',
      salaryRange,
      description,
      requirements: reqArray,
      employer: req.user._id || 'employer_demo_202',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockJobs.unshift(newJob);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error creating job' });
  }
};

// @desc Update job (Employer owner)
// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    if (Job.db && Job.db.readyState === 1) {
      let job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      if (job.employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this job posting' });
      }
      job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(job);
    }

    const index = mockJobs.findIndex(j => j._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Job not found' });
    mockJobs[index] = { ...mockJobs[index], ...req.body };
    res.json(mockJobs[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job' });
  }
};

// @desc Delete job (Employer owner)
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    if (Job.db && Job.db.readyState === 1) {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      if (job.employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this job posting' });
      }
      await job.deleteOne();
      return res.json({ message: 'Job listing deleted successfully' });
    }

    const index = mockJobs.findIndex(j => j._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Job not found' });
    mockJobs.splice(index, 1);
    res.json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job' });
  }
};

// @desc Get jobs created by current logged-in employer
// @route GET /api/jobs/employer/mine
const getEmployerJobs = async (req, res) => {
  try {
    if (Job.db && Job.db.readyState === 1) {
      const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
      return res.json(jobs);
    }

    const jobs = mockJobs.filter(j => j.employer === req.user._id || j.employer === 'employer_demo_202');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving employer job listings' });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  mockJobs
};
