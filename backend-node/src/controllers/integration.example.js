/**
 * Integration Example
 * 
 * This file shows how to integrate ML service with the resume upload endpoint
 * 
 * To use this:
 * 1. Ensure ML service is running on port 8000
 * 2. Update resume.controller.js to call ML service after upload
 * 3. Return parsed text along with upload confirmation
 */

const resumeService = require('../services/resume.service');
const mlServiceClient = require('../services/mlService.client');

/**
 * Upload and Parse Resume (Example Integration)
 * @route POST /api/upload-and-parse-resume
 */
const uploadAndParseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please provide a PDF file.'
      });
    }

    // Step 1: Process upload
    const uploadResult = await resumeService.processUpload(req.file);

    // Step 2: Parse with ML service
    const parseResult = await mlServiceClient.parseResume(uploadResult.filePath);

    if (!parseResult.success) {
      return res.status(500).json({
        success: false,
        message: 'File uploaded but parsing failed',
        uploadData: uploadResult,
        parseError: parseResult.error
      });
    }

    // Step 3: Return combined result
    res.status(200).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: {
        upload: {
          filePath: uploadResult.filePath,
          filename: uploadResult.filename,
          originalName: uploadResult.originalName,
          size: uploadResult.size,
          uploadedAt: uploadResult.uploadedAt
        },
        parsed: {
          text: parseResult.data.data.text,
          wordCount: parseResult.data.data.word_count,
          charCount: parseResult.data.data.char_count
        },
        status: 'processed'
      }
    });
  } catch (error) {
    // Clean up file if processing failed
    if (req.file && req.file.path) {
      await resumeService.deleteResume(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process resume',
      status: 'failed'
    });
  }
};

/**
 * Check ML Service Status
 * @route GET /api/ml-status
 */
const checkMLServiceStatus = async (req, res) => {
  try {
    const healthCheck = await mlServiceClient.checkHealth();
    
    res.status(200).json({
      success: true,
      mlService: healthCheck.success ? 'online' : 'offline',
      data: healthCheck.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mlService: 'offline',
      message: error.message
    });
  }
};

module.exports = {
  uploadAndParseResume,
  checkMLServiceStatus
};
