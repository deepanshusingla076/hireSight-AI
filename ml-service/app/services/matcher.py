from typing import List, Dict, Set
from app.utils.logger import log_info, log_error


class Matcher:
    """
    Resume-Job Matching Engine
    Calculates match scores between resume skills and job requirements
    """

    def __init__(self):
        pass

    def calculate_match(
        self,
        resume_skills: List[str],
        job_description: str = None,
        job_skills: List[str] = None
    ) -> Dict[str, any]:
        """
        Calculate match between resume and job

        Args:
            resume_skills: List of skills from resume
            job_description: Job description text (optional if job_skills provided)
            job_skills: List of required skills (optional if job_description provided)

        Returns:
            Dict with match score and details
        """
        try:
            if not resume_skills:
                return {
                    "success": False,
                    "error": "No resume skills provided",
                    "match_score": 0
                }

            # If job_skills not provided, extract from job_description
            if not job_skills:
                if not job_description:
                    return {
                        "success": False,
                        "error": "Either job_skills or job_description must be provided",
                        "match_score": 0
                    }
                # Extract skills from job description
                from app.services.skill_extractor import skill_extractor
                extraction_result = skill_extractor.extract_skills(job_description)
                if not extraction_result.get("success"):
                    return {
                        "success": False,
                        "error": "Failed to extract skills from job description",
                        "match_score": 0
                    }
                job_skills = extraction_result.get("skills", [])

            # Normalize to lowercase for comparison
            resume_skills_set = set(skill.lower() for skill in resume_skills)
            job_skills_set = set(skill.lower() for skill in job_skills)

            # Calculate matches
            matched_skills = resume_skills_set.intersection(job_skills_set)
            missing_skills = job_skills_set.difference(resume_skills_set)
            extra_skills = resume_skills_set.difference(job_skills_set)

            # Calculate match score
            if len(job_skills_set) == 0:
                match_score = 0.0
            else:
                match_score = (len(matched_skills) / len(job_skills_set)) * 100

            # Calculate confidence level
            confidence = self._calculate_confidence(
                len(matched_skills),
                len(job_skills_set),
                len(resume_skills_set)
            )

            result = {
                "success": True,
                "match_score": round(match_score, 2),
                "confidence": confidence,
                "matched_skills": sorted(list(matched_skills)),
                "missing_skills": sorted(list(missing_skills)),
                "extra_skills": sorted(list(extra_skills)),
                "statistics": {
                    "total_job_requirements": len(job_skills_set),
                    "total_resume_skills": len(resume_skills_set),
                    "matched_count": len(matched_skills),
                    "missing_count": len(missing_skills),
                    "extra_count": len(extra_skills)
                },
                "recommendation": self._get_recommendation(match_score)
            }

            log_info(f"Match calculated: {match_score:.2f}% with {len(matched_skills)} matched skills")
            return result

        except Exception as e:
            log_error("Error calculating match", e)
            return {
                "success": False,
                "error": str(e),
                "match_score": 0
            }

    def batch_match(
        self,
        resume_skills: List[str],
        job_listings: List[Dict[str, any]]
    ) -> Dict[str, any]:
        """
        Match resume against multiple job listings

        Args:
            resume_skills: List of skills from resume
            job_listings: List of job listings with 'title' and 'skills' or 'description'

        Returns:
            Dict with ranked matches
        """
        try:
            if not resume_skills:
                return {
                    "success": False,
                    "error": "No resume skills provided",
                    "matches": []
                }

            if not job_listings:
                return {
                    "success": False,
                    "error": "No job listings provided",
                    "matches": []
                }

            matches = []
            for idx, job in enumerate(job_listings):
                job_title = job.get("title", f"Job {idx + 1}")
                job_skills = job.get("skills")
                job_description = job.get("description")

                match_result = self.calculate_match(
                    resume_skills=resume_skills,
                    job_description=job_description,
                    job_skills=job_skills
                )

                if match_result.get("success"):
                    matches.append({
                        "job_title": job_title,
                        "match_score": match_result["match_score"],
                        "matched_skills": match_result["matched_skills"],
                        "missing_skills": match_result["missing_skills"],
                        "recommendation": match_result["recommendation"]
                    })

            # Sort by match score (descending)
            matches.sort(key=lambda x: x["match_score"], reverse=True)

            result = {
                "success": True,
                "total_jobs": len(job_listings),
                "matches": matches,
                "best_match": matches[0] if matches else None,
                "average_score": round(
                    sum(m["match_score"] for m in matches) / len(matches), 2
                ) if matches else 0
            }

            log_info(f"Batch match completed: {len(matches)} jobs analyzed")
            return result

        except Exception as e:
            log_error("Error in batch matching", e)
            return {
                "success": False,
                "error": str(e),
                "matches": []
            }

    def _calculate_confidence(
        self,
        matched_count: int,
        required_count: int,
        total_resume_skills: int
    ) -> str:
        """
        Calculate confidence level of the match

        Args:
            matched_count: Number of matched skills
            required_count: Number of required skills
            total_resume_skills: Total skills in resume

        Returns:
            Confidence level string
        """
        if required_count == 0:
            return "unknown"

        match_ratio = matched_count / required_count

        if match_ratio >= 0.8 and total_resume_skills >= required_count:
            return "high"
        elif match_ratio >= 0.6:
            return "medium"
        elif match_ratio >= 0.4:
            return "low"
        else:
            return "very low"

    def _get_recommendation(self, match_score: float) -> str:
        """
        Get recommendation based on match score

        Args:
            match_score: Match percentage

        Returns:
            Recommendation string
        """
        if match_score >= 80:
            return "Excellent match! Highly recommended to apply."
        elif match_score >= 60:
            return "Good match. Consider applying with emphasis on matched skills."
        elif match_score >= 40:
            return "Moderate match. Consider upskilling in missing areas before applying."
        elif match_score >= 20:
            return "Low match. Significant skill gap exists. Focus on learning missing skills."
        else:
            return "Poor match. This role may require substantial additional training."

    def get_skill_gap_analysis(
        self,
        resume_skills: List[str],
        target_skills: List[str]
    ) -> Dict[str, any]:
        """
        Detailed skill gap analysis

        Args:
            resume_skills: Current skills
            target_skills: Target/required skills

        Returns:
            Detailed gap analysis
        """
        try:
            resume_set = set(skill.lower() for skill in resume_skills)
            target_set = set(skill.lower() for skill in target_skills)

            matched = resume_set.intersection(target_set)
            gaps = target_set.difference(resume_set)

            return {
                "success": True,
                "current_skills": sorted(list(resume_set)),
                "target_skills": sorted(list(target_set)),
                "skills_achieved": sorted(list(matched)),
                "skills_to_learn": sorted(list(gaps)),
                "progress_percentage": round(
                    (len(matched) / len(target_set) * 100) if target_set else 0, 2
                ),
                "priorities": {
                    "critical": sorted(list(gaps))[:5],  # Top 5 missing skills
                    "optional": sorted(list(gaps))[5:] if len(gaps) > 5 else []
                }
            }

        except Exception as e:
            log_error("Error in skill gap analysis", e)
            return {
                "success": False,
                "error": str(e)
            }


# Create singleton instance
matcher = Matcher()
