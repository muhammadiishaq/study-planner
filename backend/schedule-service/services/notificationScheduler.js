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
    
    // Pakistan timezone offset (UTC+5)
    const PAKISTAN_OFFSET = 5 * 60; // 5 hours in minutes

    // Find sessions with notifications enabled
    const sessions = await StudySession.find({
      notificationsEnabled: true,
      status: { $in: ['not_started', 'in_progress'] }
    });

    console.log(`🔍 Checking ${sessions.length} sessions for reminders...`);

    for (const session of sessions) {
      try {
        // Parse session date (in UTC from database)
        const sessionDateUTC = new Date(session.date);
        const [hours, minutes] = session.startTime.split(':').map(Number);
        
        // Create session datetime in UTC
        const sessionDateTime = new Date(sessionDateUTC);
        sessionDateTime.setUTCHours(hours, minutes, 0, 0);
        
        // Subtract Pakistan offset to get the actual intended time
        // Because when user selects 11:28 AM PKT, it's saved as 06:28 AM UTC
        // We need to add back the offset
        sessionDateTime.setMinutes(sessionDateTime.getMinutes() - PAKISTAN_OFFSET);

        // Calculate minutes until session
        const minutesUntilSession = Math.floor((sessionDateTime - now) / 1000 / 60);

        console.log(`⏰ Session ${session._id.toString().slice(-6)}:`);
        console.log(`   Course: ${session.courseName}`);
        console.log(`   Start time from DB: ${session.startTime}`);
        console.log(`   Date from DB (UTC): ${sessionDateUTC.toISOString()}`);
        console.log(`   Calculated session time (PKT): ${sessionDateTime.toISOString()}`);
        console.log(`   Current time (UTC): ${now.toISOString()}`);
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

        // Disable notifications for past sessions (more than 1 hour ago)
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
  console.log('⏰ Timezone: Pakistan (UTC+5)');

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