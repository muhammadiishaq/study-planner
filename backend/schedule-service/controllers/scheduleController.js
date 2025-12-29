const StudySession = require('../models/StudySession');
const mongoose = require('mongoose');

// ==================== USER MODEL DEFINITION ====================

// Define User Schema (matches auth service)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selectedLevel: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Create or get existing User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ==================== GET USER FROM DATABASE ====================

async function getUserFromAuthDB(userId) {
  try {
    console.log('🔍 Looking up user with ID:', userId);
    console.log('📁 Database:', mongoose.connection.name);
    
    const user = await User.findById(userId).select('name email');
    
    if (user) {
      console.log('✅ Found user:', user.name, user.email);
      return {
        email: user.email,
        name: user.name
      };
    }
    
    console.log('❌ User not found in database!');
    console.log('💡 Try checking if userId is correct');
    return {
      email: 'student@example.com',
      name: 'Student'
    };
  } catch (error) {
    console.error('❌ Error fetching user:', error.message);
    return {
      email: 'student@example.com',
      name: 'Student'
    };
  }
}

// ==================== CREATE SESSION ====================

exports.createSession = async (req, res) => {
  try {
    const { userId, date, startTime, endTime, courseId, courseName, diploma, plannedHours, notes } = req.body;

    // Get email/name from database
    const userData = await getUserFromAuthDB(userId);

    console.log('👤 Creating session for:', userData.name, userData.email);

    const session = await StudySession.create({
      userId,
      studentEmail: userData.email,
      studentName: userData.name,
      date,
      startTime,
      endTime,
      courseId,
      courseName,
      diploma,
      plannedHours,
      notes: notes || ''
    });

    console.log('✅ Session created with email:', session.studentEmail);

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
};

// ==================== GET SESSIONS ====================

exports.getSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sessions = await StudySession.find(query).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// ==================== UPDATE SESSION ====================

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await StudySession.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
};

// ==================== DELETE SESSION ====================

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await StudySession.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting session',
      error: error.message
    });
  }
};

// ==================== STOP TIMER ====================

exports.stopTimer = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await StudySession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (!session.timerStartedAt) {
      return res.status(400).json({
        success: false,
        message: 'Timer was not started'
      });
    }

    const now = new Date();
    const startTime = new Date(session.timerStartedAt);
    const diffMs = now - startTime;
    const diffHours = diffMs / (1000 * 60 * 60);

    session.status = 'completed';
    session.actualHours = Math.round(diffHours * 100) / 100;
    session.timerStoppedAt = now;
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Timer stopped',
      data: session
    });

  } catch (error) {
    console.error('Stop timer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error stopping timer',
      error: error.message
    });
  }
};

// ==================== ENABLE NOTIFICATIONS ====================

exports.enableNotifications = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await StudySession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // If session doesn't have email, fetch it now
    if (!session.studentEmail || session.studentEmail === 'student@example.com' || !session.studentName) {
      console.log('⚠️  Session missing email, fetching from database...');
      const userData = await getUserFromAuthDB(session.userId);
      session.studentEmail = userData.email;
      session.studentName = userData.name;
      console.log('✅ Updated session with:', userData.email);
    }

    // Check if session is in the past
    const sessionDateTime = new Date(session.date);
    const [hours, minutes] = session.startTime.split(':');
    sessionDateTime.setHours(parseInt(hours), parseInt(minutes));

    if (sessionDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot enable notifications for past sessions'
      });
    }

    session.notificationsEnabled = true;
    session.reminder15Sent = false;
    session.reminder5Sent = false;
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Notifications enabled! You will receive emails at ' + session.studentEmail,
      data: session
    });

  } catch (error) {
    console.error('Enable notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enabling notifications',
      error: error.message
    });
  }
};

// ==================== DISABLE NOTIFICATIONS ====================

exports.disableNotifications = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await StudySession.findByIdAndUpdate(
      id,
      {
        notificationsEnabled: false,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notifications disabled',
      data: session
    });

  } catch (error) {
    console.error('Disable notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disabling notifications',
      error: error.message
    });
  }
};

// ==================== GET WEEKLY STATS ====================

exports.getWeeklyStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      userId,
      date: { $gte: monday }
    });

    const plannedHours = sessions.reduce((sum, s) => sum + s.plannedHours, 0);
    const completedHours = sessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.actualHours, 0);

    res.status(200).json({
      success: true,
      data: {
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        plannedHours: Math.round(plannedHours * 100) / 100,
        completedHours: Math.round(completedHours * 100) / 100,
        remainingHours: Math.round((plannedHours - completedHours) * 100) / 100,
        progressPercentage: plannedHours > 0 ? Math.round((completedHours / plannedHours) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};