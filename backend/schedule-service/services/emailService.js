const nodemailer = require('nodemailer');

// Create email transporter
let transporter;

// Initialize email transporter based on configuration
function initializeTransporter() {
  // Option 1: Gmail (recommended for testing)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
  console.log('✅ Email service initialized with Gmail SMTP');
  console.log(`📧 Using email: ${process.env.EMAIL_USER}`);
    return true;
 }
  // Option 2: SendGrid (recommended for production)
  else if (process.env.SENDGRID_API_KEY) {
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
    console.log('✅ Email service initialized with SendGrid');
  }
  // Option 3: Custom SMTP
  else if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    console.log('✅ Email service initialized with custom SMTP');
  } else {
    console.warn('⚠️  No email configuration found. Emails will not be sent.');
    return false;
  }

  return true;
}

// Send study reminder email
async function sendStudyReminder(data) {
  const {
    studentEmail,
    studentName,
    sessionDate,
    startTime,
    endTime,
    courseName,
    diploma,
    plannedHours,
    minutesBefore,
    notes
  } = data;

  if (!transporter) {
    console.log('⚠️  Email transporter not initialized. Skipping email.');
    return { success: false, message: 'Email not configured' };
  }

  // Format date nicely
  const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Determine reminder type
  const reminderType = minutesBefore === 15 ? 'first' : 'final';
  const urgencyEmoji = minutesBefore === 15 ? '⏰' : '🚨';
  const urgencyText = minutesBefore === 15 ? 
    'Your study session starts in 15 minutes!' : 
    'Your study session starts in 5 minutes!';

  // Email subject
  const subject = `${urgencyEmoji} Study Reminder - ${minutesBefore} minutes until your session!`;

  // Email HTML template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 18px;
    }
    .content {
      background: white;
      padding: 30px;
      border: 2px solid #667eea;
      border-top: none;
      border-radius: 0 0 10px 10px;
    }
    .alert-box {
      background: ${minutesBefore === 15 ? '#fff3cd' : '#f8d7da'};
      border-left: 4px solid ${minutesBefore === 15 ? '#ffc107' : '#dc3545'};
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .alert-box h2 {
      margin: 0 0 10px 0;
      color: ${minutesBefore === 15 ? '#856404' : '#721c24'};
      font-size: 20px;
    }
    .session-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #dee2e6;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: bold;
      width: 140px;
      color: #667eea;
    }
    .detail-value {
      flex: 1;
      color: #333;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #dee2e6;
      color: #6c757d;
      font-size: 14px;
    }
    .tips {
      background: #e7f3ff;
      border-left: 4px solid #2196F3;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .tips h3 {
      margin: 0 0 10px 0;
      color: #1976D2;
    }
    .tips ul {
      margin: 10px 0;
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${urgencyEmoji} Study Session Reminder</h1>
    <p>${urgencyText}</p>
  </div>
  
  <div class="content">
    <p>Assalamu Alaikum <strong>${studentName}</strong>,</p>
    
    <div class="alert-box">
      <h2>${minutesBefore === 15 ? '⏰ Get Ready!' : '🚨 Time to Start!'}</h2>
      <p>
        ${minutesBefore === 15 ? 
          'Your study session is coming up soon. Start preparing your materials!' : 
          'Your study session is starting NOW! Time to focus and learn!'}
      </p>
    </div>

    <div class="session-details">
      <h3 style="margin-top: 0; color: #667eea;">📚 Session Details:</h3>
      
      <div class="detail-row">
        <div class="detail-label">📅 Date:</div>
        <div class="detail-value">${formattedDate}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">⏰ Time:</div>
        <div class="detail-value">${startTime} - ${endTime}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">📚 Course:</div>
        <div class="detail-value"><strong>${courseName}</strong></div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">🏷️ Diploma:</div>
        <div class="detail-value">${diploma}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">⏱️ Duration:</div>
        <div class="detail-value">${plannedHours} hour${plannedHours !== 1 ? 's' : ''}</div>
      </div>
      
      ${notes ? `
      <div class="detail-row">
        <div class="detail-label">📝 Notes:</div>
        <div class="detail-value">${notes}</div>
      </div>
      ` : ''}
    </div>

    ${minutesBefore === 15 ? `
    <div class="tips">
      <h3>💡 Quick Preparation Tips:</h3>
      <ul>
        <li>📱 Turn off phone notifications</li>
        <li>💧 Get a glass of water</li>
        <li>📖 Open your course materials</li>
        <li>🎧 Prepare your headphones</li>
        <li>🪑 Sit in a comfortable position</li>
      </ul>
    </div>
    ` : `
    <div class="tips">
      <h3>🎯 Time to Focus!</h3>
      <ul>
        <li>✅ Remove all distractions</li>
        <li>✅ Open your AlNafi dashboard</li>
        <li>✅ Start your study session</li>
        <li>✅ Focus for the full ${plannedHours} hours</li>
      </ul>
    </div>
    `}

    <center>
      <a href="https://study-planner-xi-two.vercel.app/scheduler" class="cta-button" style="color: white;">
        📅 View My Schedule
      </a>
    </center>

    <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
      <em>"The best time to start is now. May Allah bless your learning journey!" 🤲</em>
    </p>
  </div>

  <div class="footer">
    <p><strong>AlNafi Study Planner</strong></p>
    <p>Helping students achieve their goals through organized study sessions</p>
    <p style="margin-top: 15px;">
      📧 ${process.env.EMAIL_USER || 'support@alnafi.com'}<br>
      📍 AlNafi International College<br>
      D-182, Block 7, Gulshan-e-Iqbal, Karachi
    </p>
    <p style="margin-top: 15px; font-size: 12px; color: #adb5bd;">
      You received this email because you enabled notifications for your study session.<br>
      To stop receiving these emails, disable notifications for your sessions in the scheduler.
    </p>
  </div>
</body>
</html>
  `;

  // Plain text version
  const textContent = `
${urgencyText}

Assalamu Alaikum ${studentName},

${minutesBefore === 15 ? 
  'Your study session is coming up in 15 minutes. Start preparing!' : 
  'Your study session is starting NOW! Time to focus!'}

Session Details:
- Date: ${formattedDate}
- Time: ${startTime} - ${endTime}
- Course: ${courseName}
- Diploma: ${diploma}
- Duration: ${plannedHours} hour(s)
${notes ? `- Notes: ${notes}` : ''}

${minutesBefore === 15 ? 
  'Quick tips: Turn off notifications, get water, prepare materials!' : 
  'Time to start! Remove distractions and focus on learning!'}

View your schedule: https://study-planner-xi-two.vercel.app/scheduler

May Allah bless your learning journey! 🤲

---
AlNafi Study Planner
${process.env.EMAIL_USER || 'support@alnafi.com'}
  `;

  // Email options
  const mailOptions = {
    from: `"AlNafi Study Planner" <${process.env.EMAIL_USER || 'noreply@alnafi.com'}>`,
    to: studentEmail,
    subject: subject,
    text: textContent,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${studentEmail}: ${minutesBefore}-min reminder`);
    console.log('   Message ID:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      minutesBefore 
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Send test email
async function sendTestEmail(studentEmail, studentName) {
  return await sendStudyReminder({
    studentEmail,
    studentName: studentName || 'Test Student',
    sessionDate: new Date(),
    startTime: '14:00',
    endTime: '16:00',
    courseName: 'Python Deep Dive - Test',
    diploma: 'Cyber Security',
    plannedHours: 2,
    minutesBefore: 15,
    notes: 'This is a test email from AlNafi Study Planner'
  });
}

module.exports = {
  initializeTransporter,
  sendStudyReminder,
  sendTestEmail
};