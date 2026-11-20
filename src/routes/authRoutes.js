const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const {
  registerValidationRules,
  loginValidationRules,
  validate
} = require('../validators/authValidators');

/**
 * Route: POST /register
 * Accepts: name, email, password, role
 */
router.post('/register', registerValidationRules, validate, register);

/**
 * Route: POST /login
 * Accepts: email, password
 */
router.post('/login', loginValidationRules, validate, login);

module.exports = router;
