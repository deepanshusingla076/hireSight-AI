import pdfplumber
import re
from typing import Dict, Optional
from app.utils.logger import log_info, log_error


class ResumeParser:
    """
    Resume Parser Service
    Extracts and cleans text from PDF resumes
    """

    def __init__(self):
        pass

    def parse_pdf(self, pdf_path: str) -> Dict[str, any]:
        """
        Extract text from PDF file

        Args:
            pdf_path (str): Path to the PDF file

        Returns:
            Dict containing extracted text and metadata
        """
        try:
            log_info(f"Parsing PDF: {pdf_path}")
            text = self._extract_text_from_pdf(pdf_path)
            cleaned_text = self._clean_text(text)

            result = {
                "success": True,
                "text": cleaned_text,
                "raw_text": text,
                "char_count": len(cleaned_text),
                "word_count": len(cleaned_text.split())
            }
            
            log_info("PDF parsed successfully", {
                "word_count": result["word_count"],
                "char_count": result["char_count"]
            })
            
            return result
        except Exception as e:
            log_error(f"Error parsing PDF: {pdf_path}", e)
            return {
                "success": False,
                "error": str(e),
                "text": None
            }

    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract raw text from PDF using pdfplumber

        Args:
            pdf_path (str): Path to PDF file

        Returns:
            str: Extracted text
        """
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text

    def _clean_text(self, text: str) -> str:
        """
        Clean and normalize extracted text

        Args:
            text (str): Raw text

        Returns:
            str: Cleaned text
        """
        if not text:
            return ""

        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)

        # Remove special characters but keep common punctuation
        text = re.sub(r'[^\w\s\.\,\@\-\(\)\+\#\&]', '', text)

        # Remove multiple consecutive periods
        text = re.sub(r'\.{2,}', '.', text)

        # Trim whitespace
        text = text.strip()

        return text

    def extract_sections(self, text: str) -> Dict[str, str]:
        """
        Extract common resume sections (basic implementation)

        Args:
            text (str): Resume text

        Returns:
            Dict with identified sections
        """
        sections = {}

        # Common section headers
        section_patterns = {
            "education": r"(EDUCATION|Education|ACADEMIC|Academic)",
            "experience": r"(EXPERIENCE|Experience|WORK HISTORY|Work History)",
            "skills": r"(SKILLS|Skills|TECHNICAL SKILLS|Technical Skills)",
            "summary": r"(SUMMARY|Summary|OBJECTIVE|Objective|PROFILE|Profile)"
        }

        for section_name, pattern in section_patterns.items():
            match = re.search(pattern, text)
            if match:
                sections[section_name] = match.group(0)

        return sections


# Create singleton instance
resume_parser = ResumeParser()
