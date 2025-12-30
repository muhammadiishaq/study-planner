const nodemailer = require('nodemailer');

let transporter;
let brevoClient;

function initializeTransporter() {
  console.log('🔍 Checking email configuration...');
  console.log('   BREVO_API_KEY:', process.env.BREVO_API_KEY ? '***SET***' : 'NOT SET ❌');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET ❌');

  // Option 1: Brevo API (BEST for Railway!)
  if (process.env.BREVO_API_KEY) {
    try {
      const SibApiV3Sdk = require('@getbrevo/brevo');
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      
      const apiKey = apiInstance.authentications['apiKey'];
      apiKey.apiKey = process.env.BREVO_API_KEY;
      
      brevoClient = apiInstance;
      console.log('✅ Email service initialized with Brevo API');
      console.log(`   📧 Sending from: ${process.env.EMAIL_USER}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Brevo API:', error.message);
      console.error('   Run: npm install @getbrevo/brevo');
    }
  }

  // Option 2: Custom SMTP (Brevo, Mailgun, etc.)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    console.log('✅ Using Custom SMTP');
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      console.log('✅ Email service initialized with Custom SMTP');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize SMTP:', error.message);
    }
  }

  // Option 3: Gmail (fallback)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    console.log('✅ Using Gmail SMTP');
    try {
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      console.log('✅ Email service initialized with Gmail');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Gmail:', error.message);
    }
  }

  console.warn('⚠️  No email configuration found. Emails will not be sent.');
  console.warn('   Please set BREVO_API_KEY or SMTP credentials');
  return false;
}

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

  if (!brevoClient && !transporter) {
    console.log('⚠️  Email service not initialized. Skipping email.');
    return { success: false, message: 'Email not configured' };
  }

  const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const urgencyEmoji = minutesBefore === 15 ? '⏰' : '🚨';
  const urgencyText = minutesBefore === 15 ? 
    'Your study session starts in 15 minutes!' : 
    'Your study session starts in 5 minutes!';

  const subject = `${urgencyEmoji} Study Reminder - ${minutesBefore} minutes!`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: white; padding: 30px; border: 2px solid #667eea; border-top: none; border-radius: 0 0 10px 10px; }
    .alert-box { background: ${minutesBefore === 15 ? '#fff3cd' : '#f8d7da'}; border-left: 4px solid ${minutesBefore === 15 ? '#ffc107' : '#dc3545'}; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .alert-box h2 { margin: 0 0 10px 0; color: ${minutesBefore === 15 ? '#856404' : '#721c24'}; font-size: 20px; }
    .session-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #dee2e6; }
    .detail-row:last-child { border-bottom: none; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; color: #6c757d; font-size: 14px; }
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
      <p>${minutesBefore === 15 ? 'Your session is coming up soon!' : 'Your session starts NOW!'}</p>
    </div>
    <div class="session-details">
      <h3>📚 Session Details:</h3>
      <div class="detail-row"><strong>📅 Date:</strong> ${formattedDate}</div>
      <div class="detail-row"><strong>⏰ Time:</strong> ${startTime} - ${endTime}</div>
      <div class="detail-row"><strong>📚 Course:</strong> ${courseName}</div>
      <div class="detail-row"><strong>🏷️ Diploma:</strong> ${diploma}</div>
      <div class="detail-row"><strong>⏱️ Duration:</strong> ${plannedHours} hours</div>
      ${notes ? `<div class="detail-row"><strong>📝 Notes:</strong> ${notes}</div>` : ''}
    </div>
    <p style="margin-top: 30px; color: #6c757d;"><em>"May Allah bless your learning journey!" 🤲</em></p>
  </div>
  <div class="footer">
    <p><strong>AlNafi Study Planner</strong></p>
    <p>📧 ${process.env.EMAIL_USER}</p>
  </div>
</body>
</html>
  `;

  try {
    // Use Brevo API if available
    if (brevoClient) {
      const SibApiV3Sdk = require('@getbrevo/brevo');
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.sender = { 
        name: "AlNafi Study Planner", 
        email: process.env.EMAIL_USER 
      };
      sendSmtpEmail.to = [{ email: studentEmail, name: studentName }];
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;

      const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
      console.log(`✅ Email sent to ${studentEmail}: ${minutesBefore}-min reminder`);
      console.log('   Message ID:', result.messageId);
      return { success: true, messageId: result.messageId };
    }
    
    // Fallback to SMTP
    if (transporter) {
      const mailOptions = {
        from: `"AlNafi Study Planner" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
        to: studentEmail,
        subject: subject,
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${studentEmail}: ${minutesBefore}-min reminder`);
      console.log('   Message ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    }

    return { success: false, error: 'No email service configured' };
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
}

async function sendTestEmail(studentEmail, studentName) {
  return await sendStudyReminder({
    studentEmail,
    studentName: studentName || 'Test Student',
    sessionDate: new Date(),
    startTime: '14:00',
    endTime: '16:00',
    courseName: 'Test Course',
    diploma: 'Test Diploma',
    plannedHours: 2,
    minutesBefore: 15,
    notes: 'Test email from AlNafi Study Planner'
  });
}

module.exports = {
  initializeTransporter,
  sendStudyReminder,
  sendTestEmail
};