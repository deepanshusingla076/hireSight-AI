# Python Testing Guide for ML Service

## Testing the ML Service

### 1. Install Dependencies

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 2. Start the Service

```bash
uvicorn app.main:app --reload
```

### 3. Test Endpoints

#### Health Check
```bash
curl http://localhost:8000/health
```

#### Parse Resume
```bash
curl -X POST http://localhost:8000/parse-resume \
  -F "file=@C:\path\to\your\resume.pdf"
```

#### Using Python requests
```python
import requests

url = "http://localhost:8000/parse-resume"
files = {"file": open("resume.pdf", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## Interactive Documentation

Once the service is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test the API directly from the browser using these interfaces.

## Expected Response

```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "text": "John Doe\nSoftware Engineer\n...",
    "char_count": 1234,
    "word_count": 256
  }
}
```

## Common Issues

### Issue: Module not found
**Solution**: Make sure virtual environment is activated and dependencies are installed

### Issue: PDF parsing fails
**Solution**: Ensure the PDF is not encrypted or password-protected

### Issue: Port already in use
**Solution**: Use a different port: `uvicorn app.main:app --reload --port 8001`
