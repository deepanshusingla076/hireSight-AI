# HireSight AI ML Service

Python-based AI/NLP microservice for resume parsing and analysis.

## 🚀 Getting Started

### Installation

1. **Create virtual environment:**
```bash
cd ml-service
python -m venv venv
```

2. **Activate virtual environment:**

Windows:
```bash
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

### Running the Service

**Development mode:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The service will start on `http://localhost:8000`

## 📁 Project Structure

```
ml-service/
├── app/
│   ├── services/
│   │   ├── resume_parser.py    # Resume parsing service
│   │   ├── skill_extractor.py  # Skill extraction service
│   │   └── matcher.py          # Resume-job matching engine
│   ├── models/                 # Data models
│   ├── utils/                  # Utility functions
│   └── main.py                 # FastAPI application
├── requirements.txt
└── .env
```

## 🔌 API Endpoints

### Welcome & Health
- **GET** `/` - Service information
- **GET** `/health` - Health status

### Resume Parsing
- **POST** `/parse-resume` - Parse PDF resume and extract text
  - Content-Type: `multipart/form-data`
  - Field name: `file`
  - Accepts: PDF files only
  - Returns: Extracted text and metadata

- **POST** `/parse-and-extract` - Parse PDF and extract skills in one call
  - Content-Type: `multipart/form-data`
  - Field name: `file`
  - Returns: Text + extracted skills

### Skill Extraction
- **POST** `/extract-skills` - Extract skills from text
  - Content-Type: `application/json`
  - Body: `{"text": "your resume text"}`
  - Returns: List of extracted skills (categorized)

### Skills Database
- **GET** `/skills/all` - Get all available skills by category
- **GET** `/skills/search?query=python` - Search for skills

### Matching Engine
- **POST** `/match` - Match resume skills against job requirements
  - Body: `{"resume_skills": [...], "job_description": "..." or "job_skills": [...]}`
  - Returns: Match score, matched/missing skills, recommendation

- **POST** `/batch-match` - Match resume against multiple jobs
  - Body: `{"resume_skills": [...], "job_listings": [...]}`
  - Returns: Ranked job matches

- **POST** `/skill-gap` - Analyze skill gaps
  - Body: `{"resume_skills": [...], "target_skills": [...]}`
  - Returns: Detailed gap analysis with priorities

## 📝 API Examples

### Parse Resume (cURL)
```bash
curl -X POST http://localhost:8000/parse-resume \
  -F "file=@/path/to/resume.pdf"
```

### Extract Skills from Text
```bash
curl -X POST http://localhost:8000/extract-skills \
  -H "Content-Type: application/json" \
  -d '{"text": "I have 5 years experience with Python, JavaScript, React, Node.js, and AWS"}'
```

### Match Resume to Job
```bash
curl -X POST http://localhost:8000/match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_skills": ["Python", "JavaScript", "React", "Node.js"],
    "job_description": "Looking for a developer with Python, React, Docker, and Kubernetes experience"
  }'
```

### Response Examples

**Parse Resume:**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "text": "Extracted resume text...",
    "char_count": 1234,
    "word_count": 256
  }
}
```

**Extract Skills:**
```json
{
  "success": true,
  "message": "Skills extracted successfully",
  "data": {
    "skills": ["Python", "JavaScript", "React", "Node.js", "AWS"],
    "skill_count": 5,
    "categorized_skills": {
      "technical_skills": ["Python", "JavaScript", "React", "Node.js"],
      "cloud_platforms": ["AWS"]
    }
  }
}
```

**Match Score:**
```json
{
  "success": true,
  "message": "Match calculated successfully",
  "data": {
    "match_score": 75.0,
    "confidence": "high",
    "matched_skills": ["Python", "React"],
    "missing_skills": ["Docker", "Kubernetes"],
    "recommendation": "Good match. Consider applying...",
    "statistics": {
      "matched_count": 3,
      "missing_count": 2
    }
  }
}
```

## 🛠️ Technologies

- **FastAPI** - Modern web framework
- **pdfplumber** - PDF text extraction
- **spaCy** - Natural language processing
- **uvicorn** - ASGI server
- **python-multipart** - File upload support

## 🔧 Development

**Install spaCy model (required for NLP features):**
```bash
python -m spacy download en_core_web_sm
```

**Interactive API docs:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📦 Dependencies

See [requirements.txt](requirements.txt) for all dependencies.

## 🏗️ Features

### Resume Parsing
- ✅ PDF text extraction
- ✅ Text cleaning and normalization
- ✅ Character and word count
- ✅ Section detection (basic)

### Skill Extraction
- ✅ Keyword-based matching (250+ skills)
- ✅ NLP-based extraction (spaCy)
- ✅ Skill categorization (technical, soft skills, tools, etc.)
- ✅ Multi-method extraction for accuracy

### Matching Engine
- ✅ Resume-job matching with score
- ✅ Matched/missing/extra skills analysis
- ✅ Batch matching (multiple jobs)
- ✅ Skill gap analysis
- ✅ Confidence levels and recommendations

### General
- ✅ Comprehensive error handling
- ✅ Temporary file cleanup
- ✅ CORS support
- ✅ Interactive API documentation
