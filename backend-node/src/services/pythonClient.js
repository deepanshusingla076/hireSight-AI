const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config');
const { logInfo, logError } = require('../utils/logger');

/**
 * Python FastAPI Service Client
 * Handles all communication with the Python ML microservice
 */
class PythonClient {
  constructor() {
    this.baseURL = config.mlServiceUrl;
    this.timeout = 60000; // 60 seconds for AI operations
  }

  /**
   * Check if Python ML service is available
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000
      });
      
      return {
        success: true,
        status: response.data.status,
        service: response.data.service
      };
    } catch (error) {
      logError('ML Service health check failed', error);
      return {
        success: false,
        error: 'ML Service is unavailable',
        details: error.message
      };
    }
  }

  /**
   * Parse PDF resume and extract text
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<Object>} Parsed text and metadata
   */
  async parseResume(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      logInfo(`Sending resume to ML service for parsing: ${filePath}`);

      const response = await axios.post(
        `${this.baseURL}/parse-resume`,
        form,
        {
          headers: {
            ...form.getHeaders()
          },
          timeout: this.timeout
        }
      );

      logInfo('Resume parsed successfully');

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error parsing resume', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Extract skills from text
   * @param {string} text - Text to analyze
   * @returns {Promise<Object>} Extracted skills
   */
  async extractSkills(text) {
    try {
      logInfo('Sending text for skill extraction');

      const response = await axios.post(
        `${this.baseURL}/extract-skills`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      logInfo(`Extracted ${response.data.data.skill_count} skills`);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error extracting skills', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Parse resume and extract skills in one call
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<Object>} Text + extracted skills
   */
  async parseAndExtract(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      logInfo(`Sending resume for parsing and skill extraction: ${filePath}`);

      const response = await axios.post(
        `${this.baseURL}/parse-and-extract`,
        form,
        {
          headers: {
            ...form.getHeaders()
          },
          timeout: this.timeout
        }
      );

      logInfo('Resume parsed and skills extracted successfully');

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error in parse and extract', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Match resume skills to job requirements
   * @param {Array<string>} resumeSkills - Skills from resume
   * @param {string} jobDescription - Job description text (optional)
   * @param {Array<string>} jobSkills - Job skills list (optional)
   * @returns {Promise<Object>} Match results with score
   */
  async matchResumeToJob(resumeSkills, jobDescription = null, jobSkills = null) {
    try {
      logInfo('Calculating resume-job match');

      const payload = {
        resume_skills: resumeSkills
      };

      if (jobDescription) {
        payload.job_description = jobDescription;
      }
      if (jobSkills) {
        payload.job_skills = jobSkills;
      }

      const response = await axios.post(
        `${this.baseURL}/match`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      logInfo(`Match score: ${response.data.data.match_score}%`);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error calculating match', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Analyze resume using Google Gemini AI
   * @param {string} resumeText - Resume text content
   * @param {string} jobDescription - Job description
   * @returns {Promise<Object>} AI analysis with fit score and suggestions
   */
  async analyzeWithGemini(resumeText, jobDescription) {
    try {
      logInfo('Sending resume for Gemini AI analysis');

      const response = await axios.post(
        `${this.baseURL}/analyze-resume`,
        {
          resume_text: resumeText,
          job_description: jobDescription
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      logInfo('Gemini AI analysis completed');

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error in Gemini analysis', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Complete analysis: Parse → Extract → Match → Gemini AI
   * @param {string} filePath - Path to resume PDF
   * @param {string} jobDescription - Job description text
   * @returns {Promise<Object>} Complete analysis results
   */
  async completeAnalysis(filePath, jobDescription) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('job_description', jobDescription);

      logInfo(`Starting complete analysis for: ${filePath}`);

      const response = await axios.post(
        `${this.baseURL}/complete-analysis`,
        form,
        {
          headers: {
            ...form.getHeaders()
          },
          timeout: this.timeout * 2 // Double timeout for complete analysis
        }
      );

      logInfo('Complete analysis finished successfully');

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error in complete analysis', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Batch match resume against multiple jobs
   * @param {Array<string>} resumeSkills - Skills from resume
   * @param {Array<Object>} jobListings - Array of job listings
   * @returns {Promise<Object>} Ranked matches
   */
  async batchMatch(resumeSkills, jobListings) {
    try {
      logInfo(`Batch matching against ${jobListings.length} jobs`);

      const response = await axios.post(
        `${this.baseURL}/batch-match`,
        {
          resume_skills: resumeSkills,
          job_listings: jobListings
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      logInfo('Batch matching completed');

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error in batch matching', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Get skill gap analysis
   * @param {Array<string>} resumeSkills - Current skills
   * @param {Array<string>} targetSkills - Target skills
   * @returns {Promise<Object>} Gap analysis
   */
  async getSkillGap(resumeSkills, targetSkills) {
    try {
      logInfo('Calculating skill gap');

      const response = await axios.post(
        `${this.baseURL}/skill-gap`,
        {
          resume_skills: resumeSkills,
          target_skills: targetSkills
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error calculating skill gap', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Generate interview questions using AI
   * @param {string} resumeText - Resume content
   * @param {string} jobDescription - Job description
   * @param {number} numQuestions - Number of questions (default: 5)
   * @returns {Promise<Object>} Generated questions
   */
  async generateInterviewQuestions(resumeText, jobDescription, numQuestions = 5) {
    try {
      logInfo(`Generating ${numQuestions} interview questions`);

      const response = await axios.post(
        `${this.baseURL}/generate-interview-questions`,
        {
          resume_text: resumeText,
          job_description: jobDescription,
          num_questions: numQuestions
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error generating interview questions', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Get all available skills from database
   * @returns {Promise<Object>} All skills by category
   */
  async getAllSkills() {
    try {
      const response = await axios.get(`${this.baseURL}/skills/all`, {
        timeout: 5000
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error fetching all skills', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search for skills
   * @param {string} query - Search query
   * @returns {Promise<Object>} Matching skills
   */
  async searchSkills(query) {
    try {
      const response = await axios.get(
        `${this.baseURL}/skills/search`,
        {
          params: { query },
          timeout: 5000
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      logError('Error searching skills', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PythonClient();
