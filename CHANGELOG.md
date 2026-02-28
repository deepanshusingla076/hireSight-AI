# Changelog

All notable changes to the HireSight AI project.

## [1.0.0] - 2026-03-01

### 🎯 Major Project Organization

#### Added

- ✅ Created `docs/` folder for all documentation
- ✅ Created `scripts/` folder for all automation scripts
- ✅ Added convenience wrapper scripts in root:
  - `setup.bat` - Easy setup
  - `start.bat` / `start.sh` - Start all services
  - `stop.bat` / `stop.sh` - Stop all services
  - `test.bat` - Comprehensive test suite
- ✅ Added PROJECT_SUMMARY.md - Complete project overview
- ✅ Added CHANGELOG.md - This file

#### Moved

- 📁 Moved all markdown documentation to `docs/`:
  - BACKEND.md
  - FRONTEND.md
  - ML_SERVICE.md
  - TESTING.md
  - QUICK_START.md
  - USER_GUIDE.txt
- 📁 Moved all automation scripts to `scripts/`:
  - start-all.bat / start-all.sh
  - stop-all.bat / stop-all.sh
  - setup-complete.bat
  - test-all.sh

#### Removed

- ❌ Removed redundant bat files:
  - setup-auto.bat (functionality in setup-complete.bat)
  - validate-all.bat (similar to test-all.bat)
  - verify-python.bat (simple check, not needed)
  - test-all.bat (Windows version, functionality in test.bat)
- ❌ Removed redundant documentation files:
  - DEPLOYMENT_READY.txt (status info, outdated)
  - FEATURES.txt (content in README)
  - PROJECT_STATUS.txt (status info, outdated)
  - SETUP_NEXT_STEPS.txt (temporary instructions)

#### Fixed

- 🔧 Fixed numpy version conflict in ml-service/requirements.txt
  - Changed from numpy==2.2.4 to numpy==1.26.4
  - Now compatible with pandas 2.1.4 and spacy 3.8.3
- 🔧 Updated README.md with correct folder paths
- 🔧 Updated all documentation references

#### Improved

- 📖 Better organized project structure
- 🚀 Easier to navigate and use
- ✅ Cleaner root directory
- 📝 Comprehensive testing with test.bat
- 🎯 Clear documentation hierarchy

### Technical Details

#### Dependencies

- Python 3.10+
- Node.js 18+
- ML Service: FastAPI, spaCy, PyPDF2, Gemini AI
- Backend: Express.js
- Frontend: Next.js 16, TypeScript, Tailwind CSS

#### Project Structure

```
resume-ai/
├── backend-node/     # Node.js backend
├── frontend/         # Next.js frontend
├── ml-service/       # Python ML service
├── data/             # Datasets (63K+ jobs)
├── docs/             # Documentation (6 files)
├── scripts/          # Automation scripts (6 scripts)
├── start.bat/sh      # Convenience wrappers
├── stop.bat/sh
├── setup.bat
├── test.bat
├── README.md         # Main docs
└── PROJECT_SUMMARY.md # Project overview
```

### Testing

- Comprehensive test suite validates:
  - Prerequisites
  - Project structure
  - Dependencies
  - Configuration
  - Dataset
  - Documentation
  - Scripts

---

## Previous Releases

### [0.9.0] - Initial Development

- Frontend implementation
- Backend API gateway
- ML service with spaCy and Gemini AI
- Dataset integration (63K+ jobs)
- Basic documentation

---

**For detailed information, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**
