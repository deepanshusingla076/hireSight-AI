const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config');

/**
 * ML Service Client
 * Handles communication with Python ML microservice
 */
class MLServiceClient {
  constructor() {
    this.baseURL = config.mlServiceUrl;
  }

  /**
   * Parse resume using ML service
   * @param {string} filePath - Path to resume PDF
   * @returns {Object} - Parsed resume data
   */
  async parseResume(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const response = await axios.post(
        `${this.baseURL}/parse-resume`,
        form,
        {
          headers: {
            ...form.getHeaders()
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Check ML service health
   * @returns {Object} - Health status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MLServiceClient();
