const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  checkIn: {
    type: DataTypes.DATE,
  },
  checkOut: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'half_day'),
    defaultValue: 'present',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
  tableName: 'attendance_records',
});

module.exports = AttendanceRecord;
