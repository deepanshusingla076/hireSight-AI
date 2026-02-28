"""
Utility functions for ML service
"""
from datetime import datetime


def log_info(message: str, data: dict = None):
    """Log info message"""
    timestamp = datetime.now().isoformat()
    print(f"[INFO] [{timestamp}] {message}")
    if data:
        print(f"  Data: {data}")


def log_error(message: str, error: Exception = None):
    """Log error message"""
    timestamp = datetime.now().isoformat()
    print(f"[ERROR] [{timestamp}] {message}")
    if error:
        print(f"  Error: {str(error)}")


def log_warning(message: str, data: dict = None):
    """Log warning message"""
    timestamp = datetime.now().isoformat()
    print(f"[WARNING] [{timestamp}] {message}")
    if data:
        print(f"  Data: {data}")
