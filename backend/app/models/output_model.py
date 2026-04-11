from pydantic import BaseModel,Field
from typing import List,Dict,Optional,Annotated


class Medications(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: Optional[str]









class PrescriptionOutput(BaseModel):

    patient_name: Optional[str] = Field(None, example="John Doe", description="Name of the patient")
    patient_age: Optional[int] = Field(None, example=30, description="Age of the patient")
    confidence_score: Optional[float] = Field(None, example=0.85, description="Confidence score of the extraction (0.0 to 1.0)")    

    chief_complaints:Annotated[List[str], Field(example=["fever", "cough"],description="List of chief complaints mentioned in the prescription")]
    diagnosis:List[str]
    medications:List[Medications]
    lab_tests:Optional[List[str]]=None
    radiology_test:Optional[List[str]]=None
    advice:Optional[str]=None
