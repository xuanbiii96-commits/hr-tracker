const express = require('express');
const { AttendanceRecord, ShiftAssignment } = require('../models');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

router.use(authMiddleware);

// Check in
router.post('/check-in', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const shiftAssignment = await ShiftAssignment.findOne({
      where: {
        userId: req.user.id,
        assignedDate: today,
      },
    });

    if (!shiftAssignment) {
      return res.status(400).json({ error: 'No shift assigned for today' });
    }

    const attendance = await AttendanceRecord.create({
      userId: req.user.id,
      shiftAssignmentId: shiftAssignment.id,
      checkIn: new Date(),
      status: 'present',
    });

    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
});

// Check out
router.post('/check-out', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await AttendanceRecord.findOne({
      where: {
        userId: req.user.id,
        checkOut: null,
      },
      order: [['checkIn', 'DESC']],
    });

    if (!attendance) {
      return res.status(400).json({ error: 'No active check-in found' });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
});

// Get attendance records
router.get('/', async (req, res, next) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const where = { userId: userId || req.user.id };

    if (startDate && endDate) {
      where.checkIn = { [Op.between]: [startDate, endDate] };
    }

    const records = await AttendanceRecord.findAll({
      where,
      include: ['ShiftAssignment'],
      order: [['checkIn', 'DESC']],
    });

    res.status(200).json({ data: records });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
