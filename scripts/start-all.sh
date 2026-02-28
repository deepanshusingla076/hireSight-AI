#!/bin/bash
# ========================================
# HireSight AI - Start All Services
# ========================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           HireSight AI - Starting All Services                   ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
echo "[1/4] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ ERROR: Python 3 is not installed${NC}"
    echo "Please install Python 3.10+ from https://www.python.org/downloads/"
    exit 1
fi
echo -e "${GREEN}✅ Python found${NC}"
echo ""

# Check if Node.js is installed
echo "[2/4] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ ERROR: Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found${NC}"
echo ""

# Check if required files exist
echo "[3/4] Checking project structure..."
if [ ! -f "ml-service/app/main.py" ]; then
    echo -e "${RED}❌ ERROR: ML service files not found${NC}"
    exit 1
fi
if [ ! -f "backend-node/src/server.js" ]; then
    echo -e "${RED}❌ ERROR: Backend files not found${NC}"
    exit 1
fi
if [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ ERROR: Frontend files not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ All project files found${NC}"
echo ""

# Check environment variables
echo "[4/4] Checking environment configuration..."
if [ ! -f "ml-service/.env" ]; then
    echo -e "${YELLOW}⚠️  WARNING: ml-service/.env not found${NC}"
    echo "Please create .env file with GEMINI_API_KEY"
    echo ""
fi
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  WARNING: frontend/.env.local not found${NC}"
    echo ""
fi
echo ""

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                  Starting Services...                            ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Start ML Service
echo "🤖 Starting Python ML Service (Port 8000)..."
cd ml-service
if [ "$(uname)" == "Darwin" ]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && echo \"Starting ML Service...\" && uvicorn app.main:app --reload --port 8000"'
else
    # Linux
    gnome-terminal -- bash -c "cd $(pwd) && echo 'Starting ML Service...' && uvicorn app.main:app --reload --port 8000; exec bash" &
fi
cd ..
sleep 3
echo ""

# Start Backend
echo "🔧 Starting Node.js Backend (Port 5000)..."
cd backend-node
if [ "$(uname)" == "Darwin" ]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && echo \"Starting Backend...\" && npm run dev"'
else
    # Linux
    gnome-terminal -- bash -c "cd $(pwd) && echo 'Starting Backend...' && npm run dev; exec bash" &
fi
cd ..
sleep 3
echo ""

# Start Frontend
echo "🎨 Starting Next.js Frontend (Port 3000)..."
cd frontend
if [ "$(uname)" == "Darwin" ]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && echo \"Starting Frontend...\" && npm run dev"'
else
    # Linux
    gnome-terminal -- bash -c "cd $(pwd) && echo 'Starting Frontend...' && npm run dev; exec bash" &
fi
cd ..
sleep 3
echo ""

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                     Services Started!                            ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Services are starting up..."
echo ""
echo "Wait ~30 seconds for all services to initialize, then access:"
echo ""
echo "   Frontend:          http://localhost:3000"
echo "   Testing Dashboard: http://localhost:3000/test"
echo "   Backend API:       http://localhost:5000/health"
echo "   ML Service API:    http://localhost:8000/health"
echo "   API Docs:          http://localhost:8000/docs"
echo ""
echo "💡 TIP: Check the opened terminal windows for service logs"
echo ""
echo "Opening application in browser in 30 seconds..."

# Wait for services to start
sleep 30

# Open browser
if [ "$(uname)" == "Darwin" ]; then
    # macOS
    open http://localhost:3000
else
    # Linux
    xdg-open http://localhost:3000
fi

echo ""
echo -e "${GREEN}✅ Application opened in browser!${NC}"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo ""
