const express = require('express');
const shiftController = require('../controllers/shiftController');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorize');
const { body } = require('express-validator');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/create',
  authorizeRole('admin'),
  [
    body('name').notEmpty(),
    body('startTime').notEmpty(),
    body('endTime').notEmpty(),
  ],
  shiftController.createShift
);

router.post(
  '/assign',
  authorizeRole('admin', 'manager'),
  [
    body('userId').notEmpty(),
    body('shiftId').notEmpty(),
    body('assignedDate').isISO8601(),
  ],
  shiftController.assignShift
);

router.get('/assignments', shiftController.getShiftAssignments);

router.post(
  '/swap/request',
  [
    body('targetUserId').notEmpty(),
    body('shiftAssignmentId').notEmpty(),
  ],
  shiftController.requestShiftSwap
);

router.put(
  '/swap/:id/approve',
  authorizeRole('admin', 'manager'),
  shiftController.approveShiftSwap
);

router.put(
  '/swap/:id/reject',
  authorizeRole('admin', 'manager'),
  shiftController.rejectShiftSwap
);

module.exports = router;
