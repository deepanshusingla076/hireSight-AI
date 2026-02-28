# Phase 7 & 8: Google Gemini AI Integration & Microservices Connection

## Overview

Phase 7 and 8 complete the **HireSight AI** platform by integrating Google's Gemini AI for advanced resume analysis and establishing seamless communication between the Node.js backend and Python ML service.

---

## Phase 7: Google Gemini AI Integration

### Objectives
- Integrate Google Gemini API for AI-powered resume analysis
- Provide intelligent insights on candidate fit and improvements
- Generate personalized interview questions

### Implementation

#### 1. Environment Setup

**File:** `ml-service/.env`
```env
GEMINI_API_KEY=AIzaSyD56MxboY3Zr3oNTbMxKqhTp7VUx8gE9qQ
```

#### 2. Dependencies

**Updated:** `ml-service/requirements.txt`
```
google-generativeai==0.3.2
```

**Install:**
```bash
cd ml-service
pip install -r requirements.txt
```

#### 3. Gemini Service

**File:** `ml-service/app/services/gemini_service.py`

Key Features:
- **Resume Analysis**: AI-powered fit score (0-100) and improvement suggestions
- **Interview Question Generation**: Role-specific questions based on resume and job description

**Methods:**
```python
analyze_resume(resume_text, job_description, matched_skills, missing_skills)
# Returns: fit_score, strengths, areas_for_improvement, recommendations

generate_interview_questions(resume_text, job_description, difficulty="medium")
# Returns: List of 5 interview questions (technical, behavioral, scenario-based)
```

#### 4. FastAPI Endpoints

**Added to:** `ml-service/app/main.py`

1. **POST /analyze-resume** - AI-powered resume analysis
   ```json
   {
     "resume_text": "...",
     "job_description": "...",
     "matched_skills": [...],
     "missing_skills": [...]
   }
   ```

2. **POST /complete-analysis** - Full workflow (parse, extract, match, AI)
   ```json
   {
     "job_description": "..."
   }
   ```
   Plus file upload: `resume` (multipart/form-data)

3. **POST /generate-interview-questions** - AI-generated questions
   ```json
   {
     "resume_text": "...",
     "job_description": "...",
     "difficulty": "medium"  // easy, medium, hard
   }
   ```

---

## Phase 8: Node.js ↔ Python Microservices Connection

### Architecture

```
┌─────────────────┐           ┌──────────────────┐
│  Frontend       │           │  Node.js Backend │
│  (Port 3000)    │◄──────────┤  (Port 5000)     │
└─────────────────┘   HTTP    └────────┬─────────┘
                                        │
                                        │ HTTP/Axios
                                        │
                               ┌────────▼──────────┐
                               │  Python ML Service│
                               │  FastAPI          │
                               │  (Port 8000)      │
                               └───────────────────┘
```

### Implementation

#### 1. Python Client Service

**File:** `backend-node/src/services/pythonClient.js`

Comprehensive client for communicating with Python ML service.

**Methods:**
- `parseResume(fileBuffer, fileName)` - Extract text from PDF
- `extractSkills(resumeText)` - Extract skills using NLP
- `matchJob(resumeSkills, jobRequirements)` - Calculate match score
- `analyzeResumeWithAI(resumeText, jobDescription, matchedSkills, missingSkills)` - AI insights
- `completeAnalysis(fileBuffer, fileName, jobDescription)` - Full workflow
- `generateInterviewQuestions(resumeText, jobDescription, difficulty)` - AI questions
- `getAvailableSkills()` - Retrieve skills database
- `batchMatchJobs(resumeSkills, jobListings)` - Multi-job matching
- `getSkillGapAnalysis(currentSkills, targetSkills)` - Gap analysis
- `checkHealth()` - Service health check

**Key Features:**
- Automatic file upload handling with FormData
- Extended timeouts (60s) for AI operations
- Comprehensive error handling
- Support for both file and JSON requests

#### 2. Analysis Controller

**File:** `backend-node/src/controllers/analysis.controller.js`

8 controller functions exposing Python ML capabilities to the frontend.

**Endpoints:**

1. **analyzeResume** - Complete resume analysis workflow
   - Parses PDF
   - Extracts skills
   - Matches to job
   - Generates AI insights
   - Returns comprehensive report

