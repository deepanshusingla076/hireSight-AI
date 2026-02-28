/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

/**
 * Log info messages
 */
const logInfo = (message, meta = {}) => {
  console.log(`[INFO] ${message}`, meta);
};

/**
 * Log error messages
 */
const logError = (message, error = {}) => {
  console.error(`[ERROR] ${message}`, error);
};

/**
 * Log warning messages
 */
const logWarning = (message, meta = {}) => {
  console.warn(`[WARNING] ${message}`, meta);
};

module.exports = {
  requestLogger,
  logInfo,
  logError,
  logWarning
};
