import json
import re
from pathlib import Path
from typing import List, Dict, Set
from app.utils.logger import log_info, log_error

try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    log_error("spaCy not available. Install with: pip install spacy && python -m spacy download en_core_web_sm")


class SkillExtractor:
    """
    Skill Extraction Service
    Extracts skills from resume text using spaCy NLP and keyword matching
    """

    def __init__(self, skills_json_path: str = None):
        """
        Initialize skill extractor

        Args:
            skills_json_path: Path to skills.json file
        """
        if skills_json_path is None:
            # Default path relative to project root
            skills_json_path = Path(__file__).parent.parent.parent.parent / "data" / "skills.json"
        
        self.skills_data = self._load_skills(skills_json_path)
        self.all_skills = self._flatten_skills()
        
        # Load spaCy model if available
        self.nlp = None
        if SPACY_AVAILABLE:
            try:
                self.nlp = spacy.load("en_core_web_sm")
                log_info("spaCy model loaded successfully")
            except OSError:
                log_error("spaCy model not found. Run: python -m spacy download en_core_web_sm")
                self.nlp = None

    def _load_skills(self, skills_path: Path) -> Dict:
        """
        Load skills from JSON file

        Args:
            skills_path: Path to skills.json

        Returns:
            Dict of skills by category
        """
        try:
            with open(skills_path, 'r', encoding='utf-8') as f:
                skills_data = json.load(f)
            log_info(f"Loaded {sum(len(v) for v in skills_data.values())} skills from {skills_path}")
            return skills_data
        except Exception as e:
            log_error(f"Error loading skills from {skills_path}", e)
            return {}

    def _flatten_skills(self) -> Set[str]:
        """
        Flatten all skills into a single set (lowercase for matching)

        Returns:
            Set of all skills in lowercase
        """
        all_skills = set()
        for category, skills in self.skills_data.items():
            for skill in skills:
                all_skills.add(skill.lower())
        return all_skills

    def extract_skills(self, text: str) -> Dict[str, any]:
        """
        Extract skills from text using multiple methods

        Args:
            text: Resume or job description text

        Returns:
            Dict with extracted skills and metadata
        """
        try:
            if not text:
                return {
                    "success": False,
                    "error": "No text provided",
                    "skills": []
                }

            # Method 1: Keyword matching
            keyword_skills = self._extract_by_keywords(text)

            # Method 2: NLP-based extraction (if spaCy available)
            nlp_skills = set()
            if self.nlp:
                nlp_skills = self._extract_by_nlp(text)

            # Combine results (union of both methods)
            all_extracted = keyword_skills.union(nlp_skills)

            # Categorize extracted skills
            categorized = self._categorize_skills(all_extracted)

            result = {
                "success": True,
                "skills": sorted(list(all_extracted)),
                "skill_count": len(all_extracted),
                "categorized_skills": categorized,
                "extraction_methods": {
                    "keyword_matching": len(keyword_skills),
                    "nlp_extraction": len(nlp_skills) if self.nlp else 0
                }
            }

            log_info(f"Extracted {len(all_extracted)} skills from text")
            return result

        except Exception as e:
            log_error("Error extracting skills", e)
            return {
                "success": False,
                "error": str(e),
                "skills": []
            }

    def _extract_by_keywords(self, text: str) -> Set[str]:
        """
        Extract skills using keyword matching

        Args:
            text: Text to search

        Returns:
            Set of found skills
        """
        found_skills = set()
        text_lower = text.lower()

        # Split text into words and phrases
        words = re.findall(r'\b\w+\b', text_lower)
        text_phrases = text_lower

        # Check each skill in our database
        for skill in self.all_skills:
            skill_lower = skill.lower()
            
            # For single-word skills
            if ' ' not in skill_lower:
                if skill_lower in words:
                    found_skills.add(skill)
            # For multi-word skills
            else:
                if skill_lower in text_phrases:
                    found_skills.add(skill)

        return found_skills

    def _extract_by_nlp(self, text: str) -> Set[str]:
        """
        Extract skills using spaCy NLP

        Args:
            text: Text to analyze

        Returns:
            Set of found skills
        """
        if not self.nlp:
            return set()

        found_skills = set()
        doc = self.nlp(text)

        # Extract noun phrases and named entities
        candidates = set()
        
        # Add noun chunks
        for chunk in doc.noun_chunks:
            candidates.add(chunk.text.lower())
        
        # Add named entities (ORG, PRODUCT, etc.)
        for ent in doc.ents:
            if ent.label_ in ['ORG', 'PRODUCT', 'GPE', 'LANGUAGE']:
                candidates.add(ent.text.lower())

        # Match candidates against our skills database
        for candidate in candidates:
            if candidate in self.all_skills:
                found_skills.add(candidate)

        return found_skills

    def _categorize_skills(self, skills: Set[str]) -> Dict[str, List[str]]:
        """
        Categorize extracted skills

        Args:
            skills: Set of extracted skills

        Returns:
            Dict of skills by category
        """
        categorized = {}
        skills_lower = {s.lower(): s for s in skills}

        for category, category_skills in self.skills_data.items():
            categorized[category] = []
            for skill in category_skills:
                if skill.lower() in skills_lower:
                    categorized[category].append(skills_lower[skill.lower()])

        # Remove empty categories
        categorized = {k: v for k, v in categorized.items() if v}

        return categorized

    def get_all_skills(self) -> Dict[str, List[str]]:
        """
        Get all available skills from database

        Returns:
            Dict of all skills by category
        """
        return self.skills_data

    def search_skills(self, query: str) -> List[str]:
        """
        Search for skills matching a query

        Args:
            query: Search term

        Returns:
            List of matching skills
        """
        query_lower = query.lower()
        matches = []
        
        for skill in self.all_skills:
            if query_lower in skill.lower():
                matches.append(skill)
        
        return sorted(matches)


# Create singleton instance
skill_extractor = SkillExtractor()
