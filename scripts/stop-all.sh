#!/bin/bash
# ========================================
# HireSight AI - Stop All Services
# ========================================

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           HireSight AI - Stopping All Services                   ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo "Stopping all HireSight AI services..."
echo ""

# Kill processes on port 3000 (Frontend)
echo "Stopping Frontend (Port 3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo "  (No process found on port 3000)"
fi

# Kill processes on port 5000 (Backend)
echo "Stopping Backend (Port 5000)..."
lsof -ti:5000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo "  (No process found on port 5000)"
fi

# Kill processes on port 8000 (ML Service)
echo "Stopping ML Service (Port 8000)..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ ML Service stopped${NC}"
else
    echo "  (No process found on port 8000)"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                  All Services Stopped!                           ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "All HireSight AI services have been stopped."
echo ""
echo "You can restart them using: ./start-all.sh"
echo ""
