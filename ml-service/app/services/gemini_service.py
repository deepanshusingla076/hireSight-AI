import os
import json
from typing import Dict, Optional
from dotenv import load_dotenv
from app.utils.logger import log_info, log_error

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    log_error("Google Gemini not available. Install with: pip install google-generativeai")

# Load environment variables
load_dotenv()


class GeminiService:
    """
    Google Gemini AI Service
    Uses Gemini API for intelligent resume analysis
    """

    def __init__(self):
        """Initialize Gemini service with API key"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        
        if not GEMINI_AVAILABLE:
            log_error("Gemini library not installed")
            return
            
        if not self.api_key:
            log_error("GEMINI_API_KEY not found in environment variables")
            return
        
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
            log_info("Gemini service initialized successfully")
        except Exception as e:
            log_error("Failed to initialize Gemini service", e)
            self.model = None

    def analyze_resume(
        self,
        resume_text: str,
        job_description: str
    ) -> Dict[str, any]:
        """
        Analyze resume against job description using Gemini AI

        Args:
            resume_text: Full text of the resume
            job_description: Job description or requirements

        Returns:
            Dict with fit score, suggestions, and improvement areas
        """
        try:
            if not self.model:
                return {
                    "success": False,
                    "error": "Gemini service not initialized. Check API key and installation."
                }

            if not resume_text or not job_description:
                return {
                    "success": False,
                    "error": "Both resume_text and job_description are required"
                }

            # Create detailed prompt for Gemini
            prompt = self._create_analysis_prompt(resume_text, job_description)

            log_info("Sending analysis request to Gemini AI")
            
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            
            # Parse the response
            analysis = self._parse_gemini_response(response.text)

            log_info("Gemini analysis completed successfully")
            
            return {
                "success": True,
                "analysis": analysis
            }

        except Exception as e:
            log_error("Error in Gemini analysis", e)
            return {
                "success": False,
                "error": str(e)
            }

    def _create_analysis_prompt(
        self,
        resume_text: str,
        job_description: str
    ) -> str:
        """
        Create a detailed prompt for Gemini analysis

        Args:
            resume_text: Resume content
            job_description: Job requirements

        Returns:
            Formatted prompt string
        """
        prompt = f"""
You are an expert AI career advisor and resume analyst. Analyze the following resume against the job description and provide a comprehensive evaluation.

**RESUME:**
{resume_text[:3000]}  

**JOB DESCRIPTION:**
{job_description[:2000]}  

Please provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):

{{
  "fit_score": <number between 0-100>,
  "summary": "<brief 2-3 sentence overall assessment>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "weaknesses": [
    "<weakness 1>",
    "<weakness 2>",
    "<weakness 3>"
  ],
  "matched_skills": [
    "<skill 1>",
    "<skill 2>",
    "<skill 3>"
  ],
  "missing_skills": [
    "<skill 1>",
    "<skill 2>",
    "<skill 3>"
  ],
  "suggestions": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>",
    "<actionable suggestion 3>"
  ],
  "improvement_areas": [
    {{
      "area": "<area name>",
      "description": "<how to improve>",
      "priority": "<high|medium|low>"
    }},
    {{
      "area": "<area name>",
      "description": "<how to improve>",
      "priority": "<high|medium|low>"
    }}
  ],
  "recommendation": "<apply|apply_with_preparation|upskill_first|not_recommended>"
}}

Focus on:
1. Technical skills match
2. Experience level alignment
3. Industry relevance
4. Cultural fit indicators
5. Career progression alignment
"""
        return prompt

    def _parse_gemini_response(self, response_text: str) -> Dict:
        """
        Parse Gemini response text into structured format

        Args:
            response_text: Raw response from Gemini

        Returns:
            Parsed analysis dictionary
        """
        try:
            # Try to extract JSON from response
            # Sometimes Gemini wraps JSON in markdown code blocks
            text = response_text.strip()
            
            # Remove markdown code blocks if present
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            
            if text.endswith("```"):
                text = text[:-3]
            
            text = text.strip()
            
            # Parse JSON
            analysis = json.loads(text)
            
            # Validate required fields
            required_fields = ["fit_score", "summary", "suggestions", "improvement_areas"]
            for field in required_fields:
                if field not in analysis:
                    log_error(f"Missing required field: {field}")
            
            return analysis

        except json.JSONDecodeError as e:
            log_error("Failed to parse Gemini response as JSON", e)
            
            # Return fallback structure
            return {
                "fit_score": 0,
                "summary": "Unable to parse AI response. Please try again.",
                "raw_response": response_text[:500],
                "strengths": [],
                "weaknesses": [],
                "matched_skills": [],
                "missing_skills": [],
                "suggestions": ["Please review the resume and job description manually."],
                "improvement_areas": [],
                "recommendation": "manual_review_needed"
            }

    def generate_interview_questions(
        self,
        resume_text: str,
        job_description: str,
        num_questions: int = 5
    ) -> Dict[str, any]:
        """
        Generate interview questions based on resume and job description

        Args:
            resume_text: Resume content
            job_description: Job requirements
            num_questions: Number of questions to generate

        Returns:
            Dict with generated questions
        """
        try:
            if not self.model:
                return {
                    "success": False,
                    "error": "Gemini service not initialized"
                }

            prompt = f"""
Based on this resume and job description, generate {num_questions} insightful interview questions.

**RESUME:**
{resume_text[:2000]}

**JOB DESCRIPTION:**
{job_description[:1500]}

Generate questions that:
1. Test technical skills mentioned in the resume
2. Explore experience relevant to the job
3. Assess problem-solving abilities
4. Evaluate cultural fit

Format as JSON array:
["Question 1", "Question 2", ...]
"""

            response = self.model.generate_content(prompt)
            questions = json.loads(response.text.strip())

            return {
                "success": True,
                "questions": questions
            }

        except Exception as e:
            log_error("Error generating interview questions", e)
            return {
                "success": False,
                "error": str(e)
            }


# Create singleton instance
gemini_service = GeminiService()
