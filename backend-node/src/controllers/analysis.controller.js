const pythonClient = require('../services/pythonClient');

/**
 * Analysis Controller
 * Handles integrated resume analysis using Python ML service
 */

/**
 * Complete resume analysis workflow
 * @route POST /api/analyze
 */
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required'
      });
    }

    // Call Python service for complete analysis
    const result = await pythonClient.completeAnalysis(
      req.file.path,
      jobDescription
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Analysis failed',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume analysis completed successfully',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume'
    });
  }
};

/**
 * Parse resume and extract skills
 * @route POST /api/process-resume
 */
const processResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    // Parse and extract skills from resume
    const result = await pythonClient.parseAndExtract(req.file.path);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Processing failed',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume processed successfully',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process resume'
    });
  }
};

/**
 * Match resume to job
 * @route POST /api/match-job
 */
const matchJob = async (req, res) => {
  try {
    const { resumeSkills, jobDescription, jobSkills } = req.body;

    if (!resumeSkills || (!jobDescription && !jobSkills)) {
      return res.status(400).json({
        success: false,
        message: 'Resume skills and job description/skills are required'
      });
    }

    const result = await pythonClient.matchResumeToJob(
      resumeSkills,
      jobDescription,
      jobSkills
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Matching failed',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Match calculation completed',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate match'
    });
  }
};

/**
 * Get AI-powered resume insights
 * @route POST /api/ai-insights
 */
const getAIInsights = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume text and job description are required'
      });
    }

    const result = await pythonClient.analyzeWithGemini(
      resumeText,
      jobDescription
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'AI analysis failed',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'AI insights generated successfully',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI insights'
    });
  }
};

/**
 * Batch match resume against multiple jobs
 * @route POST /api/batch-match
 */
const batchMatchJobs = async (req, res) => {
  try {
    const { resumeSkills, jobListings } = req.body;

    if (!resumeSkills || !jobListings || !Array.isArray(jobListings)) {
      return res.status(400).json({
        success: false,
        message: 'Resume skills and job listings array are required'
      });
    }

    const result = await pythonClient.batchMatch(resumeSkills, jobListings);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Batch matching failed',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Batch matching completed',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to batch match'
    });
  }
};

/**
 * Get skill gap analysis
 * @route POST /api/skill-gap
 */
const getSkillGap = async (req, res) => {
  try {
    const { resumeSkills, targetSkills } = req.body;

    if (!resumeSkills || !targetSkills) {
      return res.status(400).json({
        success: false,
        message: 'Resume skills and target skills are required'
      });
    }

    const result = await pythonClient.getSkillGap(resumeSkills, targetSkills);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Skill gap analysis failed',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill gap analysis completed',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze skill gap'
    });
  }
};

/**
 * Generate interview questions
 * @route POST /api/interview-questions
 */
const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeText, jobDescription, numQuestions } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume text and job description are required'
      });
    }

    const result = await pythonClient.generateInterviewQuestions(
      resumeText,
      jobDescription,
      numQuestions || 5
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Question generation failed',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview questions generated',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate questions'
    });
  }
};

/**
 * Check ML service status
 * @route GET /api/ml-status
 */
const checkMLServiceStatus = async (req, res) => {
  try {
    const result = await pythonClient.checkHealth();

    res.status(result.success ? 200 : 503).json({
      success: result.success,
      message: result.success ? 'ML Service is healthy' : 'ML Service is unavailable',
      data: result
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'ML Service is unavailable',
      error: error.message
    });
  }
};

module.exports = {
  analyzeResume,
  processResume,
  matchJob,
  getAIInsights,
  batchMatchJobs,
  getSkillGap,
  generateInterviewQuestions,
  checkMLServiceStatus
};
