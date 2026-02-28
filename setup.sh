#!/bin/bash

echo "🚀 HireSight AI - Quick Setup"
echo "================================"
echo ""

# Check Python
echo "Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ $PYTHON_VERSION found"
    echo ""
else
    echo "❌ Python not found. Please install Python 3.8+ first."
    exit 1
fi

# Check Node.js
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js $NODE_VERSION found"
    echo ""
else
    echo "❌ Node.js not found. Please install Node.js 16+ first."
    exit 1
fi

# Setup ML Service
echo "Setting up ML Service..."
cd ml-service

echo "Creating virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm

echo "✅ ML Service setup complete!"
echo ""

deactivate
cd ..

# Setup Backend
echo "Setting up Node.js Backend..."
cd backend-node

echo "Installing Node.js dependencies..."
npm install

echo "✅ Backend setup complete!"
echo ""

cd ..

# Done
echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo ""

echo "To start the services:"
echo ""

echo "1. ML Service (Terminal 1):"
echo "   cd ml-service"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""

echo "2. Backend (Terminal 2):"
echo "   cd backend-node"
echo "   npm run dev"
echo ""

echo "Then visit:"
echo "   - Backend: http://localhost:5000"
echo "   - ML Service: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""

echo "📚 See PHASE_5_6_COMPLETE.md for usage examples!"
