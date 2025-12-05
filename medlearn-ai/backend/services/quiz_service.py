from typing import Dict, List


def evaluate_answers(quiz_level: dict, user_answers: Dict[int, str]) -> dict:
    """
    Evaluate user's quiz answers against correct answers.
    
    Args:
        quiz_level: The quiz level data containing questions and correct answers
        user_answers: Dictionary mapping question ID to user's answer (e.g., {1: "A", 2: "B"})
    
    Returns:
        Dictionary containing:
        - passed: Whether user passed the level
        - score: Number of correct answers
        - total: Total number of questions
        - results: Detailed results for each question
        - mastery_achieved: True if user passed level 4
    """
    correct_count = 0
    results = []

    for question in quiz_level["questions"]:
        q_id = question["id"]

        # Handle both integer and string keys (API flexibility)
        user_answer = user_answers.get(q_id) or user_answers.get(str(q_id))
        
        # Check if answer is correct
        is_correct = user_answer == question["correct_answer"]

        if is_correct:
            correct_count += 1

        # Build result object for this question
        results.append({
            "question_id": q_id,
            "question": question["question"],
            "user_answer": user_answer,
            "correct_answer": question["correct_answer"],
            "is_correct": is_correct,
            "explanation": question.get("explanation", ""),
            "concept": question.get("concept", "")
        })

    # Calculate pass/fail
    total = quiz_level["total"]
    pass_threshold = quiz_level["pass_threshold"]
    passed = correct_count >= pass_threshold
    
    # Check for mastery (passed level 4)
    mastery_achieved = passed and quiz_level["level"] == 4

    return {
        "level": quiz_level["level"],
        "level_name": quiz_level["level_name"],
        "passed": passed,
        "score": correct_count,
        "total": total,
        "pass_threshold": pass_threshold,
        "percentage": round((correct_count / total) * 100) if total > 0 else 0,
        "results": results,
        "mastery_achieved": mastery_achieved
    }


def get_level_description(level: int) -> str:
    """Get description for a quiz level"""
    descriptions = {
        1: "Basic recall and definition questions",
        2: "Application and understanding questions",
        3: "Clinical reasoning and analysis",
        4: "Complex integration and expert-level problems"
    }
    return descriptions.get(level, "Quiz level")