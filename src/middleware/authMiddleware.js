const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userModel = require('../models/userModel');

/**
 * JWT Authentication Middleware
 * Reads the token from the Authorization header (format: Bearer <token>).
 * If the token is missing or invalid, returns HTTP 401 Unauthorized.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  // Support both "Bearer <token>" and plain "<token>"
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Token is empty.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Look up the current user in data store to ensure they still exist
    const user = userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User no longer exists.'
      });
    }

    // Attach user details to request object (excluding password)
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
