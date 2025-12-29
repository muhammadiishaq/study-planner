require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scheduleRoutes = require('./routes/scheduleRoutes');
const { initializeTransporter } = require('./services/emailService');
const { startNotificationScheduler } = require('./services/notificationScheduler');

const app = express();

// ✅ CORS Configuration - Allow Vercel
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://study-planner-xi-two.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Schedule Service: MongoDB connected successfully');
    
    // Initialize email service after DB connection
    const emailInitialized = initializeTransporter();
    
    if (emailInitialized) {
      // Start notification scheduler
      startNotificationScheduler();
    } else {
      console.warn('⚠️  Email service not configured. Notifications will not be sent.');
      console.warn('   Add EMAIL_USER and EMAIL_PASSWORD to .env to enable notifications.');
    }
  })
  .catch((err) => {
    console.error('❌ Schedule Service: MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/schedule', scheduleRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Schedule Service',
    status: 'running',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Schedule Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/schedule`);
  console.log(`📅 Study Scheduler with Email Notifications is ready! Alhamdulillah! 🤲`);
});