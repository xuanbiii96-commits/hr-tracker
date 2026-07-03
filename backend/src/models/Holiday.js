const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holiday = sequelize.define('Holiday', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  holidayDate: {
    type: DataTypes.DATE,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isOptional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'holidays',
});

module.exports = Holiday;
