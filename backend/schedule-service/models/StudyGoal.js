const mongoose = require('mongoose');

const studyGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dailyGoalHours: {
    type: Number,
    default: 3,
    min: 0,
    max: 24
  },
  weeklyGoalHours: {
    type: Number,
    default: 15,
    min: 0
  },
  studyDaysPerWeek: {
    type: Number,
    default: 5,
    min: 1,
    max: 7
  },
  targetCompletionDate: {
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

module.exports = mongoose.model('StudyGoal', studyGoalSchema);
