import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AnalysisResult {
  success: boolean;
  message: string;
  data: {
    resumeText?: string;
    extractedSkills?: string[];
    matchScore?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    aiInsights?: {
      fitScore: number;
      strengths: string[];
      areasForImprovement: string[];
      recommendations: string[];
    };
    questions?: string[];
  };
}

export interface SkillGapResult {
  success: boolean;
  message: string;
  data: {
    currentSkills: string[];
    targetSkills: string[];
    gaps: string[];
    learningPriority: string[];
    estimatedTime: string;
    resources: string[];
  };
}

// Complete resume analysis
export const analyzeResume = async (
  file: File,
  jobDescription: string
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);

  const response = await api.post('http://localhost:5000/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Normalize backend response to frontend AnalysisResult shape
  const payload = response.data && response.data.data ? response.data.data : {};

  const normalized: AnalysisResult = {
    success: response.data.success,
    message: response.data.message,
    data: {
      resumeText: payload.resume?.text || '',
      extractedSkills: payload.skills?.extracted || [],
      matchScore: payload.match?.score || 0,
      matchedSkills: payload.match?.matched_skills || [],
      missingSkills: payload.match?.missing_skills || [],
      aiInsights: payload.ai_analysis || {
        fitScore: 0,
        strengths: [],
        areasForImprovement: [],
        recommendations: []
      },
      questions: payload.questions || []
    }
  };

  return normalized;
};

// Process resume (parse + extract skills)
export const processResume = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('http://localhost:5000/api/process-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const payload = response.data && response.data.data ? response.data.data : {};

  return {
    success: response.data.success,
    message: response.data.message,
    data: {
      resumeText: payload.resume?.text || '',
      extractedSkills: payload.skills?.extracted || [],
      matchScore: payload.match?.score || 0,
      matchedSkills: payload.match?.matched_skills || [],
      missingSkills: payload.match?.missing_skills || [],
      aiInsights: payload.ai_analysis || null,
      questions: payload.questions || []
    }
  };
};

// Match resume to job
export const matchJob = async (
  resumeSkills: string[],
  jobRequirements: string
): Promise<AnalysisResult> => {
  const response = await api.post('http://localhost:5000/api/match-job', {
    resumeSkills,
    jobRequirements,
  });

  const payload = response.data && response.data.data ? response.data.data : {};

  return {
    success: response.data.success,
    message: response.data.message,
    data: {
      resumeText: payload.resume?.text || '',
      extractedSkills: payload.skills?.extracted || [],
      matchScore: payload.match?.score || 0,
      matchedSkills: payload.match?.matched_skills || [],
      missingSkills: payload.match?.missing_skills || [],
      aiInsights: payload.ai_analysis || null,
      questions: payload.questions || []
    }
  };
};

// Get AI insights
export const getAIInsights = async (
  resumeText: string,
  jobDescription: string,
  matchedSkills: string[],
  missingSkills: string[]
): Promise<AnalysisResult> => {
  const response = await api.post('http://localhost:5000/api/ai-insights', {
    resumeText,
    jobDescription,
    matchedSkills,
    missingSkills,
  });

  return response.data;
};

// Generate interview questions
export const generateInterviewQuestions = async (
  resumeText: string,
  jobDescription: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<AnalysisResult> => {
  const response = await api.post('http://localhost:5000/api/interview-questions', {
    resumeText,
    jobDescription,
    difficulty,
  });

  return response.data;
};

// Skill gap analysis
export const getSkillGap = async (
  currentSkills: string[],
  targetSkills: string[]
): Promise<SkillGapResult> => {
  const response = await api.post('http://localhost:5000/api/skill-gap', {
    currentSkills,
    targetSkills,
  });

  return response.data;
};

// Batch match jobs
export const batchMatchJobs = async (
  resumeSkills: string[],
  jobListings: Array<{ title: string; requirements: string }>
): Promise<AnalysisResult> => {
  const response = await api.post('http://localhost:5000/api/batch-match', {
    resumeSkills,
    jobListings,
  });

  return response.data;
};

// Check ML service health
export const checkMLServiceStatus = async () => {
  const response = await api.get('/api/ml-status');
  return response.data;
};

export default api;
