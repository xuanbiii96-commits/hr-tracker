const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveBalance = sequelize.define('LeaveBalance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  totalBalance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  usedBalance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastAccrualDate: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  tableName: 'leave_balance',
});

module.exports = LeaveBalance;
