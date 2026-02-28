# 🚀 Quick Start Guide - HireSight AI

Get HireSight AI running in **under 5 minutes**!

## Step 1: Prerequisites ✓

Install these if you haven't already:
- **Python 3.10+** → [Download](https://www.python.org/downloads/)
- **Node.js 18+** → [Download](https://nodejs.org/)
- **Google Gemini API Key** → [Get Free Key](https://ai.google.dev/)

## Step 2: One-Command Setup 🎯

Open terminal in the project folder and run:

```bash
setup-complete.bat
```

This will:
- ✅ Install all Python dependencies
- ✅ Install all Node.js dependencies  
- ✅ Download spaCy NLP model
- ✅ Create environment files
- ✅ Validate project structure

## Step 3: Add Your API Key 🔑

1. Open `ml-service\.env`
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSyD56MxboY3Zr3oNTbMxKqhTp7VUx8gE9qQ
   ```
3. Save the file

## Step 4: Start Everything 🎬

```bash
start-all.bat
```

This opens 3 terminal windows:
- 🤖 **ML Service** (Port 8000)
- 🔧 **Backend** (Port 5000)
- 🎨 **Frontend** (Port 3000)

**Wait ~30 seconds** for services to start, then browser opens automatically!

## Step 5: Test It! 🧪

### Option A: Web Dashboard (Easy)
1. Visit: http://localhost:3000/test
2. Click "Generate" under Random Job Generator
3. Click "Analyze Resume Against This Job"
4. Upload a PDF resume
5. View results!

### Option B: Run Validation Script
```bash
validate-all.bat
```

This tests all endpoints automatically.

## Step 6: Use the App 🎉

1. **Go to:** http://localhost:3000
2. **Click:** "Get Started" or "Upload Resume"
3. **Upload:** Your PDF resume
4. **Paste:** Job description (or click "Use Random Job")
5. **Click:** "Analyze Resume"
6. **View:** Match scores, skills, AI insights!

---

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `setup-complete.bat` | Install everything |
| `start-all.bat` | Start all services |
| `stop-all.bat` | Stop all services |
| `test-all.bat` | Run automated tests |
| `validate-all.bat` | Validate everything |

---

## Access Points

| Service | URL |
|---------|-----|
| 🌐 Main App | http://localhost:3000 |
| 🧪 Testing | http://localhost:3000/test |
| 📚 API Docs | http://localhost:8000/docs |
| 🔧 Backend | http://localhost:5000/health |
| 🤖 ML Service | http://localhost:8000/health |

---

## Troubleshooting

### Services won't start?
```bash
# Check if ports are free
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :8000

# Kill if needed
taskkill /PID <pid> /F
```

### Python not found?
- Reinstall Python from python.org
- ✅ Check "Add Python to PATH"
- Restart terminal

### Dependencies error?
```bash
# Reinstall Python deps
cd ml-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Reinstall Node deps
cd backend-node
npm install

cd frontend
npm install
```

### API Key issues?
- Get new key from: https://ai.google.dev/
- Make sure no spaces in `.env` file
- Format: `GEMINI_API_KEY=your_key_here` (no quotes)

---

## What's Next?

✅ All services running
✅ App accessible at localhost:3000
✅ Tests passing

**You're ready to analyze resumes!**

### Try the Features:
- 📊 **Dataset Stats** - 63,764 job descriptions
- 🎲 **Random Jobs** - Test with real data
- 🔍 **Job Search** - Find specific roles
- 🎯 **Smart Matching** - AI-powered analysis
- 💡 **AI Insights** - Personalized recommendations
- ❓ **Interview Questions** - AI-generated prep

---

## Need Help?

- 📖 Full docs: See README.md
- 🧪 Testing guide: See TESTING.md
- 🤖 ML info: See ML_SERVICE.md
- 🎨 Frontend: See FRONTEND.md
- 🔧 Backend: See BACKEND.md

---

**Made with ❤️ by HireSight AI Team**

*Last Updated: March 2026*
