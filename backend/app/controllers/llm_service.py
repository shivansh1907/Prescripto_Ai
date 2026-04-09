from google import genai
from google.genai import types
import base64
from app.core.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

PROMPT = """
You are a medical data extraction assistant.
Analyze the doctor's prescription image and extract structured medical information.

Extract the following fields:
1. chief_complaints
2. diagnosis
3. medications (each with: name, dosage, frequency, duration)
4. lab_tests
5. radiology_tests
6. advice

Rules:
- If a field is missing, return an empty list [].
- For missing medication subfields, use null.
- Do NOT hallucinate or guess missing information.
- Return ONLY valid JSON. No markdown, no explanations.

Output format:
{
  "chief_complaints": [],
  "diagnosis": [],
  "medications": [
    {
      "name": "",
      "dosage": "",
      "frequency": "",
      "duration": ""
    }
  ],
  "lab_tests": [],
  "radiology_tests": [],
  "advice": []
}
"""

def extract_from_image(image_bytes: bytes, mime_type: str) -> str:
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            PROMPT,
            types.Part.from_bytes(
                data=base64_image,
                mime_type=mime_type
            )
        ]
    )

    return response.text