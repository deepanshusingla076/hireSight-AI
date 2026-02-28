# Complete Setup Guide - HireSight AI

## ✅ What's Been Created

### 1. Python ML Service (Resume Parser)

**Files Created:**
- `ml-service/requirements.txt` - Python dependencies (FastAPI, pdfplumber, uvicorn)
- `ml-service/app/main.py` - FastAPI application with `/parse-resume` endpoint
- `ml-service/app/services/resume_parser.py` - PDF parsing service
- `ml-service/app/utils/logger.py` - Logging utilities
- `ml-service/.env` - Environment configuration
- `ml-service/run.bat` - Windows startup script
- `ml-service/run.sh` - Linux/Mac startup script
- `ml-service/README.md` - Documentation
- `ml-service/TESTING.md` - Testing guide

**Features:**
✅ PDF text extraction using pdfplumber  
✅ Text cleaning and normalization  
✅ Word and character counting  
✅ Section detection (basic)  
✅ Temporary file handling  
✅ Error handling  
✅ CORS support  
✅ Health check endpoint  

### 2. Node.js Backend Integration

**Files Created:**
- `backend-node/src/services/mlService.client.js` - ML service HTTP client
- `backend-node/src/controllers/integration.example.js` - Integration example

**Updated:**
- `backend-node/package.json` - Added axios and form-data

## 🚀 Getting Started

### Step 1: Install Python ML Service

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Install Node.js Backend Dependencies

```bash
cd backend-node
npm install
```

### Step 3: Start Both Services

**Terminal 1 - ML Service:**
```bash
cd ml-service
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

**Terminal 2 - Backend:**
```bash
cd backend-node
npm run dev
# Runs on http://localhost:5000
```

## 🧪 Testing the ML Service

### Using cURL

```bash
curl -X POST http://localhost:8000/parse-resume \
  -F "file=@path/to/resume.pdf"
```

### Using Python

```python
import requests

url = "http://localhost:8000/parse-resume"
files = {"file": open("resume.pdf", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

### Using Postman

1. Method: `POST`
2. URL: `http://localhost:8000/parse-resume`
3. Body: `form-data`
4. Key: `file` (type: File)
5. Select PDF file
6. Send

### Expected Response

```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "text": "John Doe\nSoftware Engineer\nEmail: john@example.com...",
    "char_count": 1234,
    "word_count": 256
  }
}
```

## 🔗 Integration Example

The Node.js backend can call the ML service:

```javascript
const mlServiceClient = require('./services/mlService.client');

// Parse a resume
const result = await mlServiceClient.parseResume('/path/to/resume.pdf');

if (result.success) {
  console.log('Parsed text:', result.data.data.text);
  console.log('Word count:', result.data.data.word_count);
}
```

See `backend-node/src/controllers/integration.example.js` for a complete example.

## 📊 Architecture

```
User Upload (Frontend)
    ↓
Node.js Backend (Port 5000)
    ├─ Upload Handler (multer)
    ├─ Store PDF temporarily
    └─ Call ML Service →
                        ↓
                Python ML Service (Port 8000)
                    ├─ Receive PDF
                    ├─ Extract text (pdfplumber)
                    ├─ Clean text
                    └─ Return parsed data
```

## 🎯 API Endpoints

### ML Service (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check |
| POST | `/parse-resume` | Parse PDF resume |

### Backend (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | Welcome |
| GET | `/api/health` | Health check |
| POST | `/api/upload-resume` | Upload resume |

## 🔧 Troubleshooting

### ML Service won't start

**Problem:** Module import errors  
**Solution:** Ensure virtual environment is activated and dependencies installed

```bash
cd ml-service
venv\Scripts\activate
pip install -r requirements.txt
```

### PDF parsing fails

**Problem:** "Failed to parse resume"  
**Solution:** 
- Ensure PDF is not encrypted
- Check file is actually a PDF
- Verify file is not corrupted

### Port already in use

**Problem:** "Address already in use"  
**Solution:** Use different port

```bash
uvicorn app.main:app --reload --port 8001
```

### Backend can't reach ML service

**Problem:** Connection refused  
**Solution:**
- Ensure ML service is running
- Check `ML_SERVICE_URL` in `.env`
- Verify no firewall blocking

## 📝 Next Steps

### Immediate
1. ✅ ML service created
2. ✅ Resume parsing working
3. ✅ Integration client ready

### Future Enhancements
- [ ] Skills extraction
- [ ] Experience parsing
- [ ] Education extraction
- [ ] Contact information extraction
- [ ] Resume-job matching
- [ ] Database integration
- [ ] Frontend UI

## 🎓 Key Technologies

**Python ML Service:**
- FastAPI (modern, fast web framework)
- pdfplumber (PDF text extraction)
- uvicorn (ASGI server)

**Node.js Backend:**
- Express.js (web framework)
- Multer (file uploads)
- Axios (HTTP client)

## 💡 Tips

1. **Interactive Docs**: Visit `http://localhost:8000/docs` for Swagger UI
2. **Log Monitoring**: Check console for parsing logs
3. **File Cleanup**: Temporary files are auto-deleted
4. **Error Handling**: Both services have comprehensive error handling

---

**Happy Coding! 🚀**
