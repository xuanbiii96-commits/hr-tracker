const express = require('express');
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorize');
const { body } = require('express-validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/balance', leaveController.getLeaveBalance);

router.post(
  '/request',
  [
    body('leaveTypeId').notEmpty(),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
  ],
  leaveController.requestLeave
);

router.get('/requests', leaveController.getLeaveRequests);

router.put(
  '/request/:id/approve',
  authorizeRole('admin', 'manager'),
  leaveController.approveLeave
);

router.put(
  '/request/:id/reject',
  authorizeRole('admin', 'manager'),
  leaveController.rejectLeave
);

module.exports = router;
