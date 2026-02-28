# Resume Upload API Testing

## Endpoint
**POST** `/api/upload-resume`

## Requirements
- Content-Type: `multipart/form-data`
- Field name: `resume`
- File type: PDF only
- Max file size: 5MB

## cURL Example

```bash
curl -X POST http://localhost:5000/api/upload-resume \
  -F "resume=@/path/to/your/resume.pdf"
```

## Using Postman
1. Select **POST** method
2. Enter URL: `http://localhost:5000/api/upload-resume`
3. Go to **Body** tab
4. Select **form-data**
5. Add key: `resume` (change type to **File**)
6. Select your PDF file
7. Click **Send**

## Success Response (200)
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "filePath": "C:\\path\\to\\uploads\\resumes\\resume-1709251234567-123456789.pdf",
    "filename": "resume-1709251234567-123456789.pdf",
    "originalName": "JohnDoe_Resume.pdf",
    "size": 245678,
    "uploadedAt": "2026-03-01T10:30:45.123Z",
    "status": "uploaded"
  }
}
```

## Error Responses

### No File (400)
```json
{
  "success": false,
  "message": "No file uploaded. Please provide a PDF file."
}
```

### Wrong File Type (400)
```json
{
  "success": false,
  "message": "Only PDF files are allowed"
}
```

### File Too Large (400)
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to upload resume",
  "status": "failed"
}
```

## JavaScript Fetch Example

```javascript
const formData = new FormData();
formData.append('resume', fileInput.files[0]);

fetch('http://localhost:5000/api/upload-resume', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## Notes
- Uploaded files are stored in `backend-node/uploads/resumes/`
- Files are automatically renamed with timestamp and random suffix
- The uploads directory is created automatically if it doesn't exist
