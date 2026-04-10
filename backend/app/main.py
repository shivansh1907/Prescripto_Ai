from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from app.routes.prescription import router as prescription_router

from app.routes.health import router as health_router

app= FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def Hello():
    return {"message": "this is an api for converting raw prescription into structured format"}


app.include_router(prescription_router)


app.include_router(health_router)