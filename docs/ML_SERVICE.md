# 🤖 ML Service Documentation

## Overview

The Python FastAPI ML service is the brain of HireSight AI. It handles resume parsing, NLP-based skill extraction, intelligent matching algorithms, and Google Gemini AI integration for advanced insights.

## 🏗️ Architecture

```
FastAPI Application
├── Resume Parser (PyPDF2)
├── NLP Engine (spaCy)
├── Skill Extractor (Custom Algorithm)
├── Matching Engine (Similarity Algorithms)
├── Gemini AI Integration (Google AI)
└── Dataset Utilities (pandas)
```

## 📁 Project Structure

```
ml-service/
├── app/
│   ├── models/
│   │   └── schemas.py        # Pydantic data models
│   ├── services/
│   │   ├── resume_parser.py  # PDF parsing
│   │   ├── skill_extractor.py # Skill extraction
│   │   ├── matcher.py        # Matching algorithm
│   │   └── gemini_service.py # AI integration
│   ├── utils/
│   │   └── dataset_utils.py  # Dataset utilities
│   └── main.py               # FastAPI application
│
├── data/                     # Data files (symlink to ../data)
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables
└── test_dataset_integration.py # Test script
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- pip
- Google Gemini API Key

### Installation

```bash
cd ml-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### Environment Variables

Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MODEL_NAME=gemini-2.0-flash-exp
```

### Start Service

**Development:**
```bash
uvicorn app.main:app --reload --port 8000
```

**Production:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Service runs on: `http://localhost:8000`

**API Documentation:** `http://localhost:8000/docs`

## 📡 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "ML Service",
  "version": "1.0.0"
}
```

### Parse Resume
```http
POST /parse
Content-Type: multipart/form-data

file: <resume.pdf>
```

**Response:**
```json
{
  "text": "Extracted resume text...",
  "pages": 2,
  "word_count": 450,
  "success": true
}
```

### Extract Skills
```http
POST /extract-skills
Content-Type: application/json

{
  "text": "Python developer with React and AWS experience"
}
```

**Response:**
```json
{
  "skills": ["Python", "React", "AWS"],
  "count": 3
}
```

### Match Resume to Job
```http
POST /match
Content-Type: application/json

{
  "resume_skills": ["Python", "JavaScript", "React"],
  "job_skills": ["Python", "JavaScript", "Docker", "AWS"]
}
```

**Response:**
```json
{
  "match_score": 75.0,
  "fit_score": 80.0,
  "overall_score": 77.5,
  "matched_skills": ["Python", "JavaScript"],
  "missing_skills": ["Docker", "AWS"],
  "analysis": "Good skill alignment with room for improvement"
}
```

### Complete Analysis
```http
POST /analyze
Content-Type: multipart/form-data

resume: <file>
job_description: <string>
```

**Response:**
```json
{
  "resume_text": "...",
  "job_description": "...",
  "resume_skills": ["Python", "JavaScript", "React"],
  "job_skills": ["Python", "JavaScript", "Docker", "AWS"],
  "matching": {
    "match_score": 75.0,
    "fit_score": 80.0,
    "overall_score": 77.5,
    "matched_skills": ["Python", "JavaScript"],
    "missing_skills": ["Docker", "AWS"]
  },
  "ai_insights": {
    "overall_assessment": "Strong candidate...",
    "strengths": ["..."],
    "improvements": ["..."],
    "recommendations": ["..."],
    "interview_questions": ["..."]
  }
}
```

### AI Insights
```http
POST /ai-insights
Content-Type: application/json

{
  "resume_text": "...",
  "job_description": "...",
  "matching_result": { ... }
}
```

**Response:**
```json
{
  "overall_assessment": "Strong candidate with relevant experience",
  "strengths": [
    "Extensive Python experience",
    "Strong JavaScript skills"
  ],
  "improvements": [
    "Learn Docker containerization",
    "Gain AWS cloud experience"
  ],
  "recommendations": [
    "Take Docker certification course",
    "Build projects with AWS services"
  ],
  "interview_questions": [
    "Explain your most complex Python project",
    "How would you optimize React performance?"
  ]
}
```

## 📊 Dataset Endpoints

### Get Dataset Statistics
```http
GET /dataset/stats
```

**Response:**
```json
{
  "total_job_descriptions": 63764,
  "total_resumes": 0,
  "categories": 24,
  "resumes_by_category": {
    "ENGINEERING": 236,
    "INFORMATION-TECHNOLOGY": 189,
    "ACCOUNTANT": 124,
    ...
  }
}
```

### Get Random Job
```http
GET /dataset/random-job
```

**Response:**
```json
{
  "job_title": "Senior Python Developer",
  "job_description": "We are seeking an experienced Python developer..."
}
```

### Search Jobs
```http
POST /dataset/search-jobs
Content-Type: application/json

