const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  entityId: {
    type: DataTypes.UUID,
  },
  changes: {
    type: DataTypes.JSONB,
  },
  ipAddress: {
    type: DataTypes.STRING(45),
  },
  userAgent: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
  tableName: 'audit_logs',
  createdAt: 'createdAt',
  updatedAt: false,
});

module.exports = AuditLog;
