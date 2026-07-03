const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName } = req.body;
      const result = await authService.register(email, password, firstName, lastName);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