{
  "keywords": ["python", "ai", "machine learning"],
  "limit": 10
}
```

**Response:**
```json
{
  "count": 10,
  "jobs": [
    {
      "job_title": "Python AI Engineer",
      "job_description": "..."
    },
    ...
  ]
}
```

### Get Job by Title
```http
GET /dataset/job-by-title/{title}
```

**Response:**
```json
{
  "job_title": "Data Scientist",
  "job_description": "..."
}
```

### Get Categories
```http
GET /dataset/categories
```

**Response:**
```json
{
  "categories": [
    "ACCOUNTANT",
    "ADVOCATE",
    "ENGINEERING",
    "INFORMATION-TECHNOLOGY",
    ...
  ],
  "count": 24
}
```

### Get Resumes by Category
```http
GET /dataset/resumes/{category}
```

**Response:**
```json
{
  "category": "ENGINEERING",
  "count": 236,
  "resumes": [
    "data/sample_resumes/ENGINEERING/resume1.pdf",
    "data/sample_resumes/ENGINEERING/resume2.pdf",
    ...
  ]
}
```

## 🧠 Core Services

### 1. Resume Parser (`services/resume_parser.py`)

**Purpose:** Extract text from PDF resumes

**Key Functions:**
```python
def parse_resume(file_path: str) -> dict:
    """
    Parse PDF resume and extract text
    
    Args:
        file_path: Path to PDF file
        
    Returns:
        {
            'text': str,
            'pages': int,
            'word_count': int
        }
    """
```

**Dependencies:**
- PyPDF2 - PDF parsing
- re - Text cleaning

**Features:**
- Multi-page support
- Text cleaning and normalization
- Error handling for corrupted PDFs
- Word count statistics

### 2. Skill Extractor (`services/skill_extractor.py`)

**Purpose:** Extract technical skills from text using NLP

**Key Functions:**
```python
def extract_skills(text: str) -> List[str]:
    """
    Extract skills from text using spaCy NLP and skill database
    
    Args:
        text: Resume or job description text
        
    Returns:
        List of extracted skills
    """
```

**Algorithm:**
1. Load spaCy model (en_core_web_sm)
2. Process text with NLP pipeline
3. Load skills database (250+ skills)
4. Match skills using:
   - Exact matching
   - Case-insensitive matching
   - Fuzzy matching (optional)
   - Context-aware extraction

**Dependencies:**
- spaCy - NLP processing
- Custom skills.json database

**Skill Categories:**
- Programming Languages (Python, JavaScript, Java, etc.)
- Frameworks (React, Django, Flask, etc.)
- Databases (MongoDB, PostgreSQL, MySQL, etc.)
- Cloud Platforms (AWS, Azure, GCP)
- DevOps Tools (Docker, Kubernetes, Jenkins, etc.)
- Soft Skills (Leadership, Communication, etc.)

### 3. Matcher (`services/matcher.py`)

**Purpose:** Calculate match scores between resumes and jobs

**Key Functions:**
```python
def calculate_match(resume_skills: List[str], 
                   job_skills: List[str]) -> dict:
    """
    Calculate matching scores
    
    Returns:
        {
            'match_score': float,      # 0-100
            'fit_score': float,        # 0-100
            'overall_score': float,    # 0-100
            'matched_skills': List[str],
            'missing_skills': List[str],
            'analysis': str
        }
    """
```

**Scoring Algorithm:**

**Match Score:**
```
match_score = (matched_skills / total_job_skills) * 100
```

**Fit Score:**
```
fit_score = (matched_skills / total_resume_skills) * 100
```

**Overall Score:**
```
overall_score = (match_score * 0.6) + (fit_score * 0.4)
```

**Weighted factors:**
- Match Score (60%) - How many required skills are covered
- Fit Score (40%) - How relevant the candidate's skillset is

### 4. Gemini Service (`services/gemini_service.py`)

**Purpose:** Generate AI-powered insights using Google Gemini

**Key Functions:**
```python
async def get_ai_insights(resume_text: str,
                         job_description: str,
                         matching_result: dict) -> dict:
    """
    Generate comprehensive AI insights
    
    Returns:
        {
            'overall_assessment': str,
            'strengths': List[str],
            'improvements': List[str],
            'recommendations': List[str],
            'interview_questions': List[str]
        }
    """
```

**AI Prompt Structure:**
```
Role: Expert technical recruiter and career coach

Context:
- Resume text
- Job description
- Match score and skills

Tasks:
1. Overall assessment
2. Identify strengths
3. Suggest improvements
4. Provide recommendations
5. Generate interview questions
```

**Features:**
- Streaming responses (optional)
- Context-aware analysis
- Personalized recommendations
- Technical interview prep
- Error handling and retries

**Model:** `gemini-2.0-flash-exp`
- Fast inference
- High quality outputs
- Cost-effective

## 🗄️ Dataset Utilities (`utils/dataset_utils.py`)

### Job Description Functions

```python
def load_job_descriptions() -> pd.DataFrame:
    """Load job descriptions from CSV"""
    
def get_random_job_description() -> dict:
    """Get random job from dataset"""
    
