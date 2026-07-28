const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key_12345');
      
      // If DB is connected, fetch user, else attach payload
      if (User.db && User.db.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Demo User',
          email: decoded.email || 'demo@example.com',
          role: decoded.role || 'seeker',
          companyName: decoded.companyName || ''
        };
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or authorization failed' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
