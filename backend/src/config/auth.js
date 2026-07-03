const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  bcryptRounds: 10,
};
