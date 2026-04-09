from fastapi import FastAPI

app= FastAPI()

@app.get('/')
def Hello():
    return {"message": "this is an api for converting raw prescription into structured format"}

from app.routes.prescription import router as prescription_router
app.include_router(prescription_router)


from app.routes.health import router as health_router
app.include_router(health_router)