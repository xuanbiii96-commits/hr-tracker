const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { jwtSecret, jwtExpire } = require('../config/auth');

class AuthService {
  async register(email, password, firstName, lastName) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      email,
      passwordHash: password,
      firstName,
      lastName,
    });

    return this.generateToken(user);
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: jwtExpire }
    );

    return {
      token,
      user: user.toJSON(),
    };
  }
}

module.exports = new AuthService();
