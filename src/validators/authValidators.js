const { body, validationResult } = require('express-validator');

/**
 * Middleware to check express-validator results.
 * Returns 400 Bad Request with details if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for registration:
 * - name: required, trimmed
 * - email: valid email format
 * - password: minimum 6 characters
 * - role: optional, must be 'student' or 'admin'
 */
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['student', 'admin'])
    .withMessage("Role must be either 'student' or 'admin'")
];

/**
 * Validation rules for login:
 * - email: valid email format
 * - password: required
 */
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules
};
