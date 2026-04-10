from app.models.output_model import PrescriptionOutput
from app.controllers.llm_service import extract_from_image
from fastapi import APIRouter, File, UploadFile, HTTPException
import json
from fastapi.responses import JSONResponse

from app.utils.output_parser import safe_parse_json

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

@router.post('/parse-image',response_model=PrescriptionOutput) #response_model=PrescriptionOutput)
async def prescription(file: UploadFile = File(...)):

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type.")

    image_bytes = await file.read()

    if len(image_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large. Max 5MB.")

    try:

       result = extract_from_image(image_bytes, file.content_type)  # pass mime_type
       result = result.replace("```json", "").replace("```", "").strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM extraction failed: {str(e)}")
     # Debugging line
   
    print("Raw model output:", result)  


    try:
        # parsed = json.loads(result)
      
        parsed = json.loads(result) # converts string to dict
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON from model: {result}")

    return JSONResponse( status_code=200, content=parsed)