const cron = require('node-cron');
const StudySession = require('../models/StudySession');
const { sendStudyReminder } = require('./emailService');

// Track sent notifications to avoid duplicates
const sentNotifications = new Set();

// Check for upcoming sessions and send reminders
async function checkUpcomingSessions() {
  try {
    const now = new Date();
    
    // Get current time in minutes since midnight
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Get today's date at midnight
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all sessions for today that have notifications enabled
    // ✅ FIXED: Removed .populate() since we don't have User model
    const sessions = await StudySession.find({
      date: {
        $gte: today,
        $lt: tomorrow
      },
      notificationsEnabled: true,
      status: { $ne: 'completed' }
    });

    if (sessions.length === 0) {
      return; // No sessions to check
    }

    console.log(`🔍 Checking ${sessions.length} sessions for reminders...`);

    for (const session of sessions) {
      // ✅ FIXED: Skip if no email stored in session
      if (!session.studentEmail || !session.studentName) {
        console.log(`⚠️  Skipping session ${session._id}: No student email/name stored`);
        continue;
      }

      // Parse session start time (format: "HH:MM")
      const [hours, minutes] = session.startTime.split(':').map(Number);
      const sessionMinutes = hours * 60 + minutes;

      // Calculate minutes until session starts
      const minutesUntil = sessionMinutes - currentMinutes;

      // Check for 15-minute reminder
      if (minutesUntil <= 15 && minutesUntil > 14) {
        const notificationKey = `${session._id}_15`;
        
        // Check if already sent
        if (sentNotifications.has(notificationKey) || session.reminder15Sent) {
          continue;
        }

        console.log(`📧 Sending 15-minute reminder for session ${session._id}`);
        
        const result = await sendStudyReminder({
          studentEmail: session.studentEmail,
          studentName: session.studentName,
          sessionDate: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          courseName: session.courseName,
          diploma: session.diploma,
          plannedHours: session.plannedHours,
          minutesBefore: 15,
          notes: session.notes
        });

        if (result.success) {
          // Mark as sent in database
          session.reminder15Sent = true;
          session.reminder15SentAt = new Date();
          await session.save();
          
          // Add to in-memory set
          sentNotifications.add(notificationKey);
          
          console.log(`✅ 15-minute reminder sent to ${session.studentEmail}`);
        } else {
          console.error(`❌ Failed to send 15-minute reminder:`, result.error);
        }
      }

      // Check for 5-minute reminder
      if (minutesUntil <= 5 && minutesUntil > 4) {
        const notificationKey = `${session._id}_5`;
        
        // Check if already sent
        if (sentNotifications.has(notificationKey) || session.reminder5Sent) {
          continue;
        }

        console.log(`📧 Sending 5-minute reminder for session ${session._id}`);
        
        const result = await sendStudyReminder({
          studentEmail: session.studentEmail,
          studentName: session.studentName,
          sessionDate: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          courseName: session.courseName,
          diploma: session.diploma,
          plannedHours: session.plannedHours,
          minutesBefore: 5,
          notes: session.notes
        });

        if (result.success) {
          // Mark as sent in database
          session.reminder5Sent = true;
          session.reminder5SentAt = new Date();
          await session.save();
          
          // Add to in-memory set
          sentNotifications.add(notificationKey);
          
          console.log(`✅ 5-minute reminder sent to ${session.studentEmail}`);
        } else {
          console.error(`❌ Failed to send 5-minute reminder:`, result.error);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error checking upcoming sessions:', error);
  }
}

// Clean up old sent notifications from memory (runs daily)
function cleanupSentNotifications() {
  sentNotifications.clear();
  console.log('🧹 Cleaned up sent notifications cache');
}

// Start the notification scheduler
function startNotificationScheduler() {
  console.log('🚀 Starting notification scheduler...');

  // Check every minute for upcoming sessions
  cron.schedule('* * * * *', () => {
    checkUpcomingSessions();
  });

  // Clean up cache daily at midnight
  cron.schedule('0 0 * * *', () => {
    cleanupSentNotifications();
  });

  console.log('✅ Notification scheduler started!');
  console.log('   - Checking for reminders every minute');
  console.log('   - Will send emails 15 and 5 minutes before sessions');
}

// Stop the scheduler (for testing/development)
function stopNotificationScheduler() {
  cron.getTasks().forEach(task => task.stop());
  console.log('⏸️  Notification scheduler stopped');
}

module.exports = {
  startNotificationScheduler,
  stopNotificationScheduler,
  checkUpcomingSessions // Export for manual testing
};