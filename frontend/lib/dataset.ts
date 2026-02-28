/**
 * Enhanced API Client with Dataset Support
 * 
 * Extended API functions to access the job description and resume datasets
 * Routes through backend API which proxies to ML service
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'http://localhost:8000';

// Use ML service directly for dataset endpoints
const datasetApi = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DatasetStats {
  total_job_descriptions: number;
  total_resume_data: number;
  categories: number;
  resumes_by_category: Record<string, number>;
}

export interface JobDescription {
  job_title: string;
  job_description: string;
}

export interface CategoryResumes {
  category: string;
  resumes: string[];
  count: number;
}

/**
 * Get dataset statistics
 */
export const getDatasetStats = async () => {
  const response = await datasetApi.get('/dataset/stats');
  return response.data;
};

/**
 * Get a random job description
 */
export const getRandomJob = async (): Promise<JobDescription> => {
  const response = await datasetApi.get('/dataset/random-job');
  return response.data.data;
};

/**
 * Search jobs by keywords
 */
export const searchJobs = async (keywords: string[], limit: number = 10) => {
  const response = await datasetApi.post('/dataset/search-jobs', {
    keywords,
    limit
  });
  return response.data;
};

/**
 * Get job by title
 */
export const getJobByTitle = async (title: string): Promise<JobDescription> => {
  const response = await datasetApi.get(`/dataset/job-by-title/${encodeURIComponent(title)}`);
  return response.data.data;
};

/**
 * Get available resume categories
 */
export const getCategories = async () => {
  const response = await datasetApi.get('/dataset/categories');
  return response.data;
};

/**
 * Get resumes by category
 */
export const getResumesByCategory = async (category: string): Promise<CategoryResumes> => {
  const response = await datasetApi.get(`/dataset/resumes/${category}`);
  return response.data.data;
};

export default {
  getDatasetStats,
  getRandomJob,
  searchJobs,
  getJobByTitle,
  getCategories,
  getResumesByCategory
};
