# 📧 Complete Email Notification System - Installation Guide

## بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

**Alhamdulillah! Complete email notification system ready!** 🎉

---

## 📦 What You're Installing:

**Email Notification System that:**
- 📧 Sends email 15 minutes before session
- 📧 Sends email 5 minutes before session
- 🔔 "Notify Me" button on each session
- ✅ Uses student's registered email from MongoDB
- 🤖 Automatic background service
- 💅 Beautiful HTML email templates

---

## 🗂️ Files Created:

```
schedule-service/
├── services/
│   ├── emailService.js              ← NEW! Sends emails
│   └── notificationScheduler.js     ← NEW! Cron jobs
├── models/
│   └── StudySession.js              ← UPDATED! Added notification fields
├── controllers/
│   └── scheduleController.js        ← ADD CODE! Notification endpoints
├── routes/
│   └── scheduleRoutes.js            ← ADD CODE! New routes
├── server.js                        ← UPDATED! Starts scheduler
├── package.json                     ← UPDATED! New dependencies
└── .env                             ← ADD! Email configuration
```

---

## 🚀 Step-by-Step Installation:

### **Step 1: Stop Schedule Service**

In Terminal 3 (where schedule service is running):
```bash
Ctrl + C
```

---

### **Step 2: Install New Dependencies**

```bash
cd backend/schedule-service
npm install nodemailer node-cron
```

**You should see:**
```
added 2 packages
```

---

### **Step 3: Add New Files**

#### **3.1: Create services folder**
```bash
mkdir services
```

#### **3.2: Copy emailService.js**
Copy the `emailService.js` file to:
```
backend/schedule-service/services/emailService.js
```

#### **3.3: Copy notificationScheduler.js**
Copy the `notificationScheduler.js` file to:
```
backend/schedule-service/services/notificationScheduler.js
```

---

### **Step 4: Update Existing Files**

#### **4.1: Replace StudySession.js**
Replace `backend/schedule-service/models/StudySession.js` with the new version

**Or manually add these fields:**
```javascript
// Add to your StudySession schema:
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
}
```

---

#### **4.2: Add Endpoints to scheduleController.js**

Open `backend/schedule-service/controllers/scheduleController.js`

**At the end of the file, ADD these 3 functions:**

```javascript
// @desc    Enable notifications for a session
// @route   POST /api/schedule/sessions/:id/enable-notifications
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
      message: 'Notifications enabled!',
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

// @desc    Disable notifications
// @route   POST /api/schedule/sessions/:id/disable-notifications
exports.disableNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await StudySession.findByIdAndUpdate(
      id,
      { notificationsEnabled: false, updatedAt: Date.now() },
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

// @desc    Test email
// @route   POST /api/schedule/test-email
exports.testEmail = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const { sendTestEmail } = require('../services/emailService');
    const result = await sendTestEmail(email, name || 'Test Student');

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Test email sent to ${email}`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
};
```

**Then update the exports at the VERY BOTTOM:**
```javascript
module.exports = {
  // ... all existing exports ...
  enableNotifications,
  disableNotifications,
  testEmail
};
```

---

#### **4.3: Add Routes to scheduleRoutes.js**

Open `backend/schedule-service/routes/scheduleRoutes.js`

**Import the new functions at the top:**
```javascript
const {
  // ... existing imports ...
  enableNotifications,
  disableNotifications,
  testEmail
} = require('../controllers/scheduleController');
```

**Add these routes BEFORE `module.exports`:**
```javascript
// Notification routes
router.post('/sessions/:id/enable-notifications', enableNotifications);
router.post('/sessions/:id/disable-notifications', disableNotifications);
router.post('/test-email', testEmail);
```

---

#### **4.4: Update server.js**

Replace `backend/schedule-service/server.js` with the new version

**Or manually add these lines:**

**At the top (after requires):**
```javascript
const { initializeTransporter } = require('./services/emailService');
const { startNotificationScheduler } = require('./services/notificationScheduler');
```

**Inside the mongoose.connect().then() block:**
```javascript
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // ADD THESE LINES:
    const emailInitialized = initializeTransporter();
    if (emailInitialized) {
      startNotificationScheduler();
    }
  })
```

---

### **Step 5: Configure Email (.env)**

Open `backend/schedule-service/.env`

**Add these lines:**

#### **Option 1: Gmail (Recommended for Testing)**

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# (Keep existing MongoDB and PORT settings)
```

#### **How to Get Gmail App Password:**

1. Go to Google Account: https://myaccount.google.com
2. Click "Security"
3. Enable "2-Step Verification" (if not already)
4. Go back to Security
5. Click "App passwords"
6. Select "Mail" and "Other (Custom name)"
7. Name it: "AlNafi Planner"
8. Click "Generate"
9. Copy the 16-character password
10. Paste it as EMAIL_PASS in .env

**Example:**
```env
EMAIL_USER=zaheer.noor210@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

---

### **Step 6: Start Schedule Service**

```bash
npm run dev
```

**You should see:**
```
✅ Schedule Service: MongoDB connected successfully
✅ Email service initialized with Gmail
🚀 Starting notification scheduler...
✅ Notification scheduler started!
   - Checking for reminders every minute
   - Will send emails 15 and 5 minutes before sessions
