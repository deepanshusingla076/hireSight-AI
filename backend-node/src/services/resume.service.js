const path = require('path');
const fs = require('fs');
const { logInfo, logError } = require('../utils/logger');

/**
 * Resume Service
 * Handles resume processing business logic
 */
class ResumeService {
  /**
   * Process uploaded resume
   * @param {Object} file - Multer file object
   * @returns {Object} - Processing result
   */
  async processUpload(file) {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      logInfo('Resume uploaded successfully', { filename: file.filename });

      return {
        success: true,
        filename: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      logError('Error processing resume upload', error);
      throw error;
    }
  }

  /**
   * Delete uploaded resume
   * @param {string} filePath - Path to the file
   */
  async deleteResume(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logInfo('Resume deleted', { filePath });
        return true;
      }
      return false;
    } catch (error) {
      logError('Error deleting resume', error);
      throw error;
    }
  }

  /**
   * Validate resume file
   * @param {Object} file - Multer file object
   * @returns {boolean} - Validation result
   */
  validateResume(file) {
    if (!file) {
      return false;
    }

    // Check file type
    if (file.mimetype !== 'application/pdf') {
      return false;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return false;
    }

    return true;
  }
}

module.exports = new ResumeService();
