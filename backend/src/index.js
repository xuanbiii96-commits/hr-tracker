const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const { auditMiddleware } = require('./middleware/auditLogger');

const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');
const shiftRoutes = require('./routes/shift');
const userRoutes = require('./routes/users');
const holidayRoutes = require('./routes/holidays');
const attendanceRoutes = require('./routes/attendance');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auditMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HR Tracker Backend is running' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leave', leaveRoutes);
app.use('/api/v1/shifts', shiftRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/holidays', holidayRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync({ alter: true });
    console.log('Database models synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
