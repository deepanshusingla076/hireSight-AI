const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { uploadResume } = require('../controllers/resume.controller');

/**
 * @route   POST /api/upload-resume
 * @desc    Upload resume (PDF only)
 * @access  Public
 */
router.post('/', upload.single('resume'), uploadResume);

module.exports = router;
