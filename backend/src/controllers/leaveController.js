const leaveService = require('../services/leaveService');
const { validationResult } = require('express-validator');

class LeaveController {
  async requestLeave(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { leaveTypeId, startDate, endDate, reason } = req.body;
      const leave = await leaveService.requestLeave(
        req.user.id,
        leaveTypeId,
        startDate,
        endDate,
        reason
      );

      res.status(201).json(leave);
    } catch (error) {
      next(error);
    }
  }

  async approveLeave(req, res, next) {
    try {
      const { id } = req.params;
      const leave = await leaveService.approveLeave(id, req.user.id);

      res.status(200).json(leave);
    } catch (error) {
      next(error);
    }
  }

  async rejectLeave(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const leave = await leaveService.rejectLeave(id, req.user.id, reason);

      res.status(200).json(leave);
    } catch (error) {
      next(error);
    }
  }

  async getLeaveBalance(req, res, next) {
    try {
      const balances = await leaveService.getLeaveBalance(req.user.id);
      res.status(200).json({ data: balances });
    } catch (error) {
      next(error);
    }
  }

  async getLeaveRequests(req, res, next) {
    try {
      const { userId, status } = req.query;
      const requests = await leaveService.getLeaveRequests(userId, status);
      res.status(200).json({ data: requests });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeaveController();
