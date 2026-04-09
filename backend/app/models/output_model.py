from pydantic import BaseModel,Field
from typing import List,Dict,Optional,Annotated


class Medications(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: Optional[str]









class PrescriptionOutput(BaseModel):

    chief_complaints:Annotated[List[str], Field(example=["fever", "cough"],description="List of chief complaints mentioned in the prescription")]
    diagnosis:str
    medications:List[Medications]
    lab_tests:Optional[List[str]]=None
    radiology_test:Optional[List[str]]=None
    advice:Optional[str]=None
