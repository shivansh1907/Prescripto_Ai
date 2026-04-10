# 💊 PrescriptoAI

AI-powered prescription parser that converts doctor prescription images into structured JSON data using Google Gemini Vision API and FastAPI.

---

## What it does

Upload a photo of any doctor's prescription (handwritten or printed) and get back a clean structured JSON with:

- `chief_complaints` — symptoms the patient reported
- `diagnosis` — doctor's final assessment
- `medications` — name, dosage, frequency, duration
- `lab_tests` — ordered blood/urine/pathology tests
- `radiology_tests` — X-Ray, MRI, CT Scan orders
- `advice` — follow-up instructions and lifestyle tips

---

## Tech Stack

- **Backend** — FastAPI (Python)
- **AI Model** — Google Gemini Vision (`gemini-2.0-flash`)
- **Frontend** — React + Vite + TailwindCSS
- **HTTP Client** — Axios

---

## Project Structure

```
prescripto ai/
  backend/
    .env                  ← API keys (never push this)
    .gitignore
    app/
      main.py             ← FastAPI app entry point
      core/
        config.py         ← loads env variables
      models/
        output_model.py   ← Pydantic response models
      routes/
        prescription.py   ← POST /parse-image endpoint
      controllers/
        llm_service.py    ← Gemini API integration
  frontend/
    src/
      components/
        Home.jsx
```

---

## Backend Setup

### 1. Create and activate virtual environment

```bash
cd backend
python -m venv myenv

# Windows
myenv\Scripts\activate

# Mac/Linux
source myenv/bin/activate
```

### 2. Install dependencies

```bash
pip install fastapi uvicorn google-genai python-multipart python-dotenv
```

### 3. Set up your API key

Get a free Gemini API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

Create a `.env` file inside the `backend` folder:

```
GEMINI_API_KEY=your_api_key_here
```

> **Important:** Never push `.env` to GitHub. Make sure it's in `.gitignore`.

### 4. Configure `config.py`

```python
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
```

Alternatively on Windows, set the key permanently using:

```cmd
setx GEMINI_API_KEY "your_api_key_here"
```

Then restart VS Code and simplify `config.py` to just:

```python
import os
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
```

### 5. Run the backend server

```bash
cd backend
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`

Visit `http://localhost:8000/docs` for the Swagger UI.

---

## Output Model (`output_model.py`)

```python
from pydantic import BaseModel
from typing import Optional, List

class Medications(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None

class PrescriptionOutput(BaseModel):
    chief_complaints: List[str]
    diagnosis: List[str]
    medications: List[Medications]
    lab_tests: Optional[List[str]] = None
    radiology_tests: Optional[List[str]] = None
    advice: Optional[str] = None
```

---

## API Endpoint

### `POST /parse-image`

Accepts a prescription image and returns structured JSON.

**Request:**
```
Content-Type: multipart/form-data
Body: file (image/jpeg, image/png, image/webp, image/gif) — Max 5MB
```

**Response:**
```json
{
  "chief_complaints": ["Fever", "Sore throat"],
  "diagnosis": ["Acute pharyngitis"],
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days"
    }
  ],
  "lab_tests": ["CBC", "CRP"],
  "radiology_tests": [],
  "advice": "Rest for 3 days, stay hydrated"
}
```

---

## CORS Configuration (`main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.prescription import router as prescription_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prescription_router)
```

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
npm install axios
```

### 2. Run the frontend

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 3. Axios call example

```jsx
const formData = new FormData()
formData.append('file', file)

const response = await axios.post('http://localhost:8000/parse-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
setResult(response.data)
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|---|---|---|
| `getaddrinfo failed` | Network blocking Google API | Switch to mobile hotspot |
| `429 RESOURCE_EXHAUSTED` | Rate limit hit | Wait 1-2 mins and retry |
| `503 UNAVAILABLE` | Gemini servers busy | Retry logic handles this automatically |
| `403 PERMISSION_DENIED` — API key leaked | Key pushed to GitHub | Generate new key, use `.env` |
| `ModuleNotFoundError: fastapi` | Virtual env not activated | Run `myenv\Scripts\activate` |
| `KEY: None` | `.env` not found | Use absolute path or `setx` command |
| CORS error | Middleware misconfigured | Add `CORSMiddleware` before routers |

---

## Gemini Model Fallback (`llm_service.py`)

To handle 503 errors automatically:

```python
MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"]

def extract_from_image(image_bytes: bytes, mime_type: str) -> str:
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    for model in MODELS:
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=[PROMPT, types.Part.from_bytes(data=base64_image, mime_type=mime_type)]
                )
                return response.text
            except genai_errors.ServerError:
                if attempt < 2:
                    time.sleep(5)
                    continue
                break
            except genai_errors.ClientError as e:
                raise HTTPException(status_code=400, detail=f"Gemini error: {str(e)}")

    raise HTTPException(status_code=503, detail="All models busy. Try again later.")
```

---

## .gitignore

```
.env
myenv/
__pycache__/
*.pyc
node_modules/
dist/
```

---

## Free Tier Limits (Gemini API)

| Limit | Amount |
|---|---|
| Requests per day | 1,500 |
| Requests per minute | 15 |
| Cost | Free |

No billing needed for development and testing.

---

## Notes

- Always run the server from the `backend` directory with the virtual environment activated
- Use mobile hotspot if college/office WiFi blocks Google API endpoints
- Never hardcode API keys in source files
- The `.env` file must never be committed to GitHub
