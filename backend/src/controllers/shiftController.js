const shiftService = require('../services/shiftService');
const { validationResult } = require('express-validator');

class ShiftController {
  async createShift(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, startTime, endTime, breakDuration } = req.body;
      const shift = await shiftService.createShift(name, startTime, endTime, breakDuration);

      res.status(201).json(shift);
    } catch (error) {
      next(error);
    }
  }

  async assignShift(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, shiftId, assignedDate } = req.body;
      const assignment = await shiftService.assignShift(
        userId,
        shiftId,
        assignedDate,
        req.user.id
      );

      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  }

  async getShiftAssignments(req, res, next) {
    try {
      const { userId, startDate, endDate } = req.query;
      const assignments = await shiftService.getShiftAssignments(userId, startDate, endDate);
      res.status(200).json({ data: assignments });
    } catch (error) {
      next(error);
    }
  }

  async requestShiftSwap(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { targetUserId, shiftAssignmentId, reason } = req.body;
      const swap = await shiftService.requestShiftSwap(
        req.user.id,
        targetUserId,
        shiftAssignmentId,
        reason
      );

      res.status(201).json(swap);
    } catch (error) {
      next(error);
    }
  }

  async approveShiftSwap(req, res, next) {
    try {
      const { id } = req.params;
      const swap = await shiftService.approveShiftSwap(id, req.user.id);
      res.status(200).json(swap);
    } catch (error) {
      next(error);
    }
  }

  async rejectShiftSwap(req, res, next) {
    try {
      const { id } = req.params;
      const swap = await shiftService.rejectShiftSwap(id, req.user.id);
      res.status(200).json(swap);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShiftController();