def search_jobs_by_keywords(keywords: List[str], limit: int) -> List[dict]:
    """Search jobs by keywords"""
    
def get_job_description_by_title(title: str) -> dict:
    """Get specific job by title"""
```

### Resume Functions

```python
def get_sample_resumes_by_category(category: str) -> List[str]:
    """Get resume paths by category"""
    
def get_random_resume_path() -> str:
    """Get random resume file path"""
    
def get_dataset_stats() -> dict:
    """Get dataset statistics"""
```

### Categories

```python
JOB_CATEGORIES = [
    'ACCOUNTANT', 'ADVOCATE', 'AGRICULTURE', 'APPAREL',
    'ARTS', 'AUTOMOBILE', 'AVIATION', 'BANKING',
    'BPO', 'BUSINESS-DEVELOPMENT', 'CHEF', 'CONSTRUCTION',
    'CONSULTANT', 'DESIGNER', 'DIGITAL-MEDIA', 'ENGINEERING',
    'FINANCE', 'FITNESS', 'HEALTHCARE', 'HR',
    'INFORMATION-TECHNOLOGY', 'PUBLIC-RELATIONS', 'SALES', 'TEACHER'
]
```

## 📦 Dependencies

### Core Requirements
```txt
fastapi==0.115.12
uvicorn==0.34.0
python-multipart==0.0.21
pydantic==2.10.6
pydantic-settings==2.7.1
```

### ML & NLP
```txt
spacy==3.8.3
PyPDF2==3.0.1
pandas==2.1.4
numpy==2.2.4
```

### AI Integration
```txt
google-generativeai==0.8.4
```

### Utilities
```txt
python-dotenv==1.0.1
```

## 🧪 Testing

### Unit Tests

```python
# Test resume parsing
from app.services.resume_parser import parse_resume

result = parse_resume('test_resume.pdf')
assert 'text' in result
assert result['pages'] > 0
```

### Integration Tests

```bash
python test_dataset_integration.py
```

**Test Coverage:**
- Dataset loading
- Random job generation
- Job search
- Complete analysis workflow

### API Testing

```bash
# Using curl
curl -X POST http://localhost:8000/extract-skills \
  -H "Content-Type: application/json" \
  -d '{"text":"Python developer"}'

# Using pytest
pytest tests/
```

## 🔧 Configuration

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_api_key

# Optional
MODEL_NAME=gemini-2.0-flash-exp
MAX_WORKERS=4
LOG_LEVEL=INFO
```

### FastAPI Configuration

```python
app = FastAPI(
    title="HireSight ML Service",
    description="AI-powered resume analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔍 Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

logger.info("Resume parsed successfully")
logger.error("Failed to parse resume", exc_info=True)
```

## 🚀 Performance

### Benchmarks
- **Resume Parse:** < 2s
- **Skill Extraction:** < 1s
- **Match Calculation:** < 0.5s
- **AI Insights:** ~15s (Gemini API)
- **Dataset Query:** < 1s

### Optimization Tips
```python
# Use async/await for I/O
async def parse_resume_async(file_path: str):
    # Async operations
    
# Cache frequently accessed data
from functools import lru_cache

@lru_cache(maxsize=128)
def load_skills_database():
    return json.load(open('skills.json'))
```

## 🐛 Debugging

### Enable Debug Mode

```bash
LOG_LEVEL=DEBUG uvicorn app.main:app --reload
```

### Common Issues

**spaCy Model Not Found:**
```bash
python -m spacy download en_core_web_sm
```

**Gemini API Error:**
```python
# Check API key
import os
print(os.getenv('GEMINI_API_KEY'))

# Test API
from google import generativeai as genai
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
```

**PDF Parsing Error:**
```python
# Ensure PyPDF2 is installed
pip install PyPDF2 --upgrade

# Check file permissions
os.path.exists(file_path)
```

## 🔐 Security

### Best Practices
- ✅ API key in environment variables
- ✅ Input validation with Pydantic
- ✅ File upload size limits
- ✅ Error message sanitization
- ✅ CORS configuration
- ✅ Rate limiting (recommended)

### File Upload Security
```python
ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file):
    if not file.filename.endswith('.pdf'):
        raise ValueError("Only PDF files allowed")
    if file.size > MAX_FILE_SIZE:
        raise ValueError("File too large")
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Checklist
- [ ] Set production environment variables
- [ ] Configure logging
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Enable rate limiting
- [ ] Set up health checks
- [ ] Configure auto-scaling
- [ ] Implement caching (Redis)

## 📈 Monitoring

### Health Endpoint
```python
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ML Service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }
```

### Metrics to Track
- Request count
- Response times
- Error rates
- API usage
- Model performance

## 📞 Support

For ML service issues:
1. Check logs: `uvicorn.log`
2. Verify spaCy model installed
3. Test Gemini API key
4. Check dataset files exist
5. Review API documentation at `/docs`

---

**ML Service by HireSight AI Team**
*Last Updated: March 2026*
