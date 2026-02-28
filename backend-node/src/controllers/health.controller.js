/**
 * Health check controller
 * Returns the status of the API
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
};

module.exports = {
  getHealth
};