2. **processResume** - Parse and extract skills
   - PDF text extraction
   - Skill identification
   - No job matching

3. **matchJob** - Match skills to job requirements
   - Requires: `resumeSkills`, `jobRequirements`
   - Returns: match score, matched/missing skills

4. **getAIInsights** - AI-powered analysis
   - Requires: resume text, job description, skills
   - Returns: fit score, strengths, improvements, recommendations

5. **batchMatchJobs** - Match against multiple jobs
   - Requires: `resumeSkills`, `jobListings[]`
   - Returns: ranked match results

6. **getSkillGap** - Skill gap analysis
   - Requires: `currentSkills`, `targetSkills`
   - Returns: gaps, learning priorities, resources

7. **generateInterviewQuestions** - AI question generation
   - Requires: resume text, job description
   - Optional: difficulty level
   - Returns: 5 tailored interview questions

8. **checkMLServiceStatus** - Health check
   - Verifies Python service availability
   - Returns: status and response time

#### 3. Routes

**File:** `backend-node/src/routes/analysis.routes.js`

API endpoints for frontend integration:

| Method | Endpoint | Description | Body/File |
|--------|----------|-------------|-----------|
| POST | `/api/analyze` | Complete analysis | File: `resume`, JSON: `jobDescription` |
| POST | `/api/process-resume` | Parse & extract | File: `resume` |
| POST | `/api/match-job` | Match skills | JSON: `resumeSkills`, `jobRequirements` |
| POST | `/api/ai-insights` | AI insights | JSON: `resumeText`, `jobDescription`, `matchedSkills`, `missingSkills` |
| POST | `/api/batch-match` | Multi-job match | JSON: `resumeSkills`, `jobListings[]` |
| POST | `/api/skill-gap` | Gap analysis | JSON: `currentSkills`, `targetSkills` |
| POST | `/api/interview-questions` | AI questions | JSON: `resumeText`, `jobDescription`, `difficulty?` |
| GET | `/api/ml-status` | ML service health | None |

---

## Usage Examples

### Example 1: Complete Resume Analysis

**Request:**
```bash
POST http://localhost:5000/api/analyze
Content-Type: multipart/form-data

resume: [PDF file]
jobDescription: "Senior Python Developer with 5+ years experience..."
```

**Response:**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "resumeText": "John Doe\nSoftware Engineer...",
    "extractedSkills": ["Python", "JavaScript", "React", "FastAPI"],
    "matchScore": 85,
    "matchedSkills": ["Python", "FastAPI"],
    "missingSkills": ["Kubernetes", "AWS"],
    "aiInsights": {
      "fitScore": 87,
      "strengths": [
        "Strong backend development experience",
        "Excellent Python expertise"
      ],
      "areasForImprovement": [
        "Cloud platform experience needed",
        "Consider DevOps certifications"
      ],
      "recommendations": [
        "Take AWS Solutions Architect course",
        "Build container orchestration projects"
      ]
    }
  }
}
```

### Example 2: Generate Interview Questions

**Request:**
```bash
POST http://localhost:5000/api/interview-questions
Content-Type: application/json

{
  "resumeText": "John Doe\n5 years Python development...",
  "jobDescription": "Senior Backend Engineer...",
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interview questions generated successfully",
  "data": {
    "questions": [
      "Explain your experience with FastAPI and how it compares to Flask.",
      "Describe a challenging bug you solved in a Python project.",
      "How would you design a scalable microservices architecture?",
      "Tell me about a time you mentored junior developers.",
      "Walk through your approach to database optimization."
    ]
  }
}
```

### Example 3: Skill Gap Analysis

**Request:**
```bash
POST http://localhost:5000/api/skill-gap
Content-Type: application/json

