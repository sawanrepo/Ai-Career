from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.services import get_current_user
from app.llm import LLM
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from typing import List
from datetime import datetime
from textwrap import dedent
import json
import re
from pydantic import ValidationError
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=schemas.LearningPathOut)
def create_learning_path(
    path_data: schemas.LearningPathCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    active_count = db.query(models.LearningPath).filter_by(
        user_id=current_user.id, is_archived=False
    ).count()

    if active_count >= 3:
        raise HTTPException(status_code=400, detail="You can only have 3 active learning paths at a time.")

    # Initialize LLM
    llm = LLM.get_llm()
    
    prompt = PromptTemplate(
        input_variables=["career_path"],
        template=dedent("""
        You are an expert career coach.

        A user wants to become a {career_path}.

        Generate a personalized learning path in 5–8 steps.

        Each step must include:
        - title
        - description (1–2 lines)
        - 1–2 helpful resources (each with: title, type [video/article/book/course], and a realistic placeholder URL)

        Return ONLY a valid JSON array like this:
        [
          {{
            "title": "...",
            "description": "...",
            "resources": [
              {{
                "title": "...",
                "type": "video",
                "url": "https://example.com"
              }}
            ]
          }}
        ]

        Do NOT include any extra text, explanation, or Markdown.
        """)
    )

    chain = LLMChain(llm=llm, prompt=prompt)

    try:
        raw_output = chain.invoke({"career_path": path_data.career_path})
        if isinstance(raw_output, dict):  # Handle dictionary responses
            content = raw_output.get("text", "")
        else:  # Handle LangChain response objects
            content = getattr(raw_output, "content", "") or getattr(raw_output, "text", "") or str(raw_output)
        logger.debug("🧪 Raw LLM response:\n%s", content)

        # Clean markdown code blocks
        if content.startswith("```json"):
            content = content[6:].strip().rstrip("`")
        elif content.startswith("```"):
            content = content[3:].strip().rstrip("`")

        # Attempt direct JSON parse
        try:
            steps = json.loads(content)
        except json.JSONDecodeError:
            # Fallback to regex extraction
            match = re.search(r"(\[\s*{.*}\s*\])", content, re.DOTALL)
            if not match:
                raise ValueError("No JSON array found in response")
            steps = json.loads(match.group(1))

        # Validate schema using Pydantic models
        validated_steps = []
        for step in steps:
            try:
                # Validate individual step
                validated_step = schemas.LearningStep(**step)
                # Validate resources if present
                if validated_step.resources:
                    pass
                validated_steps.append(validated_step.dict())
            except ValidationError as e:
                logger.error("Validation error in step: %s", e)
                raise ValueError(f"Invalid step format: {str(e)}")

    except json.JSONDecodeError as e:
        logger.error("JSON decode error: %s\nContent: %s", str(e), content)
        raise HTTPException(status_code=422, detail=f"Invalid JSON format: {str(e)}")
    except ValueError as e:
        logger.error("Validation error: %s\nContent: %s", str(e), content)
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error during LLM processing")
        raise HTTPException(status_code=500, detail="Failed to generate learning path")

    new_path = models.LearningPath(
        user_id=current_user.id,
        career_path=path_data.career_path,
        current_step=0,
        total_steps=len(validated_steps),
        steps=validated_steps,
        is_completed=False,
        is_archived=False
    )
    
    try:
        db.add(new_path)
        db.commit()
        db.refresh(new_path)
    except Exception as e:
        db.rollback()
        logger.error("Database error: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to save learning path")

    return new_path

@router.get("/", response_model=List[schemas.LearningPathOut])
def get_active_learning_paths(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.LearningPath).filter_by(
        user_id=current_user.id, is_archived=False
    ).order_by(models.LearningPath.created_at.desc()).all()


@router.get("/archived", response_model=List[schemas.LearningPathOut])
def get_archived_paths(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.LearningPath).filter_by(
        user_id=current_user.id, is_archived=True
    ).order_by(models.LearningPath.updated_at.desc()).all()


@router.put("/{path_id}", response_model=schemas.LearningPathOut)
def update_learning_path(
    path_id: int,
    update_data: schemas.LearningPathUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    path = db.query(models.LearningPath).filter_by(
        id=path_id, user_id=current_user.id
    ).first()

    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found.")

    if update_data.current_step is not None:
        if update_data.current_step > path.total_steps:
            raise HTTPException(status_code=400, detail="Invalid current step.")
        path.current_step = update_data.current_step

    if update_data.is_completed is not None:
        path.is_completed = update_data.is_completed

    if update_data.is_archived is not None:
        path.is_archived = update_data.is_archived

    path.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(path)
    return path


@router.post("/{path_id}/reactivate", response_model=schemas.LearningPathOut)
def reactivate_learning_path(
    path_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    active_count = db.query(models.LearningPath).filter_by(
        user_id=current_user.id, is_archived=False
    ).count()

    if active_count >= 3:
        raise HTTPException(status_code=400, detail="Cannot reactivate. Max 3 active paths allowed.")

    path = db.query(models.LearningPath).filter_by(
        id=path_id, user_id=current_user.id
    ).first()

    if not path:
        raise HTTPException(status_code=404, detail="Path not found.")
    if not path.is_archived:
        raise HTTPException(status_code=400, detail="Path is already active.")

    path.is_archived = False
    path.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(path)
    return path