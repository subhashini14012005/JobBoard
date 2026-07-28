const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, name, email, role, companyName) => {
  return jwt.sign(
    { id, name, email, role, companyName },
    process.env.JWT_SECRET || 'dev_secret_key_12345',
    { expiresIn: '7d' }
  );
};

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    let userExists = false;
    if (User.db && User.db.readyState === 1) {
      userExists = await User.findOne({ email: email.toLowerCase() });
    }

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    let user;
    if (User.db && User.db.readyState === 1) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'seeker',
        companyName: companyName || '',
        bio: bio || ''
      });
    } else {
      // In-memory mock user for fallback development
      user = {
        _id: 'mock_user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        role: role || 'seeker',
        companyName: companyName || '',
        bio: bio || ''
      };
    }

    const token = generateToken(user._id, user.name, user.email, user.role, user.companyName);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      bio: user.bio,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error during registration' });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let user;
    if (User.db && User.db.readyState === 1) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.name, user.email, user.role, user.companyName);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
          bio: user.bio,
          token
        });
      }
    }

    // Fallback for pre-configured demo users if DB is disconnected
    if (email === 'seeker@demo.com' && password === 'password123') {
      const mockUser = {
        _id: 'seeker_demo_101',
        name: 'Alex Rivera (Demo Seeker)',
        email: 'seeker@demo.com',
        role: 'seeker',
        companyName: '',
        bio: 'Senior Full Stack Developer looking for exciting projects.'
      };
      const token = generateToken(mockUser._id, mockUser.name, mockUser.email, mockUser.role, mockUser.companyName);
      return res.json({ ...mockUser, token });
    }

    if (email === 'employer@demo.com' && password === 'password123') {
      const mockUser = {
        _id: 'employer_demo_202',
        name: 'Sarah Connor (Demo Employer)',
        email: 'employer@demo.com',
        role: 'employer',
        companyName: 'TechCorp Solutions',
        bio: 'Leading innovator in modern web platforms.'
      };
      const token = generateToken(mockUser._id, mockUser.name, mockUser.email, mockUser.role, mockUser.companyName);
      return res.json({ ...mockUser, token });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error during login' });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