{
  "currentSkills": ["Python", "JavaScript", "React"],
  "targetSkills": ["Python", "Kubernetes", "AWS", "Docker", "React"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill gap analysis completed",
  "data": {
    "currentSkills": ["Python", "JavaScript", "React"],
    "targetSkills": ["Python", "Kubernetes", "AWS", "Docker", "React"],
    "gaps": ["Kubernetes", "AWS", "Docker"],
    "learningPriority": ["Docker", "Kubernetes", "AWS"],
    "estimatedTime": "3-6 months",
    "resources": [
      "Docker Deep Dive course",
      "Certified Kubernetes Administrator (CKA)",
      "AWS Solutions Architect certification"
    ]
  }
}
```

---

## Configuration

### Environment Variables

**Node.js Backend** (`backend-node/.env`):
```env
PORT=5000
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
```

**Python ML Service** (`ml-service/.env`):
```env
GEMINI_API_KEY=AIzaSyD56MxboY3Zr3oNTbMxKqhTp7VUx8gE9qQ
```

---

## Running the Complete System

### 1. Start Python ML Service

```bash
cd ml-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Access: http://localhost:8000/docs

### 2. Start Node.js Backend

```bash
cd backend-node
npm install
npm run dev
```

Access: http://localhost:5000

### 3. Test Integration

**Health Check:**
```bash
curl http://localhost:5000/api/ml-status
```

**Complete Analysis:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@sample_resume.pdf" \
  -F "jobDescription=Senior Python Developer with FastAPI experience"
```

---

## API Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common Error Codes:**
- `400` - Bad Request (missing fields, invalid data)
- `413` - File Too Large (> 5MB)
- `415` - Unsupported Media Type (non-PDF files)
- `500` - Internal Server Error
- `503` - ML Service Unavailable

---

## Architecture Benefits

### 1. **Separation of Concerns**
   - Node.js: API gateway, file handling, authentication
   - Python: ML/AI processing, NLP, data analysis

### 2. **Scalability**
   - Services can be scaled independently
   - Python service can be containerized for ML workloads

### 3. **Performance**
   - Node.js handles async I/O efficiently
   - Python optimized for ML computations

### 4. **Maintainability**
   - Clean service boundaries
   - Each service uses its native ecosystem

---

## Next Steps

### Phase 9 (Recommended): Frontend Integration
- Build React dashboard
- Implement file upload UI
- Display match scores and AI insights
- Show skill gap visualizations

### Phase 10 (Recommended): Advanced Features
- User authentication (JWT)
- Database integration (PostgreSQL)
- Resume history tracking
- Batch processing queue (Redis + Celery)

### Phase 11 (Recommended): Production Deployment
- Dockerize services
- Set up CI/CD pipeline
- Deploy to cloud (AWS/GCP)
- Add monitoring (Prometheus/Grafana)

---

## Troubleshooting

### ML Service Connection Errors

**Issue:** `ML service is not available`

**Solutions:**
1. Verify Python service is running: `curl http://localhost:8000/health`
2. Check `ML_SERVICE_URL` in Node.js `.env`
3. Ensure no firewall blocking port 8000

### Gemini API Errors

**Issue:** `Gemini API error: 403 Forbidden`

**Solutions:**
1. Verify API key in `ml-service/.env`
2. Check API quota: https://makersuite.google.com/app/apikey
3. Ensure `google-generativeai` package is installed

### File Upload Errors

**Issue:** `File too large` or `Invalid file type`

**Solutions:**
1. Ensure PDF files are under 5MB
2. Check file extension is `.pdf`
3. Verify `multer` configuration in `backend-node/src/config/upload.js`

---

## Testing Checklist

- [ ] Python ML service starts successfully
- [ ] Node.js backend starts successfully
- [ ] Health check returns 200 OK
- [ ] ML service status endpoint works
- [ ] Resume parsing extracts text correctly
- [ ] Skill extraction finds relevant skills
- [ ] Job matching calculates scores properly
- [ ] AI insights return fit score and suggestions
- [ ] Interview questions are generated
- [ ] Skill gap analysis provides learning path
- [ ] Error handling works for invalid inputs
- [ ] File size limits are enforced
- [ ] PDF-only validation works

---

## Conclusion

Phases 7 and 8 transform **HireSight AI** into a production-ready, AI-powered resume analysis platform. The microservices architecture enables:

✅ **Intelligent Analysis** - Gemini AI provides human-like insights  
✅ **Scalable Design** - Independent services scale based on load  
✅ **Clean Integration** - Well-defined API boundaries  
✅ **Robust Error Handling** - Comprehensive validation and error messages  
✅ **Developer-Friendly** - Clear documentation and testing endpoints  

The platform is now ready for frontend integration and production deployment!
