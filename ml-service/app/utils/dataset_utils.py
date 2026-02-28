"""
Dataset utilities for HireSight AI

This module provides functions to load and process the resume and job description datasets.
"""

import pandas as pd
import os
import random
from pathlib import Path
from typing import Dict, List, Optional

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / 'data'
SAMPLE_RESUMES_DIR = DATA_DIR / 'sample_resumes'
JOB_DESCRIPTIONS_FILE = DATA_DIR / 'job_descriptions' / 'job_title_des.csv'
RESUME_CSV_FILE = DATA_DIR / 'Resume.csv'

# Available job categories
JOB_CATEGORIES = [
    'ACCOUNTANT', 'ADVOCATE', 'AGRICULTURE', 'APPAREL', 'ARTS',
    'AUTOMOBILE', 'AVIATION', 'BANKING', 'BPO', 'BUSINESS-DEVELOPMENT',
    'CHEF', 'CONSTRUCTION', 'CONSULTANT', 'DESIGNER', 'DIGITAL-MEDIA',
    'ENGINEERING', 'FINANCE', 'FITNESS', 'HEALTHCARE', 'HR',
    'INFORMATION-TECHNOLOGY', 'PUBLIC-RELATIONS', 'SALES', 'TEACHER'
]


def load_job_descriptions(limit: Optional[int] = None) -> pd.DataFrame:
    """
    Load job descriptions from CSV file.
    
    Args:
        limit: Optional limit on number of records to return
        
    Returns:
        DataFrame with job descriptions
    """
    try:
        df = pd.read_csv(JOB_DESCRIPTIONS_FILE)
        if limit:
            df = df.head(limit)
        return df
    except Exception as e:
        print(f"Error loading job descriptions: {e}")
        return pd.DataFrame()


def get_random_job_description() -> Dict[str, str]:
    """
    Get a random job description from the dataset.
    
    Returns:
        Dictionary with job_title and job_description
    """
    df = load_job_descriptions(limit=1000)  # Load first 1000 for performance
    if not df.empty:
        random_row = df.sample(n=1).iloc[0]
        return {
            'job_title': str(random_row['Job Title']),
            'job_description': str(random_row['Job Description'])
        }
    return {'job_title': '', 'job_description': ''}


def get_job_description_by_title(title: str) -> Dict[str, str]:
    """
    Search for job descriptions matching the given title.
    
    Args:
        title: Job title to search for
        
    Returns:
        Dictionary with job_title and job_description
    """
    df = load_job_descriptions()
    if not df.empty:
        # Case-insensitive search
        matches = df[df['Job Title'].str.contains(title, case=False, na=False)]
        if not matches.empty:
            row = matches.iloc[0]
            return {
                'job_title': str(row['Job Title']),
                'job_description': str(row['Job Description'])
            }
    return {'job_title': '', 'job_description': ''}


def load_resume_dataset(limit: Optional[int] = None) -> pd.DataFrame:
    """
    Load resume dataset from CSV file.
    
    Args:
        limit: Optional limit on number of records to return
        
    Returns:
        DataFrame with resume data
    """
    try:
        df = pd.read_csv(RESUME_CSV_FILE)
        if limit:
            df = df.head(limit)
        return df
    except Exception as e:
        print(f"Error loading resume dataset: {e}")
        return pd.DataFrame()


def get_sample_resumes_by_category(category: str) -> List[str]:
    """
    Get list of resume files from a specific category.
    
    Args:
        category: Job category (e.g., 'ENGINEERING', 'INFORMATION-TECHNOLOGY')
        
    Returns:
        List of file paths
    """
    category_path = SAMPLE_RESUMES_DIR / category
    if category_path.exists():
        return [str(f) for f in category_path.glob('*.pdf')]
    return []


def get_random_resume_path(category: Optional[str] = None) -> Optional[str]:
    """
    Get a random resume file path.
    
    Args:
        category: Optional specific category to select from
        
    Returns:
        Path to a random resume file, or None if not found
    """
    if category:
        resumes = get_sample_resumes_by_category(category)
    else:
        # Get from random category
        random_category = random.choice(JOB_CATEGORIES)
        resumes = get_sample_resumes_by_category(random_category)
    
    if resumes:
        return random.choice(resumes)
    return None


def get_resume_categories() -> List[str]:
    """
    Get list of available resume categories.
    
    Returns:
        List of category names
    """
    return JOB_CATEGORIES


def get_dataset_stats() -> Dict[str, int]:
    """
    Get statistics about the dataset.
    
    Returns:
        Dictionary with dataset statistics
    """
    stats = {
        'total_job_descriptions': 0,
        'total_resume_data': 0,
        'categories': len(JOB_CATEGORIES),
        'resumes_by_category': {}
    }
    
    # Count job descriptions
    try:
        df = load_job_descriptions()
        stats['total_job_descriptions'] = len(df)
    except:
        pass
    
    # Count resume data
    try:
        df = load_resume_dataset()
        stats['total_resume_data'] = len(df)
    except:
        pass
    
    # Count resumes by category
    for category in JOB_CATEGORIES:
        resumes = get_sample_resumes_by_category(category)
        stats['resumes_by_category'][category] = len(resumes)
    
    return stats


def search_jobs_by_keywords(keywords: List[str], limit: int = 10) -> List[Dict[str, str]]:
    """
    Search job descriptions by keywords.
    
    Args:
        keywords: List of keywords to search for
        limit: Maximum number of results to return
        
    Returns:
        List of matching job descriptions
    """
    df = load_job_descriptions()
    if df.empty:
        return []
    
    # Create search pattern
    pattern = '|'.join(keywords)
    
    # Search in both title and description
    matches = df[
        df['Job Title'].str.contains(pattern, case=False, na=False) |
        df['Job Description'].str.contains(pattern, case=False, na=False)
    ]
    
    results = []
    for _, row in matches.head(limit).iterrows():
        results.append({
            'job_title': str(row['Job Title']),
            'job_description': str(row['Job Description'])
        })
    
    return results


if __name__ == '__main__':
    # Example usage
    print("Dataset Statistics:")
    stats = get_dataset_stats()
    for key, value in stats.items():
        if key != 'resumes_by_category':
            print(f"  {key}: {value}")
    
    print("\nResumes by Category:")
    for category, count in stats['resumes_by_category'].items():
        print(f"  {category}: {count} resumes")
    
    print("\n--- Random Job Description ---")
    job = get_random_job_description()
    print(f"Title: {job['job_title']}")
    print(f"Description: {job['job_description'][:200]}...")
    
    print("\n--- Search for Python Jobs ---")
    python_jobs = search_jobs_by_keywords(['python', 'developer'], limit=3)
    for i, job in enumerate(python_jobs, 1):
        print(f"\n{i}. {job['job_title']}")
        print(f"   {job['job_description'][:150]}...")
