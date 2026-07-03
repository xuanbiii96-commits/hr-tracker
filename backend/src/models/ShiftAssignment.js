const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShiftAssignment = sequelize.define('ShiftAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  assignedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'absent', 'swapped'),
    defaultValue: 'scheduled',
  },
}, {
  timestamps: true,
  tableName: 'shift_assignments',
});

module.exports = ShiftAssignment;
