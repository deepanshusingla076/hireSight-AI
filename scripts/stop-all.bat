@echo off
REM ========================================
REM HireSight AI - Stop All Services
REM ========================================

color 0C
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║           HireSight AI - Stopping All Services                   ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo Stopping all HireSight AI services...
echo.

REM Kill processes on port 3000 (Frontend)
echo Stopping Frontend (Port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo ✅ Frontend stopped

REM Kill processes on port 5000 (Backend)
echo Stopping Backend (Port 5000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo ✅ Backend stopped

REM Kill processes on port 8000 (ML Service)
echo Stopping ML Service (Port 8000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo ✅ ML Service stopped

REM Also kill any Node.js and Python processes related to the project
echo.
echo Cleaning up remaining processes...
taskkill /F /FI "WINDOWTITLE eq ML Service*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Backend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Frontend*" >nul 2>&1

echo.
color 0A
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                  All Services Stopped!                           ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo All HireSight AI services have been stopped.
echo.
echo You can restart them using: start-all.bat
echo.
pause
