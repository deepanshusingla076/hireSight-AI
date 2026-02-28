# Quick Setup Script for Windows

Write-Host "🚀 HireSight AI - Quick Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion found`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js $nodeVersion found`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 16+ first." -ForegroundColor Red
    exit 1
}

# Setup ML Service
Write-Host "Setting up ML Service..." -ForegroundColor Cyan
Set-Location ml-service

Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "Downloading spaCy model..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm

Write-Host "✅ ML Service setup complete!`n" -ForegroundColor Green

deactivate
Set-Location ..

# Setup Backend
Write-Host "Setting up Node.js Backend..." -ForegroundColor Cyan
Set-Location backend-node

Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✅ Backend setup complete!`n" -ForegroundColor Green

Set-Location ..

# Done
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "To start the services:`n" -ForegroundColor Yellow

Write-Host "1. ML Service (Terminal 1):" -ForegroundColor Cyan
Write-Host "   cd ml-service" -ForegroundColor White
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   uvicorn app.main:app --reload`n" -ForegroundColor White

Write-Host "2. Backend (Terminal 2):" -ForegroundColor Cyan
Write-Host "   cd backend-node" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor White

Write-Host "Then visit:" -ForegroundColor Yellow
Write-Host "   - Backend: http://localhost:5000" -ForegroundColor White
Write-Host "   - ML Service: http://localhost:8000" -ForegroundColor White
Write-Host "   - API Docs: http://localhost:8000/docs`n" -ForegroundColor White

Write-Host "📚 See PHASE_5_6_COMPLETE.md for usage examples!" -ForegroundColor Cyan
