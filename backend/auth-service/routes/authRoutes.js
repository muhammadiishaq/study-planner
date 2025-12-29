const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateLevel, getUserById } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// ✅ NEW: Get user by ID (for scheduleService to fetch email)
router.get('/user/:id', getUserById);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/level', protect, updateLevel);

module.exports = router;
