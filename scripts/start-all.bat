@echo off
REM ========================================
REM HireSight AI - Start All Services
REM ========================================

color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║           HireSight AI - Starting All Services                   ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✅ Python found
echo.

REM Check if Node.js is installed
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js found
echo.

REM Check if required files exist
echo [3/4] Checking project structure...
if not exist "ml-service\app\main.py" (
    color 0C
    echo ❌ ERROR: ML service files not found
    pause
    exit /b 1
)
if not exist "backend-node\src\server.js" (
    color 0C
    echo ❌ ERROR: Backend files not found
    pause
    exit /b 1
)
if not exist "frontend\package.json" (
    color 0C
    echo ❌ ERROR: Frontend files not found
    pause
    exit /b 1
)
echo ✅ All project files found
echo.

REM Check environment variables
echo [4/4] Checking environment configuration...
if not exist "ml-service\.env" (
    color 0E
    echo ⚠️  WARNING: ml-service\.env not found
    echo Please create .env file with GEMINI_API_KEY
    echo.
)
if not exist "frontend\.env.local" (
    color 0E
    echo ⚠️  WARNING: frontend\.env.local not found
    echo.
)
echo.

echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                  Starting Services...                            ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Start ML Service
echo 🤖 Starting Python ML Service (Port 8000)...
start "ML Service (Port 8000)" cmd /k "cd ml-service && color 0B && echo Starting ML Service... && uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul
echo.

REM Start Backend
echo 🔧 Starting Node.js Backend (Port 5000)...
start "Backend (Port 5000)" cmd /k "cd backend-node && color 0D && echo Starting Backend... && npm run dev"
timeout /t 3 /nobreak >nul
echo.

REM Start Frontend
echo 🎨 Starting Next.js Frontend (Port 3000)...
start "Frontend (Port 3000)" cmd /k "cd frontend && color 0A && echo Starting Frontend... && npm run dev"
timeout /t 3 /nobreak >nul
echo.

echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                     Services Started!                            ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Services are starting up...
echo.
echo Wait ~30 seconds for all services to initialize, then access:
echo.
echo    Frontend:         http://localhost:3000
echo    Testing Dashboard: http://localhost:3000/test
echo    Backend API:      http://localhost:5000/health
echo    ML Service API:   http://localhost:8000/health
echo    API Docs:         http://localhost:8000/docs
echo.
echo 💡 TIP: Check the opened terminal windows for service logs
echo.
echo Press any key to open the application in browser...
pause >nul

REM Wait a bit more for services to fully start
timeout /t 25 /nobreak >nul

REM Open browser
start http://localhost:3000

echo.
echo ✅ Application opened in browser!
echo.
echo To stop all services, close the terminal windows or run stop-all.bat
echo.
pause
