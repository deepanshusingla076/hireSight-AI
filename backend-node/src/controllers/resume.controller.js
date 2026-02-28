const resumeService = require('../services/resume.service');

/**
 * Resume Controller
 * Handles HTTP requests for resume operations
 */

/**
 * Upload resume
 * @route POST /api/upload-resume
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please provide a PDF file.'
      });
    }

    const result = await resumeService.processUpload(req.file);

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        filePath: result.filePath,
        filename: result.filename,
        originalName: result.originalName,
        size: result.size,
        uploadedAt: result.uploadedAt,
        status: 'uploaded'
      }
    });
  } catch (error) {
    // Clean up file if processing failed
    if (req.file && req.file.path) {
      await resumeService.deleteResume(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resume',
      status: 'failed'
    });
  }
};

module.exports = {
  uploadResume
};
