const express = require('express');
const { Holiday } = require('../models');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorize');
const { body } = require('express-validator');

const router = express.Router();

router.use(authMiddleware);

// Get holidays
router.get('/', async (req, res, next) => {
  try {
    const { year } = req.query;
    const where = {};
    if (year) {
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);
      where.holidayDate = { [require('sequelize').Op.between]: [startOfYear, endOfYear] };
    }

    const holidays = await Holiday.findAll({ where });
    res.status(200).json({ data: holidays });
  } catch (error) {
    next(error);
  }
});

// Add holiday (Admin only)
router.post(
  '/',
  authorizeRole('admin'),
  [
    body('name').notEmpty(),
    body('holidayDate').isISO8601(),
  ],
  async (req, res, next) => {
    try {
      const { name, holidayDate, description, isOptional } = req.body;
      const holiday = await Holiday.create({
        name,
        holidayDate,
        description,
        isOptional,
      });
      res.status(201).json(holiday);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
