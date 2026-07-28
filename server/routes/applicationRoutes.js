const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('seeker'), applyForJob);
router.get('/mine', protect, authorizeRoles('seeker'), getMyApplications);
router.get('/job/:jobId', protect, authorizeRoles('employer'), getJobApplications);
router.patch('/:id/status', protect, authorizeRoles('employer'), updateApplicationStatus);

module.exports = router;
