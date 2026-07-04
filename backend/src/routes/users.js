const express = require('express');
const { User, Notification, AttendanceRecord, LeaveRequest, ShiftAssignment } = require('../models');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

router.use(authMiddleware);

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Get notifications
router.get('/notifications', async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.status(200).json({ data: notifications });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/notifications/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
});

// Get calendar events
router.get('/calendar/events', async (req, res, next) => {
  try {
    const { start, end, userId } = req.query;
    const userIdFilter = userId || req.user.id;

    const leaves = await LeaveRequest.findAll({
      where: {
        userId: userIdFilter,
        status: 'approved',
        startDate: { [Op.lte]: end },
        endDate: { [Op.gte]: start },
      },
      attributes: ['id', 'startDate', 'endDate'],
    });

    const shifts = await ShiftAssignment.findAll({
      where: {
        userId: userIdFilter,
        assignedDate: { [Op.between]: [start, end] },
      },
      include: ['Shift'],
    });

    const events = [
      ...leaves.map(leave => ({
        id: leave.id,
        title: 'Leave',
        start: leave.startDate,
        end: leave.endDate,
        type: 'leave',
        color: '#3B82F6',
      })),
      ...shifts.map(shift => ({
        id: shift.id,
        title: shift.Shift.name,
        start: `${shift.assignedDate}T${shift.Shift.startTime}`,
        end: `${shift.assignedDate}T${shift.Shift.endTime}`,
        type: 'shift',
        color: '#10B981',
      })),
    ];

    res.status(200).json({ data: events });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
