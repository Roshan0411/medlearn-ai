from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import uuid
from datetime import datetime

from services.llm_service import generate_learning_content, generate_quiz
from services.image_service import generate_image_url
from services.audio_service import generate_audio
from database.db import save_session, get_session

router = APIRouter()

class LearnRequest(BaseModel):
    query: str

class SlideData(BaseModel):
    title: str
    content: str
    imageUrl: str
    audioUrl: str

class LearnResponse(BaseModel):
    sessionId: str
    slides: List[SlideData]

class QuizEvaluationRequest(BaseModel):
    sessionId: str
    level: int
    answer: str

class QuizEvaluationResponse(BaseModel):
    correct: bool
    feedback: str
    nextQuestion: Dict[str, Any] = None
    masteryLevel: int = None

@router.post("/learn", response_model=LearnResponse)
async def learn(request: LearnRequest):
    """Generate learning content with slides, images, and audio narration"""
    try:
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Generate learning content using LLM
        print(f" Generating content for: {request.query}")
        slides_content = await generate_learning_content(request.query)
        
        # Process each slide: get images and generate audio
        slides = []
        for i, slide in enumerate(slides_content):
            print(f" Processing slide {i+1}/4: {slide['title']}")
            
            # Get image URL from Unsplash
            image_url = await get_image_url(slide['title'])
            
            # Generate audio narration
            audio_filename = f"{session_id}_slide_{i+1}.mp3"
            audio_url = await generate_audio(slide['narration'], audio_filename)
            
            slides.append(SlideData(
                title=slide['title'],
                content=slide['content'],
                imageUrl=image_url,
                audioUrl=audio_url
            ))
        
        # Generate quiz questions
        print(" Generating quiz questions...")
        quiz_questions = await generate_quiz(request.query, slides_content)
        
        # Save session to database
        await save_session(session_id, request.query, slides_content, quiz_questions)
        print(f" Session created: {session_id}")
        
        return LearnResponse(
            sessionId=session_id,
            slides=slides
        )
        
    except Exception as e:
        print(f" Error in /learn: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate learning content: {str(e)}")

@router.post("/quiz/evaluate", response_model=QuizEvaluationResponse)
async def evaluate_quiz(request: QuizEvaluationRequest):
    """Evaluate quiz answer and return feedback with next question"""
    try:
        # Get session data
        session = await get_session(request.sessionId)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        quiz_questions = session['quiz_questions']
        
        # Validate level
        if request.level < 1 or request.level > 4:
            raise HTTPException(status_code=400, detail="Invalid level")
        
        # Get current question
        current_question = quiz_questions[request.level - 1]
        
        # Evaluate answer
        user_answer = request.answer.strip().lower()
        correct_answer = current_question['correct_answer'].strip().lower()
        
        is_correct = user_answer == correct_answer
        
        # Generate feedback
        if is_correct:
            feedback = f" Correct! {current_question.get('explanation', 'Well done!')}"
        else:
            feedback = f" Incorrect. The correct answer is: {current_question['correct_answer']}. {current_question.get('explanation', '')}"
        
        # Prepare response
        response_data = {
            "correct": is_correct,
            "feedback": feedback
        }
        
        # If correct and not the last level, provide next question
        if is_correct and request.level < 4:
            next_question = quiz_questions[request.level]
            response_data["nextQuestion"] = {
                "level": request.level + 1,
                "question": next_question['question'],
                "options": next_question['options']
            }
        
        # If correct and last level, mark mastery complete
        if is_correct and request.level == 4:
            response_data["masteryLevel"] = 4
        
        # If incorrect, mastery stops at previous level
        if not is_correct:
            response_data["masteryLevel"] = request.level - 1
        
        return QuizEvaluationResponse(**response_data)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f" Error in /quiz/evaluate: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to evaluate quiz: {str(e)}")
