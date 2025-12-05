from huggingface_hub import InferenceClient
import os
import json
import re

# Initialize HuggingFace client
hf_token = os.getenv("HUGGINGFACE_TOKEN")
client = InferenceClient(token=hf_token)

MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2"

async def generate_learning_content(query: str):
    """Generate 4 slides with titles, content, and narration using HuggingFace LLM"""
    
    prompt = f"""You are an expert medical educator. Create exactly 4 educational slides about: {query}

For each slide, provide:
1. A clear title
2. 3-4 bullet points of content
3. A natural narration script (2-3 sentences)

Format your response EXACTLY as JSON:
{{
  "slides": [
    {{
      "title": "Slide 1 Title",
      "content": " Point 1\\n Point 2\\n Point 3",
      "narration": "Natural speaking script for this slide."
    }},
    {{
      "title": "Slide 2 Title",
      "content": " Point 1\\n Point 2\\n Point 3",
      "narration": "Natural speaking script for this slide."
    }},
    {{
      "title": "Slide 3 Title",
      "content": " Point 1\\n Point 2\\n Point 3",
      "narration": "Natural speaking script for this slide."
    }},
    {{
      "title": "Slide 4 Title",
      "content": " Point 1\\n Point 2\\n Point 3",
      "narration": "Natural speaking script for this slide."
    }}
  ]
}}

Return ONLY valid JSON, no other text."""

    try:
        print(f" Calling HuggingFace API for content generation...")
        
        response = client.chat_completion(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.7
        )
        
        response_text = response.choices[0].message.content.strip()
        print(f" Raw LLM response length: {len(response_text)} chars")
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(0)
        
        # Parse JSON
        data = json.loads(response_text)
        slides = data.get('slides', [])
        
        if len(slides) != 4:
            raise ValueError(f"Expected 4 slides, got {len(slides)}")
        
        print(f" Generated {len(slides)} slides")
        return slides
        
    except json.JSONDecodeError as e:
        print(f" JSON decode error: {e}")
        print(f"Response was: {response_text[:500]}")
        # Fallback to default content
        return generate_fallback_content(query)
    except Exception as e:
        print(f" Error generating content: {e}")
        return generate_fallback_content(query)

async def generate_quiz(query: str, slides_content: list):
    """Generate 4 progressive difficulty quiz questions"""
    
    # Combine slide content for context
    context = "\n\n".join([f"{s['title']}: {s['content']}" for s in slides_content])
    
    prompt = f"""Based on this medical content about {query}:

{context}

Create exactly 4 multiple-choice quiz questions with progressive difficulty:
- Level 1: Basic recall
- Level 2: Understanding/comprehension
- Level 3: Application
- Level 4: Analysis/synthesis

Format as JSON:
{{
  "questions": [
    {{
      "level": 1,
      "question": "Question text?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "A",
      "explanation": "Brief explanation why this is correct."
    }},
    ...
  ]
}}

Return ONLY valid JSON."""

    try:
        print(f" Calling HuggingFace API for quiz generation...")
        
        response = client.chat_completion(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500,
            temperature=0.7
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Extract JSON
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(0)
        
        data = json.loads(response_text)
        questions = data.get('questions', [])
        
        if len(questions) != 4:
            raise ValueError(f"Expected 4 questions, got {len(questions)}")
        
        print(f" Generated {len(questions)} quiz questions")
        return questions
        
    except Exception as e:
        print(f" Error generating quiz: {e}")
        return generate_fallback_quiz(query)

def generate_fallback_content(query: str):
    """Fallback content if LLM fails"""
    return [
        {
            "title": f"Introduction to {query}",
            "content": " Overview of key concepts\n Importance in medical practice\n Historical context",
            "narration": f"Welcome to this lesson on {query}. We'll explore the fundamental concepts and their significance in modern medicine."
        },
        {
            "title": "Key Mechanisms",
            "content": " Primary biological processes\n Cellular interactions\n Molecular pathways",
            "narration": "Let's examine the underlying mechanisms that drive these processes at the cellular and molecular level."
        },
        {
            "title": "Clinical Applications",
            "content": " Diagnostic approaches\n Treatment options\n Patient management",
            "narration": "Understanding these concepts helps us make informed clinical decisions and provide better patient care."
        },
        {
            "title": "Summary and Key Takeaways",
            "content": " Main points review\n Clinical implications\n Further learning resources",
            "narration": "To summarize, we've covered the essential aspects of this topic and their practical applications in healthcare."
        }
    ]

def generate_fallback_quiz(query: str):
    """Fallback quiz if LLM fails"""
    return [
        {
            "level": 1,
            "question": f"What is the main focus of {query}?",
            "options": ["A) Basic concept", "B) Advanced theory", "C) Practical application", "D) Historical context"],
            "correct_answer": "A",
            "explanation": "This is a foundational question about the topic."
        },
        {
            "level": 2,
            "question": f"How does {query} relate to clinical practice?",
            "options": ["A) Direct application", "B) Theoretical only", "C) Research purposes", "D) Historical interest"],
            "correct_answer": "A",
            "explanation": "Understanding the clinical relevance is important."
        },
        {
            "level": 3,
            "question": f"What would be an appropriate application of {query}?",
            "options": ["A) Patient care", "B) Administrative tasks", "C) Documentation", "D) Billing"],
            "correct_answer": "A",
            "explanation": "Applying knowledge to patient care scenarios."
        },
        {
            "level": 4,
            "question": f"How would you integrate {query} into a treatment plan?",
            "options": ["A) Evidence-based approach", "B) Traditional methods only", "C) Experimental only", "D) Not applicable"],
            "correct_answer": "A",
            "explanation": "Integration requires critical thinking and analysis."
        }
    ]
