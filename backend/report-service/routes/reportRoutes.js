const express = require('express');
const router = express.Router();
const { uploadReport, getReportHistory, getLatestReport } = require('../controllers/reportController');
const upload = require('../config/multer');

// Upload report (accepts PDF file)
router.post('/upload', upload.single('report'), uploadReport);

// Get report history for user
router.get('/history/:userId', getReportHistory);

// Get latest report for user
router.get('/latest/:userId', getLatestReport);

module.exports = router;
