const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveType = sequelize.define('LeaveType', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  annualLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  requiresApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#3B82F6',
  },
}, {
  timestamps: true,
  tableName: 'leave_types',
});

module.exports = LeaveType;
