const express = require('express');
const router = express.Router();
const healthRoutes = require('./health.routes');
const resumeRoutes = require('./resume.routes');
const analysisRoutes = require('./analysis.routes');

// Health check route
router.use('/health', healthRoutes);

// Resume upload route
router.use('/upload-resume', resumeRoutes);

// AI-powered analysis routes
router.use('/api', analysisRoutes);

// Welcome route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HireSight AI API',
    version: '1.0.0'
  });
});

module.exports = router;
