const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Health check endpoint để kiểm tra trạng thái server
 */
router.get('/', (req, res) => {
  try {
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      server: 'Movie Streaming Backend',
      version: '1.0.0',
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      cors: {
        allowedOrigins: ['https://moviestreaming.io.vn', 'https://movie-streamming-be-v1.onrender.com'],
        credentials: true
      },
      endpoints: {
        googleLogin: '/api/auth/google-login',
        facebookLogin: '/api/auth/facebook-login',
        regularLogin: '/api/auth/login'
      }
    };

    console.log('Health check requested:', {
      timestamp: healthStatus.timestamp,
      origin: req.get('origin'),
      userAgent: req.get('user-agent')
    });

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * Endpoint để test CORS
 */
router.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.get('origin'),
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

/**
 * Endpoint để test Google login readiness
 */
router.get('/google-ready', (req, res) => {
  const googleConfig = {
    hasRequiredEnvVars: {
      FRONTEND_URL: !!process.env.FRONTEND_URL,
      BACKEND_URL: !!process.env.BACKEND_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      MONGODB_URI: !!process.env.MONGODB_URI
    },
    currentConfig: {
      frontendUrl: process.env.FRONTEND_URL,
      backendUrl: process.env.BACKEND_URL,
      nodeEnv: process.env.NODE_ENV
    },
    database: mongoose.connection.readyState === 1 ? 'Ready' : 'Not Ready'
  };

  const isReady = Object.values(googleConfig.hasRequiredEnvVars).every(val => val) && 
                  googleConfig.database === 'Ready';

  res.json({
    ready: isReady,
    ...googleConfig,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;