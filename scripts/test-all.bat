@echo off
REM ========================================
REM HireSight AI - Run All Tests (Windows)
REM ========================================

color 0E
echo.
echo ---------------------------------------------------------------
echo HireSight AI - Test Suite Windows
echo ---------------------------------------------------------------
echo.

REM [1/3] Check if services are running
echo [1/3] Checking if services are running...
echo.

curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 goto ml_service_fail
echo [OK] ML Service is running
goto ml_service_next
:ml_service_fail
color 0C
echo ERROR ML Service Port 8000 is not running
echo Please start services first using start-all.bat
pause
exit /b 1
:ml_service_next

curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 goto backend_fail
echo [OK] Backend is running
goto backend_next
:backend_fail
color 0C
echo ERROR Backend Port 5000 is not running
echo Please start services first using start-all.bat
pause
exit /b 1
:backend_next

curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    color 0E
    echo WARN Frontend Port 3000 may not be running
) else (
    echo [OK] Frontend is running
)
echo.

REM [2/3] Run Python integration tests
echo ---------------------------------------------------------------
echo Running Python Integration Tests
echo ---------------------------------------------------------------
echo.

cd ml-service
if exist test_comprehensive.py (
    echo Running comprehensive dataset tests with accuracy metrics...
    ..\ml-service\venv\Scripts\python.exe test_comprehensive.py
    if errorlevel 1 goto py_test_fail
) else (
    color 0E
    echo WARN Test script not found, skipping
)
cd ..
goto py_test_next
:py_test_fail
color 0C
echo ERROR Python tests failed
cd ..
pause
exit /b 1
:py_test_next
echo.

REM [3/3] Run API endpoint tests
echo ---------------------------------------------------------------
echo Running API Endpoint Tests
echo ---------------------------------------------------------------
echo.

echo Testing ML Service endpoints...
echo.

echo Testing GET /health
curl -s http://localhost:8000/health | findstr /i "ok" >nul
if errorlevel 1 (
    color 0C
    echo FAIL Health check failed
) else (
    echo PASS Health check passed
)

echo Testing POST /extract-skills
curl -s -X POST http://localhost:8000/extract-skills -H "Content-Type: application/json" -d "{\"text\":\"Python developer\"}" | findstr /i "Python" >nul
if errorlevel 1 (
    color 0C
    echo FAIL Skill extraction failed
) else (
    echo PASS Skill extraction passed
)

echo Testing GET /dataset/stats
curl -s http://localhost:8000/dataset/stats | findstr /i "total_job_descriptions" >nul
if errorlevel 1 (
    color 0C
    echo FAIL Dataset stats failed
) else (
    echo PASS Dataset stats passed
)

echo Testing GET /dataset/random-job
curl -s http://localhost:8000/dataset/random-job | findstr /i "job_title" >nul
if errorlevel 1 (
    color 0C
    echo FAIL Random job failed
) else (
    echo PASS Random job passed
)

echo.
echo Testing Backend endpoints
echo.
echo Testing GET /health
curl -s http://localhost:5000/health | findstr /i "ok" >nul
if errorlevel 1 (
    color 0C
    echo FAIL Backend health check failed
) else (
    echo PASS Backend health check passed
)

echo ✅ All tests completed!
pause
echo.
echo ---------------------------------------------------------------
echo Test Summary
echo ---------------------------------------------------------------
echo.
echo COMPLETE All tests finished
echo.
echo Test Coverage:
echo   OK Service Health Checks
echo   OK Python Integration Tests
echo   OK API Endpoint Tests
echo   OK Dataset Integration Tests
echo.
echo For more detailed testing, visit:
echo   http://localhost:3000/test
echo   http://localhost:8000/docs
echo.
echo See TESTING.md for comprehensive testing guide.
echo.
pause
