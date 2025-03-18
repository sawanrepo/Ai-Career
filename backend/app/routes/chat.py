from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatRequest, ChatHistoryResponse, ChatResponse
from app.services import (
    save_chat_message,
    get_chat_history,
    reset_chat_history,
    get_current_user,
    get_user_profile
)
from app.models import User
from datetime import datetime

from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate

from app.llm import LLM  

from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
memory_dict = {}

def get_user_context(profile) -> str:
    return f"""
User Profile:
Skills: {', '.join(profile.skills) if profile.skills else "Not provided"}
Interests: {', '.join(profile.interests) if profile.interests else "Not provided"}
Education: {profile.education or "Not provided"}
Goals: {profile.goals or "Not provided"} 
"""

@router.post("/tatva-chat", response_model=ChatResponse)
def chat_with_tatva(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    profile = get_user_profile(db, user_id)
    username = current_user.username
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    context = get_user_context(profile)

    full_prompt = f"""You are Tatva, a wise and friendly AI mentor guiding students in their career journey.
The user has this Profile : -
username: {username}
{context}

Your job is to give refined, concise, and structured advice tailored to the user’s goals. 
Respond like a supportive mentor, not like an article or textbook.
Use this style:
- Start with a personalized greeting using the user's username (e.g., "Hey {username}! 👋") and a short affirmation.
-Only  if any part of the user profile says "Not provided", gently suggest the user to update it in the dashboard → profile section for better career guidance and Also let them know they can tell you their skills, interests, goals etc. in the chat temporarily, but it won’t be saved in their profile.
- Keep paragraphs short or use bullet points.
- Add emojis when appropriate for warmth.
- Avoid long blocks of text.
- End with a suggestion or follow-up question.
Instructions:
- Be supportive, logical, and example-rich in your replies.
- If the user seems confused, offer clear directions.
- If they ask unrelated (non-career) questions, kindly redirect them to career topics.
- If the user shows signs of stress or frustration, suggest speaking to a counselor (available on the dashboard).
- Provide learning resources when needed.


Chat history:
{{history}}

User: {{input}}
Tatva:"""

    system_prompt = PromptTemplate(
        input_variables=["history", "input"],
        template=full_prompt
    )

    if user_id not in memory_dict:
        memory_dict[user_id] = ConversationBufferMemory(
            return_messages=True,
            memory_key="history",
            max_token_limit=1000
        )

    llm = LLM.get_llm(temperature=0.3)

    chain = ConversationChain(
        llm=llm,
        memory=memory_dict[user_id],
        prompt=system_prompt
    )

    ai_response = chain.predict(input=req.message)

    save_chat_message(db, user_id, "user", req.message)
    save_chat_message(db, user_id, "tatva", ai_response)

    return ChatResponse(sender="tatva", message=ai_response, timestamp=datetime.utcnow())


@router.get("/tatva-chat-history", response_model=ChatHistoryResponse)
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    messages = get_chat_history(db, current_user.id)
    formatted = [ChatResponse(sender=m.sender, message=m.message, timestamp=m.timestamp) for m in messages]
    return ChatHistoryResponse(history=formatted)


@router.post("/tatva-chat-reset")
def reset_chat(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reset_chat_history(db, current_user.id)
    if current_user.id in memory_dict:
        memory_dict[current_user.id].clear()
        del memory_dict[current_user.id]
    return {"message": "Chat history reset successfully."}