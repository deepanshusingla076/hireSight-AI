from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import shutil
from pathlib import Path
from app.services.resume_parser import resume_parser
from app.services.skill_extractor import skill_extractor
from app.services.matcher import matcher
from app.services.gemini_service import gemini_service
from app.utils.dataset_utils import (
    get_random_job_description,
    get_job_description_by_title,
    search_jobs_by_keywords,
    get_dataset_stats,
    get_resume_categories,
    get_sample_resumes_by_category
)

# Create FastAPI app
app = FastAPI(
    title="HireSight AI ML Service",
    description="AI/NLP microservice for resume parsing and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temp directory for uploads
TEMP_DIR = Path("temp_uploads")
TEMP_DIR.mkdir(exist_ok=True)


# Pydantic models for request validation
class SkillExtractionRequest(BaseModel):
    text: str


class MatchRequest(BaseModel):
    resume_skills: List[str]
    job_description: Optional[str] = None
    job_skills: Optional[List[str]] = None


class BatchMatchRequest(BaseModel):
    resume_skills: List[str]
    job_listings: List[Dict]


class SkillGapRequest(BaseModel):
    resume_skills: List[str]
    target_skills: List[str]


class GeminiAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str


class InterviewQuestionsRequest(BaseModel):
    resume_text: str
    job_description: str
    num_questions: Optional[int] = 5



@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "HireSight AI ML Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ml-service"
    }


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse resume PDF and extract text
    
    Args:
        file: PDF file upload
        
    Returns:
        JSON with extracted text and metadata
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted"
        )
    
    temp_file_path = None
    
    try:
        # Save uploaded file temporarily
        temp_file_path = TEMP_DIR / f"temp_{file.filename}"
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse the PDF
        result = resume_parser.parse_pdf(str(temp_file_path))
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse resume: {result.get('error')}"
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Resume parsed successfully",
                "data": {
                    "text": result["text"],
                    "char_count": result["char_count"],
                    "word_count": result["word_count"]
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/extract-skills")
async def extract_skills(request: SkillExtractionRequest):
    """
    Extract skills from text
    
    Args:
        request: JSON with text field
        
    Returns:
        JSON with extracted skills
    """
    try:
        result = skill_extractor.extract_skills(request.text)
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=f"Failed to extract skills: {result.get('error')}"
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Skills extracted successfully",
                "data": {
                    "skills": result["skills"],
                    "skill_count": result["skill_count"],
                    "categorized_skills": result["categorized_skills"],
                    "extraction_methods": result["extraction_methods"]
                }
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error extracting skills: {str(e)}"
        )


