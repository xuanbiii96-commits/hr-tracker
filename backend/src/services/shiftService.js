const { Shift, ShiftAssignment, ShiftSwap, User } = require('../models');
const { Op } = require('sequelize');

class ShiftService {
  async createShift(name, startTime, endTime, breakDuration) {
    const shift = await Shift.create({
      name,
      startTime,
      endTime,
      breakDuration,
    });

    return shift;
  }

  async assignShift(userId, shiftId, assignedDate, createdBy) {
    // Check for existing assignment on same date
    const existing = await ShiftAssignment.findOne({
      where: { userId, assignedDate },
    });

    if (existing) {
      throw new Error('User already has a shift on this date');
    }

    const assignment = await ShiftAssignment.create({
      userId,
      shiftId,
      assignedDate,
      createdBy,
    });

    return assignment;
  }

  async getShiftAssignments(userId = null, startDate = null, endDate = null) {
    const where = {};
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.assignedDate = { [Op.between]: [startDate, endDate] };
    }

    const assignments = await ShiftAssignment.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Shift, attributes: ['id', 'name', 'startTime', 'endTime'] },
      ],
    });

    return assignments;
  }

  async requestShiftSwap(requesterId, targetUserId, shiftAssignmentId, reason) {
    const shiftAssignment = await ShiftAssignment.findByPk(shiftAssignmentId);
    if (!shiftAssignment) {
      throw new Error('Shift assignment not found');
    }

    const swap = await ShiftSwap.create({
      requesterId,
      targetUserId,
      shiftAssignmentId,
      reason,
    });

    return swap;
  }

  async approveShiftSwap(swapId, approverId) {
    const swap = await ShiftSwap.findByPk(swapId);
    if (!swap) {
      throw new Error('Shift swap not found');
    }

    swap.status = 'approved';
    swap.approverId = approverId;
    swap.approvedDate = new Date();
    await swap.save();

    // Update shift assignment user
    const assignment = await ShiftAssignment.findByPk(swap.shiftAssignmentId);
    assignment.userId = swap.targetUserId;
    await assignment.save();

    return swap;
  }

  async rejectShiftSwap(swapId, approverId) {
    const swap = await ShiftSwap.findByPk(swapId);
    if (!swap) {
      throw new Error('Shift swap not found');
    }

    swap.status = 'rejected';
    swap.approverId = approverId;
    await swap.save();

    return swap;
  }
}

module.exports = new ShiftService();
