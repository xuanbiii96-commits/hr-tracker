const { LeaveRequest, LeaveBalance, LeaveType, User } = require('../models');
const { Op } = require('sequelize');

class LeaveService {
  async requestLeave(userId, leaveTypeId, startDate, endDate, reason) {
    // Check for overlapping leaves
    const overlapping = await LeaveRequest.findOne({
      where: {
        userId,
        status: { [Op.in]: ['pending', 'approved'] },
        [Op.or]: [
          { startDate: { [Op.lte]: endDate }, endDate: { [Op.gte]: startDate } },
        ],
      },
    });

    if (overlapping) {
      throw new Error('Overlapping leave request exists');
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

    // Check leave balance
    const balance = await LeaveBalance.findOne({
      where: {
        userId,
        leaveTypeId,
        year: new Date().getFullYear(),
      },
    });

    if (!balance || balance.remainingBalance < numberOfDays) {
      throw new Error('Insufficient leave balance');
    }

    const leaveRequest = await LeaveRequest.create({
      userId,
      leaveTypeId,
      startDate,
      endDate,
      numberOfDays,
      reason,
    });

    return leaveRequest;
  }

  async approveLeave(leaveId, approverId) {
    const leave = await LeaveRequest.findByPk(leaveId);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    leave.status = 'approved';
    leave.approverId = approverId;
    leave.approvedDate = new Date();
    await leave.save();

    // Update leave balance
    await LeaveBalance.increment('usedBalance', {
      by: leave.numberOfDays,
      where: {
        userId: leave.userId,
        leaveTypeId: leave.leaveTypeId,
        year: new Date(leave.startDate).getFullYear(),
      },
    });

    return leave;
  }

  async rejectLeave(leaveId, approverId, reason) {
    const leave = await LeaveRequest.findByPk(leaveId);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    leave.status = 'rejected';
    leave.approverId = approverId;
    leave.rejectionReason = reason;
    await leave.save();

    return leave;
  }

  async getLeaveBalance(userId) {
    const balances = await LeaveBalance.findAll({
      where: { userId, year: new Date().getFullYear() },
      include: [LeaveType],
    });

    return balances;
  }

  async getLeaveRequests(userId = null, status = null) {
    const where = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const requests = await LeaveRequest.findAll({
      where,
      include: [
        { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: LeaveType, attributes: ['id', 'name', 'color'] },
        { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
      ],
    });

    return requests;
  }
}

module.exports = new LeaveService();