@app.post("/parse-and-extract")
async def parse_and_extract(file: UploadFile = File(...)):
    """
    Parse resume PDF and extract skills in one call
    
    Args:
        file: PDF file upload
        
    Returns:
        JSON with parsed text and extracted skills
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted"
        )
    
    temp_file_path = None
    
    try:
        # Save uploaded file temporarily
        temp_file_path = TEMP_DIR / f"temp_{file.filename}"
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse the PDF
        parse_result = resume_parser.parse_pdf(str(temp_file_path))
        
        if not parse_result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse resume: {parse_result.get('error')}"
            )
        
        # Extract skills from parsed text
        skill_result = skill_extractor.extract_skills(parse_result["text"])
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Resume parsed and skills extracted successfully",
                "data": {
                    "text": parse_result["text"],
                    "char_count": parse_result["char_count"],
                    "word_count": parse_result["word_count"],
                    "skills": skill_result.get("skills", []),
                    "skill_count": skill_result.get("skill_count", 0),
                    "categorized_skills": skill_result.get("categorized_skills", {})
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/match")
async def match_resume(request: MatchRequest):
    """
    Match resume skills against job requirements
    
    Args:
        request: JSON with resume_skills and job_description or job_skills
        
    Returns:
        JSON with match score and details
    """
    try:
        result = matcher.calculate_match(
            resume_skills=request.resume_skills,
            job_description=request.job_description,
            job_skills=request.job_skills
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=400,
                detail=result.get("error", "Match calculation failed")
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Match calculated successfully",
                "data": result
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating match: {str(e)}"
        )


@app.post("/batch-match")
async def batch_match_resume(request: BatchMatchRequest):
    """
    Match resume against multiple job listings
    
    Args:
        request: JSON with resume_skills and job_listings
        
    Returns:
        JSON with ranked matches
    """
    try:
        result = matcher.batch_match(
            resume_skills=request.resume_skills,
            job_listings=request.job_listings
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=400,
                detail=result.get("error", "Batch match failed")
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Batch match completed successfully",
                "data": result
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in batch matching: {str(e)}"
        )


@app.post("/skill-gap")
async def skill_gap_analysis(request: SkillGapRequest):
    """
    Analyze skill gaps between current and target skills
    
    Args:
        request: JSON with resume_skills and target_skills
        
    Returns:
        JSON with detailed gap analysis
    """
    try:
        result = matcher.get_skill_gap_analysis(
            resume_skills=request.resume_skills,
            target_skills=request.target_skills
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=400,
                detail=result.get("error", "Skill gap analysis failed")
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Skill gap analysis completed",
                "data": result
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in skill gap analysis: {str(e)}"
        )


@app.get("/skills/all")
async def get_all_skills():
    """
    Get all available skills from database
    
    Returns:
        JSON with all skills by category
    """
    try:
        skills = skill_extractor.get_all_skills()
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Skills retrieved successfully",
                "data": skills
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving skills: {str(e)}"
        )


@app.get("/skills/search")
async def search_skills(query: str):
    """
    Search for skills matching a query
    
    Args:
        query: Search term
        
    Returns:
        JSON with matching skills
    """
    try:
        matches = skill_extractor.search_skills(query)
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"Found {len(matches)} matching skills",
                "data": {
                    "query": query,
                    "matches": matches,
                    "count": len(matches)
                }
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching skills: {str(e)}"
        )


@app.post("/analyze-resume")
async def analyze_resume_with_gemini(request: GeminiAnalysisRequest):
    """
    Analyze resume against job description using Google Gemini AI
    
    Args:
        request: JSON with resume_text and job_description
        
    Returns:
        JSON with AI-powered analysis including fit score, suggestions, and improvement areas
    """
    try:
        result = gemini_service.analyze_resume(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Analysis failed")
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Resume analysis completed successfully",
                "data": result["analysis"]
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing resume: {str(e)}"
        )


@app.post("/complete-analysis")
async def complete_resume_analysis(file: UploadFile = File(...), job_description: str = Body(...)):
    """
    Complete workflow: Parse PDF → Extract Skills → Gemini Analysis
    
    Args:
        file: PDF resume file
        job_description: Job description text
        
    Returns:
        Complete analysis with text, skills, and AI insights
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted"
        )
    
    temp_file_path = None
    
    try:
        # Save uploaded file temporarily
        temp_file_path = TEMP_DIR / f"temp_{file.filename}"
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Step 1: Parse the PDF
        parse_result = resume_parser.parse_pdf(str(temp_file_path))
        
        if not parse_result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse resume: {parse_result.get('error')}"
            )
        
        resume_text = parse_result["text"]
        
        # Step 2: Extract skills
        skill_result = skill_extractor.extract_skills(resume_text)
        
        # Step 3: Get Gemini analysis
        gemini_result = gemini_service.analyze_resume(
            resume_text=resume_text,
            job_description=job_description
        )
        
        # Step 4: Calculate match score
        if skill_result.get("success"):
            match_result = matcher.calculate_match(
                resume_skills=skill_result.get("skills", []),
                job_description=job_description
            )
        else:
            match_result = {"success": False}
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Complete analysis finished",
                "data": {
                    "resume": {
                        "text": resume_text,
                        "char_count": parse_result["char_count"],
                        "word_count": parse_result["word_count"]
                    },
                    "skills": {
                        "extracted": skill_result.get("skills", []),
                        "count": skill_result.get("skill_count", 0),
                        "categorized": skill_result.get("categorized_skills", {})
                    },
                    "match": {
                        "score": match_result.get("match_score", 0) if match_result.get("success") else 0,
                        "matched_skills": match_result.get("matched_skills", []) if match_result.get("success") else [],
                        "missing_skills": match_result.get("missing_skills", []) if match_result.get("success") else []
                    },
                    "ai_analysis": gemini_result.get("analysis", {}) if gemini_result.get("success") else {
                        "error": "AI analysis unavailable"
                    }
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in complete analysis: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/generate-interview-questions")
async def generate_interview_questions(request: InterviewQuestionsRequest):
    """
    Generate interview questions using Gemini AI
    
    Args:
        request: JSON with resume_text, job_description, and optional num_questions
        
    Returns:
        JSON with generated interview questions
    """
    try:
        result = gemini_service.generate_interview_questions(
            resume_text=request.resume_text,
            job_description=request.job_description,
            num_questions=request.num_questions
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to generate questions")
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Interview questions generated",
                "data": {
                    "questions": result["questions"],
                    "count": len(result["questions"])
                }
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating questions: {str(e)}"
        )


# ============================================================================
# DATASET ENDPOINTS - Access to job descriptions and sample resumes
# ============================================================================

@app.get("/dataset/stats")
async def get_dataset_statistics():
    """
    Get statistics about the available dataset.
    
    Returns:
        - total_job_descriptions: Number of job descriptions
        - total_resume_data: Number of resume records
        - categories: Number of job categories
        - resumes_by_category: Count of resumes per category
    """
    try:
        stats = get_dataset_stats()
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Dataset statistics retrieved",
                "data": stats
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving stats: {str(e)}"
        )


