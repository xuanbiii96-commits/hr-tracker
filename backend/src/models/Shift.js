const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shift = sequelize.define('Shift', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  breakDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#10B981',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'shifts',
});

module.exports = Shift;
