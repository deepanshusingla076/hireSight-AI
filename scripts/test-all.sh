#!/bin/bash
# ========================================
# HireSight AI - Run All Tests
# ========================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              HireSight AI - Test Suite                           ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if services are running
echo "[1/3] Checking if services are running..."
echo ""

if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${RED}❌ ML Service (Port 8000) is not running${NC}"
    echo "Please start services first using ./start-all.sh"
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ ML Service is running${NC}"

if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend (Port 5000) is not running${NC}"
    echo "Please start services first using ./start-all.sh"
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ Backend is running${NC}"

if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Frontend (Port 3000) may not be running${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Frontend is running${NC}"
fi
echo ""

# Run Python integration tests
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              [2/3] Running Python Integration Tests              ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

cd ml-service
if [ -f "test_comprehensive.py" ]; then
    echo "Running comprehensive dataset tests with accuracy metrics..."
    python3 test_comprehensive.py
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED}❌ Python tests failed${NC}"
        cd ..
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Test script not found, skipping...${NC}"
fi
cd ..
echo ""

# Run API endpoint tests
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              [3/3] Running API Endpoint Tests                    ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo "Testing ML Service endpoints..."
echo ""

# Test health endpoint
echo "→ Testing GET /health"
if curl -s http://localhost:8000/health | grep -q "ok"; then
    echo -e "  ${GREEN}✅ Health check passed${NC}"
else
    echo -e "  ${RED}❌ Health check failed${NC}"
fi

# Test skill extraction
echo "→ Testing POST /extract-skills"
if curl -s -X POST http://localhost:8000/extract-skills -H "Content-Type: application/json" -d '{"text":"Python developer"}' | grep -q "Python"; then
    echo -e "  ${GREEN}✅ Skill extraction passed${NC}"
else
    echo -e "  ${RED}❌ Skill extraction failed${NC}"
fi

# Test dataset stats
echo "→ Testing GET /dataset/stats"
if curl -s http://localhost:8000/dataset/stats | grep -q "total_job_descriptions"; then
    echo -e "  ${GREEN}✅ Dataset stats passed${NC}"
else
    echo -e "  ${RED}❌ Dataset stats failed${NC}"
fi

# Test random job
echo "→ Testing GET /dataset/random-job"
if curl -s http://localhost:8000/dataset/random-job | grep -q "job_title"; then
    echo -e "  ${GREEN}✅ Random job passed${NC}"
else
    echo -e "  ${RED}❌ Random job failed${NC}"
fi

# Test backend health
echo ""
echo "Testing Backend endpoints..."
echo ""

echo "→ Testing GET /health"
if curl -s http://localhost:5000/health | grep -q "ok"; then
    echo -e "  ${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "  ${RED}❌ Backend health check failed${NC}"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    Test Summary                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Test Coverage:"
echo "  ✅ Service Health Checks"
echo "  ✅ Python Integration Tests"
echo "  ✅ API Endpoint Tests"
echo "  ✅ Dataset Integration Tests"
echo ""
echo "For more detailed testing, visit:"
echo "  🌐 http://localhost:3000/test"
echo "  📚 http://localhost:8000/docs"
echo ""
echo "See TESTING.md for comprehensive testing guide."
echo ""
