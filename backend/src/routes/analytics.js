const express = require('express');
const { LeaveRequest, ShiftAssignment, User, AttendanceRecord, LeaveBalance, Shift } = require('../models');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorize');
const { Op } = require('sequelize');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRole('admin', 'manager'));

// Dashboard summary
router.get('/dashboard', async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0);

    const totalLeaves = await LeaveRequest.count({
      where: {
        status: 'approved',
        startDate: { [Op.gte]: startDate },
        endDate: { [Op.lte]: endDate },
      },
    });

    const pendingApprovals = await LeaveRequest.count({
      where: { status: 'pending' },
    });

    const totalEmployees = await User.count({
      where: { status: 'active' },
    });

    res.status(200).json({
      totalLeaves,
      pendingApprovals,
      totalEmployees,
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
    });
  } catch (error) {
    next(error);
  }
});

// Leave report
router.get('/leave-report', async (req, res, next) => {
  try {
    const { departmentId, startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.startDate = { [Op.gte]: startDate };
      where.endDate = { [Op.lte]: endDate };
    }

    const leaves = await LeaveRequest.findAll({
      where,
      include: [{ model: User, as: 'requester', attributes: ['firstName', 'lastName'] }],
    });

    const report = leaves.map(leave => ({
      employee: `${leave.requester.firstName} ${leave.requester.lastName}`,
      leaveType: leave.leaveType,
      totalDays: leave.numberOfDays,
      status: leave.status,
      startDate: leave.startDate,
      endDate: leave.endDate,
    }));

    res.status(200).json({ data: report });
  } catch (error) {
    next(error);
  }
});

// Attendance report
router.get('/attendance-report', async (req, res, next) => {
  try {
    const { departmentId, month, year } = req.query;
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0);

    const records = await AttendanceRecord.findAll({
      where: {
        checkIn: { [Op.between]: [startDate, endDate] },
      },
      include: [{ model: User }],
    });

    const report = {};
    records.forEach(record => {
      const empId = record.userId;
      if (!report[empId]) {
        report[empId] = {
          employee: `${record.User.firstName} ${record.User.lastName}`,
          present: 0,
          absent: 0,
          late: 0,
        };
      }
      report[empId][record.status]++;
    });

    res.status(200).json({ data: Object.values(report) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
