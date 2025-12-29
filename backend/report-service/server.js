require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// CORS Configuration
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
    console.log('✅ Report Service: MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ Report Service: MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/reports', reportRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Report Service',
    status: 'running',
    port: process.env.PORT || 5002,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Report Service',
    message: 'Service is running',
    endpoints: {
      health: '/health',
      api: '/api/reports'
    }
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
    message: err.message || 'Internal server error'
  });
});

// Start Server - Railway provides PORT
const PORT = process.env.PORT || 5002;

app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log('🚀 Report Service Started!');
  console.log('='.repeat(60));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
});