const { AuditLog } = require('../models');

const auditLogger = async (userId, action, entityType, entityId, changes = null) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      changes,
    });
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};

const auditMiddleware = (req, res, next) => {
  req.auditLogger = auditLogger;
  next();
};

module.exports = { auditMiddleware, auditLogger };
