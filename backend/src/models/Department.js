const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
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
}, {
  timestamps: true,
  tableName: 'departments',
});

module.exports = Department;
