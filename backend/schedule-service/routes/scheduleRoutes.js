const express = require('express');
const router = express.Router();

// Import all functions from controller
const {
  createSession,
  getSessions,
  updateSession,
  deleteSession,
  stopTimer,
  enableNotifications,
  disableNotifications,
  getWeeklyStats
} = require('../controllers/scheduleController');

// ==================== SESSION ROUTES ====================

// Create new session
router.post('/sessions', createSession);

// Get user sessions
router.get('/sessions/:userId', getSessions);

// Update session
router.put('/sessions/:id', updateSession);

// Delete session
router.delete('/sessions/:id', deleteSession);

// Stop timer
router.put('/sessions/:id/stop-timer', stopTimer);

// ==================== NOTIFICATION ROUTES ====================

// Enable notifications
router.post('/sessions/:id/enable-notifications', enableNotifications);

// Disable notifications
router.post('/sessions/:id/disable-notifications', disableNotifications);

// ==================== STATS ROUTES ====================

// Get weekly stats
router.get('/stats/:userId/weekly', getWeeklyStats);

module.exports = router;