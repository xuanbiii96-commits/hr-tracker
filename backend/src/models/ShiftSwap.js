const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShiftSwap = sequelize.define('ShiftSwap', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  reason: {
    type: DataTypes.TEXT,
  },
  approvedDate: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  tableName: 'shift_swaps',
});

module.exports = ShiftSwap;
