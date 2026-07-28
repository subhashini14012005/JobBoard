const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job-board';
    await mongoose.connect(connStr);
    console.log('[Seed]: Connected to MongoDB');

    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('[Seed]: Existing database records cleared');

    const employer = await User.create({
      name: 'Sarah Connor',
      email: 'employer@demo.com',
      password: 'password123',
      role: 'employer',
      companyName: 'TechCorp Solutions',
      bio: 'Leading modern web development team scaling SaaS platforms.'
    });

    const seeker = await User.create({
      name: 'Alex Rivera',
      email: 'seeker@demo.com',
      password: 'password123',
      role: 'seeker',
      companyName: '',
      bio: 'Experienced Full Stack Engineer skilled in React, Node, and Cloud infrastructure.'
    });

    console.log('[Seed]: Demo users created');

    const jobs = await Job.create([
      {
        title: 'Senior Full Stack Engineer',
        company: 'TechCorp Solutions',
        location: 'Remote',
        jobType: 'Full-time',
        category: 'Engineering',
        salaryRange: '$130,000 - $160,000 / year',
        description: 'We are seeking a seasoned Senior Full Stack Engineer to lead front-end architecture and backend microservices using React, Node.js, and MongoDB.',
        requirements: ['5+ years React & Node.js experience', 'Proficiency in MongoDB & Mongoose', 'Experience with AWS or Docker', 'Strong REST API design skills'],
        employer: employer._id,
        status: 'active'
      },
      {
        title: 'Lead UI/UX Product Designer',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA (Hybrid)',
        jobType: 'Full-time',
        category: 'Design',
        salaryRange: '$120,000 - $150,000 / year',
        description: 'Design intuitive, world-class user interfaces for enterprise web apps. Collaborate closely with product managers and engineers to craft high-conversion user journeys.',
        requirements: ['4+ years UI/UX product design', 'Figma mastery & interactive prototyping', 'Deep understanding of accessibility standards'],
        employer: employer._id,
        status: 'active'
      },
      {
        title: 'DevOps & Cloud Architect',
        company: 'TechCorp Solutions',
        location: 'Remote',
        jobType: 'Contract',
        category: 'Engineering',
        salaryRange: '$90 - $120 / hour',
        description: 'Help scale our Kubernetes clusters, optimize CI/CD pipelines, and migrate legacy backend services to serverless infrastructure.',
        requirements: ['Expertise in AWS, Terraform, & Kubernetes', 'CI/CD pipeline automation (GitHub Actions)', 'Strong Linux administration background'],
        employer: employer._id,
        status: 'active'
      }
    ]);

    console.log('[Seed]: Demo jobs created');

    await Application.create({
      job: jobs[0]._id,
      seeker: seeker._id,
      employer: employer._id,
      coverLetter: 'I have 6 years of experience building modern React and Node.js applications with high throughput and clean architectures. Excited about TechCorp!',
      resumeUrl: 'https://example.com/resumes/alex_rivera_cv.pdf',
      status: 'Interview'
    });

    console.log('[Seed]: Demo application created');
    console.log('[Seed Success]: Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
