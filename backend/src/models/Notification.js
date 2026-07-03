const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
  },
  entityType: {
    type: DataTypes.STRING(100),
  },
  entityId: {
    type: DataTypes.UUID,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  readAt: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  tableName: 'notifications',
});

module.exports = Notification;
