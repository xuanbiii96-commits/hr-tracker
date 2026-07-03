const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  numberOfDays: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    defaultValue: 'pending',
  },
  reason: {
    type: DataTypes.TEXT,
  },
  approvedDate: {
    type: DataTypes.DATE,
  },
  rejectionReason: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
  tableName: 'leave_requests',
  validate: {
    dateOrder() {
      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        throw new Error('End date must be after or equal to start date');
      }
    },
  },
});

module.exports = LeaveRequest;
