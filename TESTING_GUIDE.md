# 🎯 HireSight AI - Clean Project Organization

## 📁 Project Structure

```
resume-ai/
├── 📂 backend-node/          # Node.js Express API Gateway
├── 📂 frontend/              # Next.js 16 React Application
├── 📂 ml-service/            # Python FastAPI ML Service
│   ├── test_comprehensive.py    # ⭐ NEW: Comprehensive testing with accuracy metrics
│   └── test_dataset_integration.py  # Basic integration tests
├── 📂 data/                  # Datasets (63K+ jobs)
├── 📂 docs/                  # Complete Documentation
├── 📂 scripts/               # Automation Scripts
│   ├── start-all.bat/sh      # Start all services
│   ├── stop-all.bat/sh       # Stop all services
│   ├── setup-complete.bat    # Complete setup
│   └── test-all.bat/sh       # Run comprehensive tests
├── 📄 setup.bat              # Quick setup wrapper
├── 📄 start.bat/sh           # Quick start wrapper
├── 📄 stop.bat/sh            # Quick stop wrapper
├── 📄 test.bat               # Quick test wrapper (⭐ NEW)
└── 📄 README.md              # Main documentation
```

## 🚀 Quick Start (3 Simple Commands)

### 1️⃣ Setup (First Time Only)

```bash
setup.bat
```

This installs all dependencies and sets up the ML service.

### 2️⃣ Start Application

```bash
start.bat
```

This starts all three services (ML, Backend, Frontend).

### 3️⃣ Run Comprehensive Tests

```bash
test.bat
```

**⭐ NEW: Enhanced testing with accuracy metrics!**

## 🧪 Comprehensive Testing Features

The new `test.bat` runs `test_comprehensive.py` which provides:

### 📊 What's Tested:

1. **Dataset Statistics** - Verifies 63K+ job descriptions
2. **Resume Parsing** - Tests accuracy across 10 samples
3. **Skill Extraction** - Tests NLP accuracy across 15 samples
4. **Job Matching** - Tests matching algorithm with 10 pairs
5. **Job Search** - Tests search functionality with multiple queries
6. **End-to-End Workflow** - Full integration tests with 5 complete runs

### 📈 Accuracy Metrics Provided:

- ✅ **Success Rate** - Percentage of successful operations
- ⏱️ **Performance Timing** - Average processing times
- 📊 **Quality Metrics** - Min/Max/Average scores
- 🎯 **Coverage Analysis** - Skills found, matches made
- 📋 **Detailed Reports** - Color-coded results with statistics

### Example Output:

```
======================================================================
  RESUME PARSING ACCURACY TEST (10 samples)
======================================================================

  Total Samples:     10
  Successful:        10
  Failed:            0
  Accuracy:          100.00%
  Avg Parse Time:    0.523s
  Avg Text Length:   2,847 chars

======================================================================
  SKILL EXTRACTION ACCURACY TEST (15 samples)
======================================================================

  Total Samples:     15
  Successful:        15
  Failed:            0
  Accuracy:          100.00%
  Avg Skills Found:  12.3
  Min Skills:        6
  Max Skills:        18
  Avg Extraction Time: 0.234s

======================================================================
  COMPREHENSIVE TEST REPORT
======================================================================

Test Summary:

  [PASS] Dataset Statistics
  [PASS] Resume Parsing
  [PASS] Skill Extraction
  [PASS] Job Matching
  [PASS] Job Search
  [PASS] End-to-End Workflow

Overall Results:
  Total Tests:       6
  Passed:            6
  Failed:            0
  Overall Accuracy:  100.00%

✓ TEST SUITE PASSED!
The system is working with 100.00% accuracy.
```

## 🎯 Running Tests

### Option 1: Quick Test (Recommended)

```bash
test.bat
```

Runs comprehensive tests with accuracy metrics

### Option 2: Full Test Suite

```bash
scripts\test-all.bat
```

Runs services health checks + comprehensive tests + API endpoint tests

### Option 3: Direct Python Test

```bash
cd ml-service
venv\Scripts\python.exe test_comprehensive.py
```

## 📋 Test Metrics Explained

### Resume Parsing Accuracy

- **Target:** ≥ 80%
- **Measures:** PDF text extraction success rate
- **Samples:** 10 random resumes from different categories

### Skill Extraction Accuracy

- **Target:** ≥ 85%
- **Measures:** NLP skill identification success rate
- **Samples:** 15 random resumes
- **Metrics:** Skills found per resume, extraction time

### Matching Accuracy

- **Target:** ≥ 80% completion
- **Measures:** Resume-to-job matching algorithm
- **Samples:** 10 random resume-job pairs
- **Metrics:** Match score, fit score, processing time

### End-to-End Success Rate

- **Target:** ≥ 80%
- **Measures:** Complete workflow from resume to analysis
- **Samples:** 5 full workflows
- **Metrics:** Total time, success rate

## 🔧 If Tests Fail

### 1. Check ML Service Setup

```bash
cd ml-service
venv\Scripts\python.exe -m pip list | findstr spacy
```

Verify spaCy is installed.

### 2. Verify Dataset

```bash
dir data\job_descriptions\job_title_des.csv
dir data\skills.json
dir data\sample_resumes
```

Ensure all dataset files exist.

### 3. Check Dependencies

```bash
setup.bat
```

Reinstall all dependencies.

### 4. Review Test Output

The test provides detailed error messages for each failed component.

## 🎨 Color-Coded Output

- 🟢 **Green** - Success, passing tests, high accuracy
- 🟡 **Yellow** - Warnings, missing optional features
- 🔴 **Red** - Errors, failed tests, need attention
- 🔵 **Blue** - Information, progress updates
- ⚪ **White** - Results, metrics, summaries

## 📊 Understanding Accuracy Thresholds

| Component        | Threshold | Typical Result |
| ---------------- | --------- | -------------- |
| Resume Parsing   | 80%       | 95-100%        |
| Skill Extraction | 85%       | 90-100%        |
| Job Matching     | 80%       | 85-95%         |
| End-to-End       | 80%       | 90-100%        |
| **Overall**      | **80%**   | **95-100%**    |

## 🚦 Test Status Indicators

✓ **PASS** - Component working correctly  
✗ **FAIL** - Component needs attention  
⚠ **WARN** - Optional feature unavailable

## 📝 Next Steps After Testing

1. ✅ All tests pass → Start services with `start.bat`
2. ⚠️ Some tests fail → Review errors, check setup
3. 🔧 Need help → Check docs/ folder for detailed guides

## 🔗 Related Documentation

- [Setup Guide](docs/QUICK_START.md) - Detailed setup instructions
- [ML Service](docs/ML_SERVICE.md) - ML service architecture
- [Testing Guide](docs/TESTING.md) - Extended testing documentation
- [User Guide](docs/USER_GUIDE.txt) - Complete user manual

## 🎉 Benefits of Clean Organization

✅ **Simple Commands** - Just 3 commands to get started  
✅ **Comprehensive Testing** - Detailed accuracy metrics  
✅ **Clean Structure** - No cluttered bat files everywhere  
✅ **Easy to Use** - Wrapper scripts for convenience  
✅ **Well Organized** - Everything in its proper folder  
✅ **Professional** - Production-ready project layout

---

**Made with ❤️ by HireSight AI Team**  
_Last Updated: March 1, 2026_
