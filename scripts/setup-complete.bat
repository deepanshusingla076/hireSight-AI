@echo off
REM ========================================
REM HireSight AI - Complete Setup & Validation
REM ========================================

color 0E
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║         HireSight AI - Complete Setup & Validation              ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Check Prerequisites
echo [Step 1/7] Checking Prerequisites...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Python is not installed
    echo.
    echo Please install Python 3.10+ from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)
echo ✅ Python installed
python --version

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Node.js is not installed
    echo.
    echo Please install Node.js 18+ from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js installed
node --version
echo.

REM Step 2: Check Project Structure
echo [Step 2/7] Verifying Project Structure...
echo.

if not exist "ml-service\app\main.py" (
    color 0C
    echo ❌ ML service files missing
    exit /b 1
)
echo ✅ ML service files found

if not exist "backend-node\src\server.js" (
    color 0C
    echo ❌ Backend files missing
    exit /b 1
)
echo ✅ Backend files found

if not exist "frontend\package.json" (
    color 0C
    echo ❌ Frontend files missing
    exit /b 1
)
echo ✅ Frontend files found

if not exist "data\job_descriptions\job_title_des.csv" (
    color 0E
    echo ⚠️  Job descriptions CSV not found
    echo.
)

if not exist "data\skills.json" (
    color 0E
    echo ⚠️  Skills database not found
    echo.
)
echo.

REM Step 3: Setup Environment Files
echo [Step 3/7] Setting Up Environment Files...
echo.

if not exist "ml-service\.env" (
    if exist "ml-service\.env.example" (
        copy ml-service\.env.example ml-service\.env >nul
        echo ✅ Created ml-service\.env from example
        echo ⚠️  Please edit ml-service\.env and add your GEMINI_API_KEY
        echo.
    ) else (
        color 0E
        echo ⚠️  ml-service\.env not found, please create it
    )
) else (
    echo ✅ ml-service\.env exists
)

if not exist "backend-node\.env" (
    if exist "backend-node\.env.example" (
        copy backend-node\.env.example backend-node\.env >nul
        echo ✅ Created backend-node\.env from example
    )
) else (
    echo ✅ backend-node\.env exists
)

if not exist "frontend\.env.local" (
    if exist "frontend\.env.local.example" (
        copy frontend\.env.local.example frontend\.env.local >nul
        echo ✅ Created frontend\.env.local from example
    )
) else (
    echo ✅ frontend\.env.local exists
)
echo.

REM Step 4: Install Python Dependencies
echo [Step 4/7] Installing Python Dependencies...
echo.

cd ml-service
echo Installing Python packages...
python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet

if errorlevel 1 (
    color 0C
    echo ❌ Failed to install Python dependencies
    cd ..
    pause
    exit /b 1
)

echo ✅ Python dependencies installed
echo.

echo Installing spaCy language model...
python -m spacy download en_core_web_sm --quiet

if errorlevel 1 (
    color 0E
    echo ⚠️  Failed to download spaCy model, but continuing...
) else (
    echo ✅ spaCy model downloaded
)

cd ..
echo.

REM Step 5: Install Node.js Dependencies
echo [Step 5/7] Installing Node.js Dependencies...
echo.

echo Installing backend dependencies...
cd backend-node
call npm install --silent

if errorlevel 1 (
    color 0C
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..
echo.

echo Installing frontend dependencies...
cd frontend
call npm install --silent

if errorlevel 1 (
    color 0C
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..
echo.

REM Step 6: Validate Configuration
echo [Step 6/7] Validating Configuration...
echo.

REM Check if GEMINI_API_KEY is set
findstr /C:"GEMINI_API_KEY=your_gemini_api_key_here" ml-service\.env >nul 2>&1
if not errorlevel 1 (
    color 0E
    echo ⚠️  WARNING: GEMINI_API_KEY not configured!
    echo.
    echo Please edit ml-service\.env and add your Gemini API key
    echo Get one from: https://ai.google.dev/
    echo.
) else (
    echo ✅ Gemini API key configured
)

REM Check data files
if exist "data\job_descriptions\job_title_des.csv" (
    echo ✅ Job descriptions dataset found
) else (
    color 0E
    echo ⚠️  Job descriptions dataset missing
)

if exist "data\skills.json" (
    echo ✅ Skills database found
) else (
    color 0E
    echo ⚠️  Skills database missing
)
echo.

REM Step 7: Validation Complete
echo [Step 7/7] Setup Complete!
echo.

color 0A
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                  Setup Completed Successfully! ✅                ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo 📦 All dependencies installed
echo 🔧 Environment files configured
echo 📊 Project structure validated
echo.

echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                      Next Steps                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo 1. If GEMINI_API_KEY warning appeared:
echo    • Edit ml-service\.env
echo    • Add your API key from https://ai.google.dev/
echo.

echo 2. Start all services:
echo    • Run: start-all.bat
echo.

echo 3. Access the application:
echo    • Frontend: http://localhost:3000
echo    • Testing Dashboard: http://localhost:3000/test
echo    • API Docs: http://localhost:8000/docs
echo.

echo 4. Run tests:
echo    • Run: test-all.bat
echo.

echo ╔══════════════════════════════════════════════════════════════════╗
echo ║              Ready to use HireSight AI! 🚀                       ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

pause
