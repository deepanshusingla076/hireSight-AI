const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const {
  analyzeResume,
  processResume,
  matchJob,
  getAIInsights,
  batchMatchJobs,
  getSkillGap,
  generateInterviewQuestions,
  checkMLServiceStatus
} = require('../controllers/analysis.controller');

/**
 * @route   POST /api/analyze
 * @desc    Complete resume analysis (Parse + Extract + Match + AI Insights)
 * @access  Public
 */
router.post('/analyze', upload.single('resume'), analyzeResume);

/**
 * @route   POST /api/process-resume
 * @desc    Parse resume and extract skills
 * @access  Public
 */
router.post('/process-resume', upload.single('resume'), processResume);

/**
 * @route   POST /api/match-job
 * @desc    Match resume skills to job requirements
 * @access  Public
 */
router.post('/match-job', matchJob);

/**
 * @route   POST /api/ai-insights
 * @desc    Get AI-powered resume insights using Gemini
 * @access  Public
 */
router.post('/ai-insights', getAIInsights);

/**
 * @route   POST /api/batch-match
 * @desc    Match resume against multiple job listings
 * @access  Public
 */
router.post('/batch-match', batchMatchJobs);

/**
 * @route   POST /api/skill-gap
 * @desc    Analyze skill gaps
 * @access  Public
 */
router.post('/skill-gap', getSkillGap);

/**
 * @route   POST /api/interview-questions
 * @desc    Generate AI-powered interview questions
 * @access  Public
 */
router.post('/interview-questions', generateInterviewQuestions);

/**
 * @route   GET /api/ml-status
 * @desc    Check Python ML service status
 * @access  Public
 */
router.get('/ml-status', checkMLServiceStatus);

module.exports = router;