@app.get("/dataset/random-job")
async def get_random_job():
    """
    Get a random job description from the dataset.
    
    Returns:
        - job_title: The job title
        - job_description: Full job description
    """
    try:
        job = get_random_job_description()
        if not job['job_title']:
            raise HTTPException(
                status_code=404,
                detail="No job descriptions found in dataset"
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Random job description retrieved",
                "data": job
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving job: {str(e)}"
        )


class JobSearchRequest(BaseModel):
    keywords: List[str]
    limit: int = 10


@app.post("/dataset/search-jobs")
async def search_jobs(request: JobSearchRequest):
    """
    Search for jobs by keywords.
    
    Request body:
        - keywords: List of keywords to search for
        - limit: Maximum number of results (default: 10)
    
    Returns:
        List of matching job descriptions
    """
    try:
        jobs = search_jobs_by_keywords(request.keywords, request.limit)
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"Found {len(jobs)} matching jobs",
                "data": {
                    "jobs": jobs,
                    "count": len(jobs)
                }
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching jobs: {str(e)}"
        )


@app.get("/dataset/job-by-title/{title}")
async def get_job_by_title(title: str):
    """
    Get job description by title.
    
    Args:
        title: Job title to search for (case-insensitive)
    
    Returns:
        Matching job description
    """
    try:
        job = get_job_description_by_title(title)
        if not job['job_title']:
            raise HTTPException(
                status_code=404,
                detail=f"No job found matching title: {title}"
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Job description found",
                "data": job
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving job: {str(e)}"
        )


@app.get("/dataset/categories")
async def get_categories():
    """
    Get list of available resume categories.
    
    Returns:
        List of category names
    """
    try:
        categories = get_resume_categories()
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Categories retrieved",
                "data": {
                    "categories": categories,
                    "count": len(categories)
                }
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving categories: {str(e)}"
        )


@app.get("/dataset/resumes/{category}")
async def get_resumes_by_category(category: str):
    """
    Get list of sample resumes for a specific category.
    
    Args:
        category: Job category (e.g., 'ENGINEERING', 'INFORMATION-TECHNOLOGY')
    
    Returns:
        List of resume file paths
    """
    try:
        category = category.upper()
        resumes = get_sample_resumes_by_category(category)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"Found {len(resumes)} resumes in {category}",
                "data": {
                    "category": category,
                    "resumes": resumes,
                    "count": len(resumes)
                }
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving resumes: {str(e)}"
        )


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print("🚀 ML Service started successfully")
    print("📍 Temp directory:", TEMP_DIR.absolute())


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print("👋 ML Service shutting down")
