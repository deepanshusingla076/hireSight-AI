@echo off
REM ========================================
REM HireSight AI - Comprehensive Test Suite
REM ========================================

color 0E
echo.
echo ---------------------------------------------------------------
echo HireSight AI - Comprehensive Testing
echo ---------------------------------------------------------------
echo.

echo Running comprehensive dataset tests with accuracy metrics...
echo.

REM Ensure required dataset files are present in ml-service/data
if not exist ml-service\data mkdir ml-service\data
copy /Y data\Resume.csv ml-service\data\Resume.csv >nul 2>&1
if not exist ml-service\data\job_descriptions mkdir ml-service\data\job_descriptions
xcopy /Y /E /I data\job_descriptions ml-service\data\job_descriptions >nul 2>&1
if not exist ml-service\data\sample_resumes mkdir ml-service\data\sample_resumes
xcopy /Y /E /I data\sample_resumes ml-service\data\sample_resumes >nul 2>&1

cd ml-service
if exist test_comprehensive.py (
    venv\Scripts\python.exe test_comprehensive.py
    set TEST_RESULT=%ERRORLEVEL%
) else (
    color 0C
    echo ERROR: test_comprehensive.py not found in ml-service folder
    echo Please ensure the ML service is properly set up.
    set TEST_RESULT=1
)
cd ..

if %TEST_RESULT% EQU 0 (
    color 0A
    echo.
    echo ---------------------------------------------------------------
    echo All tests passed successfully!
    echo ---------------------------------------------------------------
) else (
    color 0C
    echo.
    echo ---------------------------------------------------------------
    echo Some tests failed. Please review the output above.
    echo ---------------------------------------------------------------
)

echo.
pause

