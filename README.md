# HireSight AI

Production-ready Resume Analysis Platform with AI-powered parsing and matching.

## 🎯 Project Overview

HireSight AI is a comprehensive resume analysis system that combines Node.js backend services with Python-based AI/NLP capabilities.

## 📁 Project Structure

```
hiresight-ai/
│
├── frontend/                # Next.js (UI) - Coming soon
│
├── backend-node/           # Node.js (Main API)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── ml-service/             # Python (AI/NLP microservice)
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   └── resume_parser.py
│   │   ├── models/
│   │   └── utils/
│   └── requirements.txt
│
├── data/
│   ├── job_descriptions/
│   └── sample_resumes/
│
└── README.md
```

## 🚀 Quick Start

### Backend (Node.js)

```bash
# Navigate to backend
cd backend-node

# Install dependencies
npm install

# Start server
npm run dev
```

Server runs on: `http://localhost:5000`

### ML Service (Python)

```bash
# Navigate to ML service
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start service
uvicorn app.main:app --reload
```

Service runs on: `http://localhost:8000`

**Or use the run script:**
```bash
cd ml-service
run.bat  # Windows
./run.sh # Linux/Mac
```

## 🔌 API Endpoints

### Backend Node.js (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | Welcome message |
| GET | `/api/health` | Health check |
| POST | `/api/upload-resume` | Upload resume (PDF) |

### ML Service Python (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check |
| POST | `/parse-resume` | Parse PDF resume |
| POST | `/extract-skills` | Extract skills from text |
| POST | `/parse-and-extract` | Parse PDF + extract skills |
| POST | `/match` | Match resume to job |
| POST | `/batch-match` | Match to multiple jobs |
| POST | `/skill-gap` | Analyze skill gaps |
| GET | `/skills/all` | Get all skills database |
| GET | `/skills/search` | Search for skills |

## 📖 Documentation

- **Backend API**: See [backend-node/README.md](backend-node/README.md)
- **ML Service**: See [ml-service/README.md](ml-service/README.md)
- **API Testing**: See [backend-node/API_TESTING.md](backend-node/API_TESTING.md)
- **ML API Guide**: See [ml-service/API_GUIDE.md](ml-service/API_GUIDE.md)
- **Phase 5 & 6**: See [PHASE_5_6_COMPLETE.md](PHASE_5_6_COMPLETE.md)

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **Multer** - File uploads
- **CORS** - Cross-origin support
- **Morgan** - HTTP logging

### ML Service
- **FastAPI** - Modern Python framework
- **pdfplumber** - PDF text extraction
- **spaCy** - Natural language processing
- **uvicorn** - ASGI server

## 🔧 Features

### Current Features
✅ Resume upload (PDF only, 5MB max)  
✅ PDF text extraction & parsing  
✅ Text cleaning and normalization  
✅ **Skill extraction (250+ skills)**  
✅ **NLP-based skill detection**  
✅ **Resume-job matching with scores**  
✅ **Batch job matching**  
✅ **Skill gap analysis**  
✅ Skills categorization  
✅ Health monitoring endpoints  
✅ CORS support  
✅ Comprehensive error handling  
✅ Request logging  

### Planned Features
🔜 Experience parsing  
🔜 Education extraction  
🔜 Frontend UI  
🔜 Database integration  

## 🧪 Testing

### Test Resume Upload (Backend)
```bash
curl -X POST http://localhost:5000/api/upload-resume \
  -F "resume=@path/to/resume.pdf"
```

### Test Resume Parsing (ML Service)
```bash
curl -X POST http://localhost:8000/parse-resume \
  -F "file=@path/to/resume.pdf"
```

## 📦 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

### ML Service (ml-service/.env)
```
HOST=0.0.0.0
PORT=8000
```

## 🤝 Contributing

This is a production-ready template. Extend functionality by:
1. Adding new routes in respective services
2. Creating new service modules
3. Implementing additional AI/NLP features

## 📝 License

ISC

## 🎓 Architecture

This project follows:
- **Clean Architecture** - Separation of concerns
- **Microservices** - Independent, scalable services
- **RESTful API** - Standard HTTP methods
- **Modular Design** - Easy to extend and maintain

---

**Made with ❤️ for efficient resume processing**
