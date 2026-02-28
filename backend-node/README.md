# HireSight AI Backend

Production-ready Node.js backend API built with Express.

## 🚀 Getting Started

### Installation

```bash
cd backend-node
npm install
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend-node/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
└── package.json
```

## 🔌 API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### Welcome
- **GET** `/api` - Welcome message

### Resume Upload
- **POST** `/api/upload-resume` - Upload resume (PDF only, max 5MB)
  - Content-Type: `multipart/form-data`
  - Field name: `resume`
  - Returns: file path and upload status

📋 See [API_TESTING.md](API_TESTING.md) for detailed testing examples.

## 🛠️ Technologies

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Multer** - File upload middleware
- **dotenv** - Environment variable management

## 📝 Environment Variables

See `.env` file in the root directory for configuration options.

## 🏗️ Architecture

This project follows clean architecture principles:
- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Utils**: Reusable utility functions
- **Config**: Application configuration
