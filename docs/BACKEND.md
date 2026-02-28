# 🔧 Backend Service Documentation

## Overview

The Node.js Express backend serves as an API gateway between the Next.js frontend and the Python ML service. It handles request routing, response aggregation, and error handling.

## 🏗️ Architecture

```
Frontend Request → Express Backend → Python ML Service → Response
```

## 📁 Project Structure

```
backend-node/
├── src/
│   ├── config/
│   │   └── config.js          # Environment configuration
│   ├── controllers/
│   │   └── resumeController.js # Request handlers
│   ├── routes/
│   │   └── resumeRoutes.js    # API route definitions
│   ├── services/
│   │   └── pythonClient.js    # Python ML service client
│   ├── utils/
│   │   └── errorHandler.js    # Error handling utilities
│   └── server.js              # Main application entry
├── .env                       # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd backend-node
npm install
```

### Environment Variables

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
```

### Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on: `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "Backend API",
  "timestamp": "2026-03-01T10:30:00Z"
}
```

### Resume Analysis
```http
POST /api/analyze
Content-Type: multipart/form-data

resume: <file>
jobDescription: <string>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumeText": "...",
    "extractedSkills": ["Python", "JavaScript", "React"],
    "matchingResult": {
      "matchScore": 85,
      "matchedSkills": ["Python", "JavaScript"],
      "missingSkills": ["Docker", "AWS"]
    },
    "aiInsights": {
      "overallAssessment": "Strong candidate...",
      "recommendations": ["..."],
      "interviewQuestions": ["..."]
    }
  }
}
```

### Parse Resume
```http
POST /api/parse
Content-Type: multipart/form-data

resume: <file>
```

**Response:**
```json
{
  "success": true,
  "text": "Extracted resume text...",
  "pages": 2,
  "wordCount": 450
}
```

### Extract Skills
```http
POST /api/extract-skills
Content-Type: application/json

{
  "text": "Resume or job description text"
}
```

**Response:**
```json
{
  "success": true,
  "skills": ["Python", "JavaScript", "React", "Node.js"]
}
```

### Match Resume to Job
```http
POST /api/match
Content-Type: application/json

{
  "resumeSkills": ["Python", "JavaScript", "React"],
  "jobSkills": ["Python", "JavaScript", "Docker", "AWS"]
}
```

**Response:**
```json
{
  "success": true,
  "matchScore": 75,
  "fitScore": 80,
  "overallScore": 77.5,
  "matchedSkills": ["Python", "JavaScript"],
  "missingSkills": ["Docker", "AWS"],
  "analysis": "Good skill alignment..."
}
```

### AI Insights
```http
POST /api/ai-insights
Content-Type: application/json

{
  "resumeText": "...",
  "jobDescription": "...",
  "matchingResult": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "overallAssessment": "...",
    "strengths": ["..."],
    "improvements": ["..."],
    "recommendations": ["..."],
    "interviewQuestions": ["..."]
  }
}
```

## 🔌 Python Client Service

### Configuration

The `pythonClient.js` handles all communication with the Python ML service:

```javascript
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
```

### Methods

#### `parseResume(file)`
Sends resume file to Python service for text extraction.

#### `extractSkills(text)`
Extracts skills from text using Python NLP service.

#### `matchResume(resumeSkills, jobSkills)`
Calculates match scores using Python matching algorithm.

#### `getAIInsights(resumeText, jobDescription, matchingResult)`
Gets AI-generated insights from Google Gemini via Python service.

## 🛡️ Error Handling

### Error Handler Middleware

Located in `src/utils/errorHandler.js`:

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
};
```

### Error Types

- **400 Bad Request** - Invalid input
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server or Python service error
- **503 Service Unavailable** - Python ML service down

## 📝 Request Flow

### Complete Analysis Flow

```
1. POST /api/analyze
   ├─> parseResume(file)          [Python Service]
   ├─> extractSkills(resumeText)   [Python Service]
   ├─> extractSkills(jobDesc)      [Python Service]
   ├─> matchResume(skills)         [Python Service]
   └─> getAIInsights(data)         [Python Service]
   
2. Aggregate responses

3. Return combined result to frontend
```

## 🔧 Configuration

### Server Configuration

**File:** `src/config/config.js`

```javascript
module.exports = {
  port: process.env.PORT || 5000,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
```

### CORS Configuration

```javascript
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "multer": "^1.4.5-lts.1",
  "axios": "^1.6.0",
  "form-data": "^4.0.0"
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.0.1"
}
```

## 🧪 Testing

### Manual Testing

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Parse Resume:**
```bash
curl -X POST http://localhost:5000/api/parse \
  -F "resume=@path/to/resume.pdf"
```

**Extract Skills:**
```bash
curl -X POST http://localhost:5000/api/extract-skills \
  -H "Content-Type: application/json" \
  -d '{"text":"Python developer with React experience"}'
```

### Postman Collection

Import the API into Postman:
1. Base URL: `http://localhost:5000`
2. Create requests for each endpoint
3. Test with sample data

## 🐛 Debugging

### Enable Debug Logging

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}
```

### Common Issues

**Python Service Connection:**
```bash
# Check if Python service is running
curl http://localhost:8000/health

# Check environment variable
echo $ML_SERVICE_URL
```

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 📊 Performance

- **Average Response Time:** < 1s (excluding AI calls)
- **AI Analysis:** ~15s (Gemini processing)
- **File Upload:** Supports up to 10MB
- **Concurrent Requests:** Limited by Node.js event loop

## 🔐 Security

### Best Practices
- ✅ Environment variables for sensitive data
- ✅ CORS configured for specific origins
- ✅ File upload size limits
- ✅ Input validation
- ✅ Error message sanitization

### File Upload Security
```javascript
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  }
});
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `ML_SERVICE_URL`
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Enable SSL/TLS
- [ ] Set up monitoring
- [ ] Configure logging

### PM2 Deployment
```bash
npm install -g pm2
pm2 start src/server.js --name backend
pm2 save
pm2 startup
```

## 📈 Monitoring

### Health Monitoring
```bash
# Check service health
curl http://localhost:5000/health

# Monitor logs
tail -f logs/backend.log
```

### Metrics to Track
- Request count
- Response times
- Error rates
- Python service availability

## 🔄 Updates

### Adding New Endpoints

1. **Create Route:**
```javascript
// src/routes/newRoutes.js
router.post('/new-endpoint', controller.newHandler);
```

2. **Create Controller:**
```javascript
// src/controllers/newController.js
exports.newHandler = async (req, res, next) => {
  try {
    // Handle request
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

3. **Register Route:**
```javascript
// src/server.js
app.use('/api', newRoutes);
```

## 📞 Support

For backend-specific issues:
1. Check logs in console
2. Verify Python service is running
3. Test endpoints with curl/Postman
4. Check environment variables

---

**Backend Service by HireSight AI Team**
*Last Updated: March 2026*
