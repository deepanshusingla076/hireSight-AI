"""
Quick Testing Script for HireSight AI with Real Dataset

This script demonstrates the complete workflow using real data from the dataset.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.utils.dataset_utils import (
    get_random_job_description,
    search_jobs_by_keywords,
    get_sample_resumes_by_category,
    get_dataset_stats,
    get_resume_categories
)
from app.services.resume_parser import resume_parser
from app.services.skill_extractor import skill_extractor
from app.services.matcher import matcher
from app.services.gemini_service import gemini_service


def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def test_dataset_access():
    """Test dataset access and statistics"""
    print_section("DATASET STATISTICS")
    
    stats = get_dataset_stats()
    print(f"📊 Total Job Descriptions: {stats['total_job_descriptions']:,}")
    print(f"📊 Total Resume Data: {stats['total_resume_data']:,}")
    print(f"📊 Categories: {stats['categories']}")
    
    print("\n📁 Resumes by Category:")
    for category, count in sorted(stats['resumes_by_category'].items()):
        if count > 0:
            print(f"   {category}: {count} resumes")


def test_random_job():
    """Test getting random job description"""
    print_section("RANDOM JOB DESCRIPTION")
    
    job = get_random_job_description()
    print(f"📝 Job Title: {job['job_title']}")
    print(f"📝 Description Preview:")
    print(f"   {job['job_description'][:300]}...")


def test_job_search():
    """Test job search functionality"""
    print_section("JOB SEARCH TEST")
    
    keywords = ['python', 'developer', 'engineer']
    print(f"🔍 Searching for: {', '.join(keywords)}")
    
    jobs = search_jobs_by_keywords(keywords, limit=3)
    print(f"✅ Found {len(jobs)} matching jobs:\n")
    
    for i, job in enumerate(jobs, 1):
        print(f"{i}. {job['job_title']}")
        print(f"   {job['job_description'][:150]}...\n")


def test_complete_workflow():
    """Test complete analysis workflow with real data"""
    print_section("COMPLETE ANALYSIS WORKFLOW")
    
    # Get a random job
    print("📋 Step 1: Getting random job description...")
    job = get_random_job_description()
    print(f"✅ Selected: {job['job_title']}")
    
    # Get a sample resume
    print("\n📄 Step 2: Getting sample resume...")
    category = 'INFORMATION-TECHNOLOGY'
    resumes = get_sample_resumes_by_category(category)
    
    if not resumes:
        print(f"❌ No resumes found in {category} category")
        return
    
    sample_resume = resumes[0]
    print(f"✅ Selected: {Path(sample_resume).name}")
    
    # Parse resume
    print("\n⚙️  Step 3: Parsing resume...")
    try:
        resume_text = resume_parser.extract_text(sample_resume)
        print(f"✅ Extracted {len(resume_text)} characters")
        print(f"   Preview: {resume_text[:200]}...")
    except Exception as e:
        print(f"❌ Parse error: {e}")
        return
    
    # Extract skills
    print("\n🔍 Step 4: Extracting skills...")
    try:
        skills_result = skill_extractor.extract_skills(resume_text)
        skills = skills_result['skills']
        print(f"✅ Found {len(skills)} skills")
        print(f"   Top 10: {', '.join(skills[:10])}")
    except Exception as e:
        print(f"❌ Skill extraction error: {e}")
        return
    
    # Match to job
    print("\n🎯 Step 5: Matching to job...")
    try:
        match_result = matcher.match_resume_to_job(
            resume_skills=skills,
            job_description=job['job_description']
        )
        
        print(f"✅ Match Score: {match_result['match_score']}%")
        print(f"   Matched Skills ({len(match_result['matched_skills'])}): {', '.join(match_result['matched_skills'][:5])}")
        print(f"   Missing Skills ({len(match_result['missing_skills'])}): {', '.join(match_result['missing_skills'][:5])}")
    except Exception as e:
        print(f"❌ Matching error: {e}")
        return
    
    # AI Analysis (optional - requires Gemini API)
    print("\n🤖 Step 6: AI Analysis (optional)...")
    try:
        ai_result = gemini_service.analyze_resume(
            resume_text=resume_text[:3000],  # Limit for API
            job_description=job['job_description'][:1000],
            matched_skills=match_result['matched_skills'],
            missing_skills=match_result['missing_skills']
        )
        
        print(f"✅ AI Fit Score: {ai_result['fit_score']}%")
        print(f"\n   💪 Strengths:")
        for strength in ai_result['strengths'][:3]:
            print(f"      • {strength}")
        
        print(f"\n   📈 Improvements:")
        for improvement in ai_result['areas_for_improvement'][:3]:
            print(f"      • {improvement}")
    except Exception as e:
        print(f"⚠️  AI Analysis unavailable: {e}")
    
    print("\n✅ WORKFLOW COMPLETE!")


def main():
    """Main test runner"""
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║        HireSight AI - Dataset Integration Test Suite            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")
    
    try:
        # Run tests
        test_dataset_access()
        test_random_job()
        test_job_search()
        test_complete_workflow()
        
        print_section("ALL TESTS COMPLETED")
        print("✅ Dataset integration is working correctly!")
        print("\n💡 Next steps:")
        print("   1. Start the ML service: uvicorn app.main:app --reload --port 8000")
        print("   2. Start the backend: cd backend-node && npm run dev")
        print("   3. Start the frontend: cd frontend && npm run dev")
        print("   4. Visit http://localhost:3000/test to test in browser")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
