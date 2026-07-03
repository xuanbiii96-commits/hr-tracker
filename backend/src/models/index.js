const sequelize = require('../config/database');
const User = require('./User');
const Department = require('./Department');
const LeaveType = require('./LeaveType');
const LeaveBalance = require('./LeaveBalance');
const LeaveRequest = require('./LeaveRequest');
const Shift = require('./Shift');
const ShiftAssignment = require('./ShiftAssignment');
const ShiftSwap = require('./ShiftSwap');
const Holiday = require('./Holiday');
const AttendanceRecord = require('./AttendanceRecord');
const AuditLog = require('./AuditLog');
const Notification = require('./Notification');

// Define associations

// User associations
User.hasMany(LeaveRequest, { as: 'leaveRequests', foreignKey: 'userId' });
User.hasMany(LeaveBalance, { as: 'leaveBalance', foreignKey: 'userId' });
User.hasMany(ShiftAssignment, { as: 'shiftAssignments', foreignKey: 'userId' });
User.hasMany(AttendanceRecord, { as: 'attendanceRecords', foreignKey: 'userId' });
User.hasMany(AuditLog, { as: 'auditLogs', foreignKey: 'userId' });
User.hasMany(Notification, { as: 'notifications', foreignKey: 'userId' });
User.belongsTo(Department, { foreignKey: 'departmentId' });
User.hasMany(LeaveRequest, { as: 'approvedLeaves', foreignKey: 'approverId' });
User.hasMany(ShiftAssignment, { as: 'assignedShifts', foreignKey: 'createdBy' });
User.hasMany(ShiftSwap, { as: 'swapRequests', foreignKey: 'requesterId' });
User.hasMany(ShiftSwap, { as: 'swapApprovals', foreignKey: 'approverId' });

// Department associations
Department.hasMany(User, { foreignKey: 'departmentId' });

// LeaveType associations
LeaveType.hasMany(LeaveRequest, { foreignKey: 'leaveTypeId' });
LeaveType.hasMany(LeaveBalance, { foreignKey: 'leaveTypeId' });

// LeaveBalance associations
LeaveBalance.belongsTo(User, { foreignKey: 'userId' });
LeaveBalance.belongsTo(LeaveType, { foreignKey: 'leaveTypeId' });

// LeaveRequest associations
LeaveRequest.belongsTo(User, { as: 'requester', foreignKey: 'userId' });
LeaveRequest.belongsTo(LeaveType, { foreignKey: 'leaveTypeId' });
LeaveRequest.belongsTo(User, { as: 'approver', foreignKey: 'approverId' });

// Shift associations
Shift.hasMany(ShiftAssignment, { foreignKey: 'shiftId' });

// ShiftAssignment associations
ShiftAssignment.belongsTo(User, { foreignKey: 'userId' });
ShiftAssignment.belongsTo(Shift, { foreignKey: 'shiftId' });
ShiftAssignment.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
ShiftAssignment.hasMany(AttendanceRecord, { foreignKey: 'shiftAssignmentId' });
ShiftAssignment.hasMany(ShiftSwap, { foreignKey: 'shiftAssignmentId' });

// ShiftSwap associations
ShiftSwap.belongsTo(User, { as: 'requester', foreignKey: 'requesterId' });
ShiftSwap.belongsTo(User, { as: 'targetUser', foreignKey: 'targetUserId' });
ShiftSwap.belongsTo(ShiftAssignment, { foreignKey: 'shiftAssignmentId' });
ShiftSwap.belongsTo(User, { as: 'approver', foreignKey: 'approverId' });

// AttendanceRecord associations
AttendanceRecord.belongsTo(User, { foreignKey: 'userId' });
AttendanceRecord.belongsTo(ShiftAssignment, { foreignKey: 'shiftAssignmentId' });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: 'userId' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Department,
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  Shift,
  ShiftAssignment,
  ShiftSwap,
  Holiday,
  AttendanceRecord,
  AuditLog,
  Notification,
};
