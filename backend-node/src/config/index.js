require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiPrefix: process.env.API_PREFIX || '/api',
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000'
};
