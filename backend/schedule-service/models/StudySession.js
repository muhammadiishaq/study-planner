const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed from ObjectId to String since we're not using User model
    required: true,
    index: true
  },
  // ✅ NEW: Store student info directly
  studentEmail: {
    type: String,
    default: ''
  },
  studentName: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: String,
    required: true,
    // Format: "HH:MM" (24-hour format)
  },
  endTime: {
    type: String,
    required: true,
  },
  courseId: {
    type: Number,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  diploma: {
    type: String,
    required: true
    // e.g., "Cyber Security", "DevOps", "SysOps", "AI"
  },
  plannedHours: {
    type: Number,
    required: true,
    min: 0
  },
  actualHours: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'skipped'],
    default: 'not_started'
  },
  notes: {
    type: String,
    default: ''
  },
  timerStartedAt: {
    type: Date,
    default: null
  },
  timerStoppedAt: {
    type: Date,
    default: null
  },
  syncedFromLocal: {
    type: Boolean,
    default: false
  },
  
  // ==================== NOTIFICATION FIELDS ====================
  notificationsEnabled: {
    type: Boolean,
    default: false
  },
  reminder15Sent: {
    type: Boolean,
    default: false
  },
  reminder15SentAt: {
    type: Date,
    default: null
  },
  reminder5Sent: {
    type: Boolean,
    default: false
  },
  reminder5SentAt: {
    type: Date,
    default: null
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
studySessionSchema.index({ userId: 1, date: 1 });
studySessionSchema.index({ userId: 1, status: 1 });
studySessionSchema.index({ date: 1, notificationsEnabled: 1 }); // For notification scheduler

module.exports = mongoose.model('StudySession', studySessionSchema);