"""
HireSight AI - Comprehensive Dataset Testing with Accuracy Metrics

This script tests the ML service with real dataset data and provides
detailed accuracy metrics for skill extraction, matching, and AI analysis.
"""

import sys
import os
from pathlib import Path
import time
import json
from collections import defaultdict
import random

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


class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def print_header(title):
    """Print a formatted header"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'=' * 70}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}  {title}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'=' * 70}{Colors.END}\n")


def print_success(message):
    """Print success message"""
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")


def print_error(message):
    """Print error message"""
    print(f"{Colors.RED}✗ {message}{Colors.END}")


def print_info(message):
    """Print info message"""
    print(f"{Colors.BLUE}→ {message}{Colors.END}")


def print_metric(label, value, unit=""):
    """Print a metric with formatting"""
    print(f"  {Colors.BOLD}{label}:{Colors.END} {Colors.GREEN}{value}{unit}{Colors.END}")


def test_dataset_statistics():
    """Test and display dataset statistics"""
    print_header("DATASET STATISTICS")
    
    try:
        stats = get_dataset_stats()
        
        print_metric("Total Job Descriptions", f"{stats['total_job_descriptions']:,}")
        print_metric("Total Resume Data", f"{stats['total_resume_data']:,}")
        print_metric("Categories", stats['categories'])
        
        print(f"\n{Colors.BOLD}Resume Distribution by Category:{Colors.END}")
        for category, count in sorted(stats['resumes_by_category'].items()):
            if count > 0:
                print(f"  • {category}: {Colors.CYAN}{count}{Colors.END} resumes")
        
        print_success("Dataset statistics retrieved successfully")
        return True
    except Exception as e:
        print_error(f"Failed to retrieve dataset statistics: {e}")
        return False


def test_resume_parsing_accuracy(num_samples=10):
    """Test resume parsing accuracy across multiple samples"""
    print_header(f"RESUME PARSING ACCURACY TEST ({num_samples} samples)")
    
    categories = get_resume_categories()
    successful = 0
    failed = 0
    parse_times = []
    text_lengths = []
    
    for i in range(num_samples):
        try:
            # Get random category and resume
            category = random.choice(categories)
            resumes = get_sample_resumes_by_category(category)
            
            if not resumes:
                continue
            
            resume_path = random.choice(resumes)
            
            # Parse resume
            start_time = time.time()
            parse_result = resume_parser.parse_pdf(resume_path)
            parse_time = time.time() - start_time
            
            resume_text = parse_result.get('text', '') if parse_result.get('success') else ''
            
            if len(resume_text) > 100:  # Valid extraction
                successful += 1
                parse_times.append(parse_time)
                text_lengths.append(len(resume_text))
                print_info(f"Sample {i+1}: {Path(resume_path).name[:40]}... ✓")
            else:
                failed += 1
                print_error(f"Sample {i+1}: Insufficient text extracted")
                
        except Exception as e:
            failed += 1
            print_error(f"Sample {i+1}: Parse error - {str(e)[:50]}")
    
    # Calculate metrics
    total = successful + failed
    accuracy = (successful / total * 100) if total > 0 else 0
    avg_parse_time = sum(parse_times) / len(parse_times) if parse_times else 0
    avg_text_length = sum(text_lengths) / len(text_lengths) if text_lengths else 0
    
    print(f"\n{Colors.BOLD}Parsing Results:{Colors.END}")
    print_metric("Total Samples", total)
    print_metric("Successful", successful)
    print_metric("Failed", failed)
    print_metric("Accuracy", f"{accuracy:.2f}", "%")
    print_metric("Avg Parse Time", f"{avg_parse_time:.3f}", "s")
    print_metric("Avg Text Length", f"{int(avg_text_length):,}", " chars")
    
    return accuracy >= 80  # Pass if >= 80% accuracy


def test_skill_extraction_accuracy(num_samples=15):
    """Test skill extraction accuracy and coverage"""
    print_header(f"SKILL EXTRACTION ACCURACY TEST ({num_samples} samples)")
    
    categories = get_resume_categories()
    successful = 0
    failed = 0
    skills_counts = []
    extraction_times = []
    
    for i in range(num_samples):
        try:
            # Get random resume
            category = random.choice(categories)
            resumes = get_sample_resumes_by_category(category)
            
            if not resumes:
                continue
            
            resume_path = random.choice(resumes)
            parse_result = resume_parser.parse_pdf(resume_path)
            resume_text = parse_result.get('text', '') if parse_result.get('success') else ''
            
            # Extract skills
            start_time = time.time()
            result = skill_extractor.extract_skills(resume_text)
            extraction_time = time.time() - start_time
            
            skills = result.get('skills', [])
            
            if len(skills) > 0:
                successful += 1
                skills_counts.append(len(skills))
                extraction_times.append(extraction_time)
                print_info(f"Sample {i+1}: Found {len(skills)} skills ✓")
            else:
                failed += 1
                print_error(f"Sample {i+1}: No skills extracted")
                
        except Exception as e:
            failed += 1
            print_error(f"Sample {i+1}: Extraction error - {str(e)[:50]}")
    
    # Calculate metrics
    total = successful + failed
    accuracy = (successful / total * 100) if total > 0 else 0
    avg_skills = sum(skills_counts) / len(skills_counts) if skills_counts else 0
    avg_extraction_time = sum(extraction_times) / len(extraction_times) if extraction_times else 0
    min_skills = min(skills_counts) if skills_counts else 0
    max_skills = max(skills_counts) if skills_counts else 0
    
    print(f"\n{Colors.BOLD}Skill Extraction Results:{Colors.END}")
    print_metric("Total Samples", total)
    print_metric("Successful", successful)
    print_metric("Failed", failed)
    print_metric("Accuracy", f"{accuracy:.2f}", "%")
    print_metric("Avg Skills Found", f"{avg_skills:.1f}")
    print_metric("Min Skills", min_skills)
    print_metric("Max Skills", max_skills)
    print_metric("Avg Extraction Time", f"{avg_extraction_time:.3f}", "s")
    
    return accuracy >= 85  # Pass if >= 85% accuracy


def test_matching_accuracy(num_samples=10):
    """Test resume-to-job matching accuracy"""
    print_header(f"MATCHING ACCURACY TEST ({num_samples} samples)")
    
    categories = get_resume_categories()
    match_scores = []
    fit_scores = []
    matching_times = []
    
    print_info("Testing resume-to-job matching...")
    
    for i in range(num_samples):
        try:
            # Get random resume and job
            category = random.choice(categories)
            resumes = get_sample_resumes_by_category(category)
            
            if not resumes:
                continue
            
            resume_path = random.choice(resumes)
            parse_result = resume_parser.parse_pdf(resume_path)
            resume_text = parse_result.get('text', '') if parse_result.get('success') else ''
            skills_result = skill_extractor.extract_skills(resume_text)
            resume_skills = skills_result.get('skills', [])
            
            # Get random job
            job = get_random_job_description()
            
            # Perform matching
            start_time = time.time()
            match_result = matcher.calculate_match(
                resume_skills=resume_skills,
                job_description=job['job_description']
            )
            matching_time = time.time() - start_time
            
            match_scores.append(match_result.get('match_score', 0))
            fit_scores.append(match_result.get('fit_score', 0))
            matching_times.append(matching_time)
            
            print_info(f"Sample {i+1}: Match={match_result.get('match_score', 0)}%, Fit={match_result.get('fit_score', 0)}% ✓")
            
        except Exception as e:
            print_error(f"Sample {i+1}: Matching error - {str(e)[:50]}")
    
    # Calculate metrics
    if match_scores:
        avg_match_score = sum(match_scores) / len(match_scores)
        avg_fit_score = sum(fit_scores) / len(fit_scores)
        avg_matching_time = sum(matching_times) / len(matching_times)
        min_match = min(match_scores)
        max_match = max(match_scores)
        
        print(f"\n{Colors.BOLD}Matching Results:{Colors.END}")
        print_metric("Total Samples", len(match_scores))
        print_metric("Avg Match Score", f"{avg_match_score:.2f}", "%")
        print_metric("Avg Fit Score", f"{avg_fit_score:.2f}", "%")
        print_metric("Min Match Score", f"{min_match:.2f}", "%")
        print_metric("Max Match Score", f"{max_match:.2f}", "%")
        print_metric("Avg Matching Time", f"{avg_matching_time:.3f}", "s")
        
        return len(match_scores) >= num_samples * 0.8  # Pass if >= 80% completed
    else:
        print_error("No successful matches")
        return False


def test_job_search_functionality():
    """Test job search with multiple queries"""
    print_header("JOB SEARCH FUNCTIONALITY TEST")
    
    test_queries = [
        ['python', 'developer'],
        ['data', 'scientist', 'machine learning'],
        ['java', 'backend'],
        ['react', 'frontend'],
        ['devops', 'kubernetes']
    ]
    
    successful = 0
    total_results = []
    
    for keywords in test_queries:
        try:
            print_info(f"Searching: {', '.join(keywords)}")
            jobs = search_jobs_by_keywords(keywords, limit=5)
            
            if len(jobs) > 0:
                successful += 1
                total_results.append(len(jobs))
                print(f"  Found: {Colors.GREEN}{len(jobs)}{Colors.END} jobs")
            else:
                print(f"  Found: {Colors.YELLOW}0{Colors.END} jobs")
                
        except Exception as e:
            print_error(f"Search error: {str(e)[:50]}")
    
    print(f"\n{Colors.BOLD}Search Results:{Colors.END}")
    print_metric("Total Queries", len(test_queries))
    print_metric("Successful Searches", successful)
    print_metric("Avg Results per Query", f"{sum(total_results)/len(total_results):.1f}" if total_results else "0")
    
    return successful >= len(test_queries) * 0.8


def test_end_to_end_workflow(num_samples=5):
    """Test complete end-to-end workflow"""
    print_header(f"END-TO-END WORKFLOW TEST ({num_samples} samples)")
    
    categories = get_resume_categories()
    successful = 0
    total_times = []
    
    for i in range(num_samples):
        try:
            print_info(f"Running workflow {i+1}/{num_samples}...")
            
            start_time = time.time()
            
            # 1. Get resume
            category = random.choice(categories)
            resumes = get_sample_resumes_by_category(category)
            if not resumes:
                continue
            
            resume_path = random.choice(resumes)
            
            # 2. Parse resume
            parse_result = resume_parser.parse_pdf(resume_path)
            resume_text = parse_result.get('text', '') if parse_result.get('success') else ''
            
            # 3. Extract skills
            skills_result = skill_extractor.extract_skills(resume_text)
            resume_skills = skills_result.get('skills', [])
            
            # 4. Get job
            job = get_random_job_description()
            
            # 5. Match
            match_result = matcher.calculate_match(
                resume_skills=resume_skills,
                job_description=job['job_description']
            )
            
            total_time = time.time() - start_time
            
            successful += 1
            total_times.append(total_time)
            
            print(f"  ✓ Completed in {total_time:.2f}s - Match: {match_result.get('match_score', 0)}%")
            
        except Exception as e:
            print_error(f"Workflow {i+1} failed: {str(e)[:50]}")
    
    # Calculate metrics
    accuracy = (successful / num_samples * 100) if num_samples > 0 else 0
    avg_time = sum(total_times) / len(total_times) if total_times else 0
    
    print(f"\n{Colors.BOLD}End-to-End Results:{Colors.END}")
    print_metric("Total Workflows", num_samples)
    print_metric("Successful", successful)
    print_metric("Failed", num_samples - successful)
    print_metric("Success Rate", f"{accuracy:.2f}", "%")
    print_metric("Avg Total Time", f"{avg_time:.2f}", "s")
    
    return accuracy >= 80


def generate_test_report(results):
    """Generate a comprehensive test report"""
    print_header("COMPREHENSIVE TEST REPORT")
    
    total_tests = len(results)
    passed_tests = sum(1 for r in results.values() if r['passed'])
    overall_accuracy = (passed_tests / total_tests * 100) if total_tests > 0 else 0
    
    print(f"{Colors.BOLD}Test Summary:{Colors.END}\n")
    
    for test_name, result in results.items():
        status = f"{Colors.GREEN}PASS{Colors.END}" if result['passed'] else f"{Colors.RED}FAIL{Colors.END}"
        print(f"  [{status}] {test_name}")
    
    print(f"\n{Colors.BOLD}Overall Results:{Colors.END}")
    print_metric("Total Tests", total_tests)
    print_metric("Passed", passed_tests)
    print_metric("Failed", total_tests - passed_tests)
    print_metric("Overall Accuracy", f"{overall_accuracy:.2f}", "%")
    
    if overall_accuracy >= 80:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ TEST SUITE PASSED!{Colors.END}")
        print(f"{Colors.GREEN}The system is working with {overall_accuracy:.2f}% accuracy.{Colors.END}")
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}✗ TEST SUITE FAILED!{Colors.END}")
        print(f"{Colors.RED}System accuracy is below threshold ({overall_accuracy:.2f}%).{Colors.END}")
    
    return overall_accuracy >= 80


def main():
    """Main test runner"""
    print(f"""
{Colors.BOLD}{Colors.CYAN}╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     HireSight AI - Comprehensive Dataset Testing Suite          ║
║            with Accuracy Metrics & Performance Analysis          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝{Colors.END}
""")
    
    print(f"{Colors.YELLOW}Starting comprehensive testing...{Colors.END}\n")
    
    results = {}
    
    try:
        # Run all tests
        results['Dataset Statistics'] = {
            'passed': test_dataset_statistics()
        }
        
        results['Resume Parsing'] = {
            'passed': test_resume_parsing_accuracy(num_samples=10)
        }
        
        results['Skill Extraction'] = {
            'passed': test_skill_extraction_accuracy(num_samples=15)
        }
        
        results['Job Matching'] = {
            'passed': test_matching_accuracy(num_samples=10)
        }
        
        results['Job Search'] = {
            'passed': test_job_search_functionality()
        }
        
        results['End-to-End Workflow'] = {
            'passed': test_end_to_end_workflow(num_samples=5)
        }
        
        # Generate report
        success = generate_test_report(results)
        
        print(f"\n{Colors.BOLD}Next Steps:{Colors.END}")
        print("  1. Review any failed tests above")
        print("  2. Start services: start.bat")
        print("  3. Test in browser: http://localhost:3000/test")
        print("  4. Check API docs: http://localhost:8000/docs")
        
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print_error(f"Critical test error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