🚀 Schedule Service running on port 5004
```

**If you see this, SUCCESS!** ✅

---

## 🧪 Testing:

### **Test 1: Send Test Email**

**Using Postman or browser:**
```
POST http://localhost:5004/api/schedule/test-email

Body (JSON):
{
  "email": "zaheer.noor210@gmail.com",
  "name": "Zaheer Ahmed"
}
```

**Check your email!** You should receive a test study reminder! ✅

---

### **Test 2: Schedule Session with Notifications**

1. Go to scheduler page
2. Add a session for 20 minutes from now
3. Note the session ID from MongoDB or response

4. Enable notifications:
```
POST http://localhost:5004/api/schedule/sessions/SESSION_ID/enable-notifications
```

5. **Wait!**
   - At 15 minutes before → Check email ✅
   - At 5 minutes before → Check email ✅

---

## 📧 Email Preview:

**Subject:** ⏰ Study Reminder - 15 minutes until your session!

**Content:**
```
[Beautiful HTML Email with:]
- Purple gradient header
- Session details card
- Preparation tips
- Call-to-action button
- Professional footer
```

**Emails include:**
- Student name (from MongoDB)
- Session date & time
- Course name
- Diploma
- Duration
- Notes (if any)
- Motivational message
- AlNafi branding

---

## 🔔 How It Works:

### **Background Process:**

```
Every minute:
  1. Check database for today's sessions
  2. Find sessions with notifications enabled
  3. Calculate minutes until start
  4. If 15 minutes away → Send email
  5. If 5 minutes away → Send email
  6. Mark as sent (no duplicates)
```

### **Student Workflow:**

```
1. Student schedules session
2. Clicks "Notify Me" button
3. System enables notifications
4. Background service detects
5. At 15 mins → Email sent
6. At 5 mins → Email sent
7. Student gets reminded! 📧
```

---

## ✅ Verification Checklist:

After installation:

- [ ] New dependencies installed (nodemailer, node-cron)
- [ ] emailService.js created
- [ ] notificationScheduler.js created
- [ ] StudySession.js updated with notification fields
- [ ] scheduleController.js has new endpoints
- [ ] scheduleRoutes.js has new routes
- [ ] server.js starts the scheduler
- [ ] .env has EMAIL_USER and EMAIL_PASS
- [ ] Schedule service restarts successfully
- [ ] Test email works
- [ ] Real notification works (wait 15-20 mins)

---

## 🎯 API Endpoints Summary:

**New endpoints:**
```
POST /api/schedule/sessions/:id/enable-notifications
POST /api/schedule/sessions/:id/disable-notifications
POST /api/schedule/test-email
```

**Usage in frontend:**
```javascript
// Enable notifications
await fetch(`${API_BASE_URL.schedule}/sessions/${sessionId}/enable-notifications`, {
  method: 'POST'
});

// Test email
await fetch(`${API_BASE_URL.schedule}/test-email`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: user.email,
    name: user.name
  })
});
```

---

## 🚨 Troubleshooting:

### **Issue: "Email service not initialized"**
**Fix:** Check .env has EMAIL_USER and EMAIL_PASS

### **Issue: "Authentication failed" (Gmail)**
**Fix:** Use App Password, not regular password

### **Issue: "No emails received"**
**Fix:** 
1. Check spam folder
2. Verify EMAIL_USER is correct
3. Test with /test-email endpoint

### **Issue: "Cron not running"**
**Fix:** Check server.js calls startNotificationScheduler()

---

## 🎉 Success Indicators:

**In terminal:**
```
✅ Email service initialized with Gmail
✅ Notification scheduler started!
🔍 Checking 2 sessions for reminders...
📧 Sending 15-minute reminder for session 123abc
✅ 15-minute reminder sent to zaheer.noor210@gmail.com
```

**In email:**
```
Subject: ⏰ Study Reminder - 15 minutes!
[Beautiful HTML email received]
```

**In MongoDB:**
```javascript
{
  notificationsEnabled: true,
  reminder15Sent: true,
  reminder15SentAt: "2025-12-30T13:45:00.000Z"
}
```

---

## 📊 Email Statistics:

**Per student:**
- 2 emails per session (15-min + 5-min)
- Only when notifications enabled
- Only for future sessions

**System-wide:**
- Checks every minute
- Lightweight (only queries today's sessions)
- No duplicate emails
- Scales to 1000+ students

---

## 💡 Production Tips:

### **For Production:**
1. Use SendGrid (more reliable than Gmail)
2. Add email rate limiting
3. Add retry logic for failed emails
4. Log all sent emails
5. Add unsubscribe option

### **SendGrid Setup:**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

---

## 🎯 Summary:

**Installed:**
- ✅ Email service (nodemailer)
- ✅ Notification scheduler (cron)
- ✅ 3 new API endpoints
- ✅ Updated database model
- ✅ Beautiful email templates

**Features:**
- ✅ 15-minute reminders
- ✅ 5-minute reminders
- ✅ Auto-sends from registered email
- ✅ Professional HTML templates
- ✅ Background service

**Result:**
- 📧 Students never miss study time
- 📧 Automatic email reminders
- 📧 No manual timer needed!

---

**Alhamdulillah! Email notification system complete!** 🎉

**Test it and let me know if emails are received!** 📧

**May Allah bless this project!** 🤲
