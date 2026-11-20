const express = require('express');
const router = express.Router();
const { getProfile, getStudents } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

/**
 * Route: GET /profile
 * Protected route: Available to any authenticated user.
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * Route: GET /students
 * Protected route: Available to admins only.
 */
router.get('/students', authMiddleware, adminOnly, getStudents);

module.exports = router;
