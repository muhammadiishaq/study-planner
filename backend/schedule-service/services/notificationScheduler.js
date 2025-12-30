const cron = require('node-cron');
const StudySession = require('../models/StudySession');
const { sendReminderEmail } = require('./emailService');

let schedulerTask = null;

/**
 * Check for upcoming sessions and send reminder emails
 */
async function checkUpcomingSessions() {
  try {
    const now = new Date();

    // Find sessions with notifications enabled
    const sessions = await StudySession.find({
      notificationsEnabled: true,
      status: { $in: ['not_started', 'in_progress'] }
    });

    console.log(`🔍 Checking ${sessions.length} sessions for reminders...`);

    for (const session of sessions) {
      try {
        // Parse session date and time
        const sessionDate = new Date(session.date);
        const [hours, minutes] = session.startTime.split(':').map(Number);
        
        // Create session datetime
        // Important: Use the DATE from session.date, but set TIME as local hours
        const sessionDateTime = new Date(sessionDate);
        sessionDateTime.setHours(hours, minutes, 0, 0);

        // Calculate minutes until session
        const minutesUntilSession = Math.floor((sessionDateTime - now) / 1000 / 60);

        console.log(`⏰ Session ${session._id.toString().slice(-6)}:`);
        console.log(`   Course: ${session.courseName}`);
        console.log(`   Session time: ${sessionDateTime.toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}`);
        console.log(`   Current time: ${now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}`);
        console.log(`   Minutes until: ${minutesUntilSession} minutes`);

        // Send 15-minute reminder
        if (!session.reminder15Sent && minutesUntilSession >= 14 && minutesUntilSession <= 16) {
          console.log(`📧 Sending 15-minute reminder...`);
          
          const emailResult = await sendReminderEmail(
            session.studentEmail,
            session.studentName,
            session.courseName,
            session.diploma,
            session.startTime,
            session.plannedHours,
            15
          );

          if (emailResult.success) {
            session.reminder15Sent = true;
            session.reminder15SentAt = new Date();
            await session.save();
            console.log(`✅ 15-minute reminder sent to ${session.studentEmail}`);
          } else {
            console.error(`❌ Failed to send: ${emailResult.error}`);
          }
        }

        // Send 5-minute reminder
        if (!session.reminder5Sent && minutesUntilSession >= 4 && minutesUntilSession <= 6) {
          console.log(`📧 Sending 5-minute reminder...`);
          
          const emailResult = await sendReminderEmail(
            session.studentEmail,
            session.studentName,
            session.courseName,
            session.diploma,
            session.startTime,
            session.plannedHours,
            5
          );

          if (emailResult.success) {
            session.reminder5Sent = true;
            session.reminder5SentAt = new Date();
            await session.save();
            console.log(`✅ 5-minute reminder sent to ${session.studentEmail}`);
          } else {
            console.error(`❌ Failed to send: ${emailResult.error}`);
          }
        }

        // Disable notifications for past sessions
        if (minutesUntilSession < -60) {
          session.notificationsEnabled = false;
          await session.save();
          console.log(`⏭️  Session passed, notifications disabled`);
        }

      } catch (error) {
        console.error(`❌ Error processing session:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error checking sessions:', error.message);
  }
}

/**
 * Start the notification scheduler
 */
function startNotificationScheduler() {
  if (schedulerTask) {
    console.log('⚠️  Scheduler already running');
    return;
  }

  console.log('🚀 Starting notification scheduler...');

  // Run every minute
  schedulerTask = cron.schedule('* * * * *', async () => {
    await checkUpcomingSessions();
  });

  console.log('✅ Notification scheduler started!');
  console.log('   - Checking every minute');
  console.log('   - Sending at 15 and 5 minutes before');

  // Run immediately
  checkUpcomingSessions();
}

/**
 * Stop the notification scheduler
 */
function stopNotificationScheduler() {
  if (schedulerTask) {
    schedulerTask.stop();
    schedulerTask = null;
    console.log('⏹️  Scheduler stopped');
  }
}

module.exports = {
  startNotificationScheduler,
  stopNotificationScheduler,
  checkUpcomingSessions
};