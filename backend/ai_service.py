import os
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv()

# Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def generate_with_groq(data):
    """Generate analysis using Groq (Llama 3)."""
    if not GROQ_API_KEY:
        return json.dumps({
            "score": 0,
            "leadership_potential": "Unknown",
            "summary": "Error: GROQ_API_KEY not found in .env file. Please add it to use AI features.",
            "strengths": [],
            "interview_questions": []
        })

    try:
        client = Groq(api_key=GROQ_API_KEY)
        
        prompt = f"""
        Act as a highly experienced Executive Leadership Coach and Admissions Director for "Iron Lady".
        Your task is to critically analyze this applicant for a high-performance leadership program.
        
        **CRITICAL INSTRUCTION:** 
        - Your analysis MUST be specific to the text provided. Do NOT use generic phrases.
        - You MUST reference the applicant's specific goal or challenge in your summary.
        - If the input is short or vague (e.g., "test", "idk"), give a LOW score (<30) and a blunt summary like "Insufficient data provided."
        - Avoid robotic language. Sound human, insightful, and "relatable".

        Applicant Data:
        - Name: {data.get('applicant_name')}
        - Role: {data.get('role')}
        - Goal: "{data.get('goal')}"
        - Challenge: "{data.get('challenge')}"

        Analyze based on:
        1. **Resilience & Clarity**: Do they clearly articulate a real problem?
        2. **Leadership Potential**: Is this a strategic challenge or just a task-level complaint?
        3. **Growth Mindset**: Are they seeking solutions or just venting?

        Output Format (Raw JSON only):
        {{
            "score": <integer_0_to_100>,
            "leadership_potential": "Emerging / High / Exceptional / Unclear",
            "summary": "Deep insight: [Use their name], you are struggling with [Specific Challenge]. This is common for [Role] because [Reason]. You need to focus on...",
            "strengths": ["Specific Strength 1", "Specific Strength 2", "Specific Strength 3"],
            "interview_questions": [
                "Your challenge mentions [X], how specifically have you tried to fix it?",
                "You aim for [Goal], but what is the biggest personal barrier stopping you?",
                "Tell me about a time [Challenge] caused a business failure."
            ]
        }}
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a strict, insightful leadership coach. You hate generic answers. You analyze specific words used by the applicant."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7,
        )
        print("DEBUG: AI Generation Complete")

        response_text = chat_completion.choices[0].message.content
        # Clean up any potential markdown from Llama
        response_text = response_text.replace('```json', '').replace('```', '').strip()
        print(f"DEBUG: AI Response: {response_text[:50]}...")
        # Validate JSON
        json.loads(response_text)
        return response_text

    except Exception as e:
        return json.dumps({
            "score": 0,
            "leadership_potential": "Error",
            "summary": f"AI Analysis Failed: {str(e)}",
            "strengths": [],
            "interview_questions": []
        })

def generate_application_summary(data: dict) -> str:
    # Solely rely on Groq as requested
    return generate_with_groq(data)

