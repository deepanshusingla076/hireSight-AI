# HireSight AI - Quick Start Guide

## System Requirements
- Node.js 16+
- Python 3.9+
- pip

## Installation

### 1. Python ML Service Setup
```bash
cd ml-service

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm

# Create .env file
echo GEMINI_API_KEY=AIzaSyD56MxboY3Zr3oNTbMxKqhTp7VUx8gE9qQ > .env

# Start the service
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Python ML Service will run at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 2. Node.js Backend Setup
```bash
cd backend-node

# Install dependencies
npm install

# Create .env file (if not exists)
cat > .env << EOL
PORT=5000
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
EOL

# Start the server
npm run dev
```

Node.js Backend will run at: http://localhost:5000

## Testing the System

### 1. Health Check
```bash
# Node.js health
curl http://localhost:5000/health

# Python ML service health
curl http://localhost:8000/health

# ML service status (via Node.js)
curl http://localhost:5000/api/ml-status
```

### 2. Test Resume Analysis
```bash
# Complete analysis (replace path with actual PDF)
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@/path/to/sample_resume.pdf" \
  -F "jobDescription=Senior Python Developer with FastAPI and cloud experience"
```

### 3. Test Interview Questions
```bash
curl -X POST http://localhost:5000/api/interview-questions \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "John Doe - Senior Software Engineer with 5 years Python experience",
    "jobDescription": "Looking for Python developer with FastAPI experience",
    "difficulty": "medium"
  }'
```

### 4. Test Skill Gap Analysis
```bash
curl -X POST http://localhost:5000/api/skill-gap \
  -H "Content-Type: application/json" \
  -d '{
    "currentSkills": ["Python", "JavaScript", "React"],
    "targetSkills": ["Python", "Kubernetes", "AWS", "Docker"]
  }'
```

## Available Endpoints

### Node.js Backend (Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/ml-status` | GET | Check ML service status |
| `/api/analyze` | POST | Complete resume analysis |
| `/api/process-resume` | POST | Parse PDF & extract skills |
| `/api/match-job` | POST | Match skills to job |
| `/api/ai-insights` | POST | Get AI insights |
| `/api/batch-match` | POST | Match multiple jobs |
| `/api/skill-gap` | POST | Skill gap analysis |
| `/api/interview-questions` | POST | Generate questions |

### Python ML Service (Port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/docs` | GET | Interactive API docs |
| `/parse-resume` | POST | Extract text from PDF |
| `/extract-skills` | POST | Extract skills from text |
| `/match-job` | POST | Calculate match score |
| `/analyze-resume` | POST | AI-powered analysis |
| `/complete-analysis` | POST | Full workflow |
| `/generate-interview-questions` | POST | Generate questions |
| `/available-skills` | GET | Get skills database |

## Project Structure

```
resume-ai/
├── backend-node/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js          # Environment config
│   │   │   └── upload.js         # Multer config
│   │   ├── controllers/
│   │   │   ├── analysis.controller.js  # AI endpoints
│   │   │   └── resume.controller.js    # Upload
│   │   ├── routes/
│   │   │   ├── index.js          # Main router
│   │   │   ├── analysis.routes.js      # AI routes
│   │   │   ├── health.routes.js
│   │   │   └── resume.routes.js
│   │   ├── services/
│   │   │   ├── pythonClient.js   # ML service client
│   │   │   └── resume.service.js
│   │   ├── utils/
│   │   ├── app.js                # Express app
│   │   └── server.js             # Entry point
│   ├── package.json
│   └── .env
│
├── ml-service/
│   ├── app/
│   │   ├── services/
│   │   │   ├── resume_parser.py      # PDF parsing
│   │   │   ├── skill_extractor.py    # Skill extraction
│   │   │   ├── matcher.py            # Match engine
│   │   │   └── gemini_service.py     # AI integration
│   │   └── main.py               # FastAPI app
│   ├── requirements.txt
│   └── .env
│
└── data/
    ├── skills.json               # 250+ skills database
    ├── job_descriptions/
    └── sample_resumes/
```

## Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Python Dependencies Issues
```bash
# Use virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Missing spaCy Model
```bash
python -m spacy download en_core_web_sm
```

### Gemini API Errors
- Verify API key in `ml-service/.env`
- Check quota at: https://makersuite.google.com/app/apikey
- Ensure internet connectivity

## Next Steps

1. ✅ Backend & ML Service setup complete
2. ✅ All endpoints tested
3. 🔜 Build frontend React dashboard
4. 🔜 Add user authentication
5. 🔜 Deploy to production

## Support

- Full Documentation: [PHASE_7_8_DOCUMENTATION.md](./PHASE_7_8_DOCUMENTATION.md)
- Python API Docs: http://localhost:8000/docs
- Issues: Check error logs in terminal

---

**HireSight AI** - Intelligent Resume Analysis Platform
