const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportDate: {
    type: Date,
    required: true
  },
  diplomaProgress: {
    type: Map,
    of: Number,
    // Example: { "Cyber Security": 80, "DevOps": 93, "SysOps": 85, "AI": 85 }
  },
  extractedText: {
    type: String,
    // Store full extracted text for reference (small size)
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
dailyReportSchema.index({ userId: 1, reportDate: -1 });

module.exports = mongoose.model('DailyReport', dailyReportSchema);
