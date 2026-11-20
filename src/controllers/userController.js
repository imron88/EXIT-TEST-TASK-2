const userModel = require('../models/userModel');

/**
 * Controller for Profile
 * GET /profile
 * Available to any logged-in user; returns details without password.
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user was attached by authMiddleware
    const user = userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for Students List
 * GET /students
 * Available to admins only (guarded by adminOnly middleware).
 * Returns list of all registered students without passwords.
 */
const getStudents = async (req, res, next) => {
  try {
    const students = userModel.findAllStudents();

    return res.status(200).json({
      success: true,
      message: 'Students list retrieved successfully',
      count: students.length,
      students
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getStudents
};
