# Skill Extraction & Matching API Guide

Complete guide for testing the skill extraction and matching features.

## 📋 Table of Contents

1. [Setup](#setup)
2. [Skill Extraction](#skill-extraction)
3. [Matching Engine](#matching-engine)
4. [Skills Database](#skills-database)
5. [Complete Workflow](#complete-workflow)

---

## Setup

### Install spaCy Model (Required)

```bash
pip install spacy
python -m spacy download en_core_web_sm
```

### Start the Service

```bash
cd ml-service
uvicorn app.main:app --reload
```

Server: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

## Skill Extraction

### 1. Extract Skills from Text

**Endpoint:** `POST /extract-skills`

**Request:**
```bash
curl -X POST http://localhost:8000/extract-skills \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am a software engineer with 5 years of experience in Python, JavaScript, React, Node.js, Docker, Kubernetes, AWS, and MongoDB. I have strong problem-solving and leadership skills."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Skills extracted successfully",
  "data": {
    "skills": [
      "Python", "JavaScript", "React", "Node.js", 
      "Docker", "Kubernetes", "AWS", "MongoDB",
      "Problem Solving", "Leadership"
    ],
    "skill_count": 10,
    "categorized_skills": {
      "technical_skills": ["Python", "JavaScript", "React", "Node.js"],
      "cloud_platforms": ["AWS"],
      "databases": ["MongoDB"],
      "tools": ["Docker", "Kubernetes"],
      "soft_skills": ["Problem Solving", "Leadership"]
    },
    "extraction_methods": {
      "keyword_matching": 8,
      "nlp_extraction": 2
    }
  }
}
```

---

## Matching Engine

### 2. Match Resume to Job

**Endpoint:** `POST /match`

#### Option A: Using Job Description

```bash
curl -X POST http://localhost:8000/match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_skills": [
      "Python", "JavaScript", "React", "Node.js", 
      "Docker", "AWS", "PostgreSQL"
    ],
    "job_description": "We are looking for a full-stack developer with experience in Python, React, Docker, Kubernetes, AWS, and MongoDB. Strong problem-solving skills required."
  }'
```

#### Option B: Using Job Skills List

```bash
curl -X POST http://localhost:8000/match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_skills": [
      "Python", "JavaScript", "React", "Node.js", 
      "Docker", "AWS", "PostgreSQL"
    ],
    "job_skills": [
      "Python", "React", "Docker", "Kubernetes", 
      "AWS", "MongoDB", "Problem Solving"
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Match calculated successfully",
  "data": {
    "match_score": 71.43,
    "confidence": "medium",
    "matched_skills": ["Python", "React", "Docker", "AWS"],
    "missing_skills": ["Kubernetes", "MongoDB", "Problem Solving"],
    "extra_skills": ["JavaScript", "Node.js", "PostgreSQL"],
    "statistics": {
      "total_job_requirements": 7,
      "total_resume_skills": 7,
      "matched_count": 4,
      "missing_count": 3,
      "extra_count": 3
    },
    "recommendation": "Good match. Consider applying with emphasis on matched skills."
  }
}
```

---

### 3. Batch Match (Multiple Jobs)

**Endpoint:** `POST /batch-match`

```bash
curl -X POST http://localhost:8000/batch-match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_skills": [
      "Python", "JavaScript", "React", "Node.js", 
      "Docker", "AWS", "PostgreSQL"
    ],
    "job_listings": [
      {
        "title": "Full Stack Developer",
        "skills": ["Python", "React", "Docker", "PostgreSQL", "AWS"]
      },
      {
        "title": "Backend Engineer",
        "skills": ["Python", "Node.js", "Docker", "Kubernetes", "MongoDB"]
      },
      {
        "title": "Frontend Developer",
        "skills": ["JavaScript", "React", "TypeScript", "Redux", "CSS"]
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Batch match completed successfully",
  "data": {
    "total_jobs": 3,
    "best_match": {
      "job_title": "Full Stack Developer",
      "match_score": 100.0,
      "matched_skills": ["Python", "React", "Docker", "PostgreSQL", "AWS"],
      "missing_skills": [],
      "recommendation": "Excellent match! Highly recommended to apply."
    },
    "matches": [
      {
        "job_title": "Full Stack Developer",
        "match_score": 100.0,
        "matched_skills": ["Python", "React", "Docker", "PostgreSQL", "AWS"],
        "missing_skills": [],
        "recommendation": "Excellent match! Highly recommended to apply."
      },
      {
        "job_title": "Backend Engineer",
        "match_score": 60.0,
        "matched_skills": ["Python", "Node.js", "Docker"],
        "missing_skills": ["Kubernetes", "MongoDB"],
        "recommendation": "Good match. Consider applying..."
      },
      {
        "job_title": "Frontend Developer",
        "match_score": 40.0,
        "matched_skills": ["JavaScript", "React"],
        "missing_skills": ["TypeScript", "Redux", "CSS"],
        "recommendation": "Moderate match. Consider upskilling..."
      }
    ],
    "average_score": 66.67
  }
}
```

---

### 4. Skill Gap Analysis

**Endpoint:** `POST /skill-gap`

```bash
curl -X POST http://localhost:8000/skill-gap \
  -H "Content-Type: application/json" \
  -d '{
    "resume_skills": [
      "Python", "JavaScript", "React", "Node.js", "Docker"
    ],
    "target_skills": [
      "Python", "JavaScript", "React", "Docker", "Kubernetes",
      "AWS", "TypeScript", "GraphQL", "MongoDB", "Redis"
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Skill gap analysis completed",
  "data": {
    "current_skills": [
      "Python", "JavaScript", "React", "Node.js", "Docker"
    ],
    "target_skills": [
      "Python", "JavaScript", "React", "Docker", "Kubernetes",
      "AWS", "TypeScript", "GraphQL", "MongoDB", "Redis"
    ],
    "skills_achieved": ["Python", "JavaScript", "React", "Docker"],
    "skills_to_learn": [
      "Kubernetes", "AWS", "TypeScript", "GraphQL", "MongoDB", "Redis"
    ],
    "progress_percentage": 40.0,
    "priorities": {
      "critical": ["Kubernetes", "AWS", "TypeScript", "GraphQL", "MongoDB"],
      "optional": ["Redis"]
    }
  }
}
```

---

## Skills Database

### 5. Get All Skills

**Endpoint:** `GET /skills/all`

```bash
curl http://localhost:8000/skills/all
```

**Response:**
```json
{
  "success": true,
  "message": "Skills retrieved successfully",
  "data": {
    "technical_skills": ["Python", "JavaScript", "Java", "..."],
    "soft_skills": ["Communication", "Leadership", "..."],
    "databases": ["MySQL", "PostgreSQL", "MongoDB", "..."],
    "cloud_platforms": ["AWS", "Azure", "GCP", "..."],
    "tools": ["Docker", "Kubernetes", "Git", "..."]
  }
}
```

---

### 6. Search Skills

**Endpoint:** `GET /skills/search?query=python`

```bash
curl "http://localhost:8000/skills/search?query=python"
```

**Response:**
```json
{
  "success": true,
  "message": "Found 2 matching skills",
  "data": {
    "query": "python",
    "matches": ["Python", "Python-multipart"],
    "count": 2
  }
}
```

---

## Complete Workflow

### End-to-End: Upload Resume → Extract Skills → Match Job

#### Step 1: Parse Resume and Extract Skills

```bash
curl -X POST http://localhost:8000/parse-and-extract \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed and skills extracted successfully",
  "data": {
    "text": "John Doe\nSoftware Engineer...",
    "char_count": 2345,
    "word_count": 456,
    "skills": ["Python", "JavaScript", "React", "Docker", "AWS"],
    "skill_count": 5,
    "categorized_skills": { "..." }
  }
}
```

#### Step 2: Use Extracted Skills to Match Jobs

```bash
curl -X POST http://localhost:8000/batch-match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_skills": ["Python", "JavaScript", "React", "Docker", "AWS"],
    "job_listings": [
      {
        "title": "Full Stack Developer",
        "description": "Looking for developer with Python, React, Docker experience..."
      }
    ]
  }'
```

---

## Using Python `requests`

```python
import requests

# Extract skills
response = requests.post(
    'http://localhost:8000/extract-skills',
    json={
        'text': 'I have experience with Python, React, and AWS'
    }
)
print(response.json())

# Match resume to job
response = requests.post(
    'http://localhost:8000/match',
    json={
        'resume_skills': ['Python', 'React', 'AWS'],
        'job_skills': ['Python', 'React', 'Docker', 'Kubernetes']
    }
)
print(response.json())
```

---

## Testing Tips

1. **Interactive Docs**: Visit `http://localhost:8000/docs` to test all endpoints in browser
2. **Skills Database**: Check `/skills/all` to see available skills
3. **Case Insensitive**: Matching is case-insensitive
4. **Multiple Methods**: Skill extraction uses both keyword matching and NLP
5. **Batch Processing**: Use `/batch-match` for comparing multiple job opportunities

---

## Match Score Interpretation

| Score | Confidence | Recommendation |
|-------|-----------|----------------|
| 80-100% | High | Excellent match! Apply now |
| 60-79% | Medium | Good match, Consider applying |
| 40-59% | Low | Moderate match, Upskill first |
| 20-39% | Very Low | Significant gap exists |
| 0-19% | Very Low | Poor match, Training needed |

---

## Common Use Cases

### 1. Career Planning
Use `/skill-gap` to identify skills needed for target role

### 2. Job Search
Use `/batch-match` to find best job opportunities

### 3. Resume Optimization
Use `/match` to see how well your resume matches job description

### 4. Skill Assessment
Use `/extract-skills` to audit your current skill set

---

**Happy Matching! 🎯**
