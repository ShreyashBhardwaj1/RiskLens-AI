from fastapi import FastAPI
from pydantic import BaseModel
import sys
import os

# Ensure src folder is accessible
sys.path.append(os.path.abspath("src"))

from predict import RiskPredictor


# This line is CRITICAL — do not rename 'app'
app = FastAPI(
    title="RiskLens-AI API",
    description="Credit Risk Prediction API",
    version="1.0"
)

# Load model once
predictor = RiskPredictor()


# Define input schema
class LoanApplication(BaseModel):

    person_age: int
    person_income: float
    person_home_ownership: str
    person_emp_length: float
    loan_intent: str
    loan_grade: str
    loan_amnt: float
    loan_int_rate: float
    loan_percent_income: float
    cb_person_default_on_file: str
    cb_person_cred_hist_length: float


# Test endpoint
@app.get("/")
def home():
    return {"message": "RiskLens-AI API is running"}


# Prediction endpoint
@app.post("/predict")
def predict(application: LoanApplication):

    result = predictor.predict(application.dict())

    return result