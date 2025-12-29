# 📧 Notification Endpoints - Add to scheduleController.js

Add these functions to your `controllers/scheduleController.js`:

```javascript
// @desc    Enable notifications for a session
// @route   POST /api/schedule/sessions/:id/enable-notifications
// @access  Private
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

    // Enable notifications
    session.notificationsEnabled = true;
    session.reminder15Sent = false;
    session.reminder5Sent = false;
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Notifications enabled! You will receive emails 15 and 5 minutes before your session.',
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

// @desc    Disable notifications for a session
// @route   POST /api/schedule/sessions/:id/disable-notifications
// @access  Private
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

// @desc    Test email notification (for testing only)
// @route   POST /api/schedule/test-email
// @access  Private
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
        message: `Test email sent to ${email}`,
        messageId: result.messageId
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

## Add to routes/scheduleRoutes.js:

```javascript
// Add these routes
router.post('/sessions/:id/enable-notifications', enableNotifications);
router.post('/sessions/:id/disable-notifications', disableNotifications);
router.post('/test-email', testEmail);
```

## Update the exports in scheduleController.js:

```javascript
module.exports = {
  // ... existing exports ...
  enableNotifications,
  disableNotifications,
  testEmail
};
```
