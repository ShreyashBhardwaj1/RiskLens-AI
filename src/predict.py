import pandas as pd
import xgboost as xgb
import os


# Get absolute base directory (works locally AND on Render)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "credit_risk_model.json")


class RiskPredictor:

    def __init__(self):

        # Verify model exists
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

        # Load model
        self.model = xgb.XGBClassifier()
        self.model.load_model(MODEL_PATH)

        # Save feature names safely
        booster = self.model.get_booster()

        if booster.feature_names is None:
            raise ValueError(
                "Model has no feature names. Retrain model with feature names."
            )

        self.model_features = booster.feature_names

        print(f"Model loaded successfully from: {MODEL_PATH}")
        print(f"Total features expected: {len(self.model_features)}")


    def predict(self, input_data: dict):

        try:

            # Convert input to DataFrame
            df = pd.DataFrame([input_data])

            # Apply same preprocessing
            df = pd.get_dummies(df)

            # Align with training features
            df = df.reindex(columns=self.model_features, fill_value=0)

            # Predict
            prediction = self.model.predict(df)[0]
            probability = self.model.predict_proba(df)[0][1]

            # Generate explanations
            explanations = self.get_explanations(input_data, float(probability))

            return {
                "prediction": int(prediction),
                "default_probability": float(probability),
                "risk_level": "High" if probability > 0.5 else "Medium" if probability > 0.2 else "Low",
                "explanations": explanations
            }

        except Exception as e:

            return {
                "error": str(e),
                "prediction": None,
                "default_probability": None,
                "explanations": []
            }

    def get_explanations(self, data: dict, prob: float):
        explanations = []
        
        # Income vs Loan Amount
        income = data.get("person_income", 0)
        loan_amnt = data.get("loan_amnt", 0)
        if income > 0:
            ratio = loan_amnt / income
            if ratio > 0.3:
                explanations.append({
                    "factor": "High Loan-to-Income Ratio",
                    "impact": "Negative",
                    "description": f"The loan amount is {ratio:.1%} of your annual income, which is considered high."
                })
            elif ratio < 0.1:
                explanations.append({
                    "factor": "Healthy Loan-to-Income Ratio",
                    "impact": "Positive",
                    "description": "Your requested loan is well within a manageable range for your income."
                })

        # Employment Length
        emp_len = data.get("person_emp_length", 0)
        if emp_len < 2:
            explanations.append({
                "factor": "Short Employment History",
                "impact": "Negative",
                "description": "A shorter time at your current job can indicate less financial stability to lenders."
            })
        elif emp_len > 5:
            explanations.append({
                "factor": "Stable Employment History",
                "impact": "Positive",
                "description": "Your long employment history is a strong indicator of financial reliability."
            })

        # Previous Default
        if data.get("cb_person_default_on_file") == "Y":
            explanations.append({
                "factor": "Previous Default History",
                "impact": "Negative",
                "description": "Having a previous default on record significantly increases perceived risk."
            })

        # Loan Interest Rate
        int_rate = data.get("loan_int_rate", 0)
        if int_rate > 15:
            explanations.append({
                "factor": "High Interest Rate",
                "impact": "Negative",
                "description": "High interest rates often correlate with higher default risks in historical data."
            })

        # General Summary
        if prob > 0.5:
             explanations.insert(0, {
                "factor": "High Risk Detected",
                "impact": "Negative",
                "description": "Several factors suggest a higher likelihood of repayment challenges."
            })
        elif prob < 0.1:
            explanations.insert(0, {
                "factor": "Strong Profile",
                "impact": "Positive",
                "description": "Your financial profile shows very strong indicators for loan approval."
            })

        return explanations


# Test locally
if __name__ == "__main__":

    predictor = RiskPredictor()

    sample_input = {
        "person_age": 30,
        "person_income": 50000,
        "person_home_ownership": "RENT",
        "person_emp_length": 5,
        "loan_intent": "PERSONAL",
        "loan_grade": "B",
        "loan_amnt": 10000,
        "loan_int_rate": 10.0,
        "loan_percent_income": 0.2,
        "cb_person_default_on_file": "N",
        "cb_person_cred_hist_length": 5
    }

    result = predictor.predict(sample_input)

    print("\nPrediction Result:")
    print(result)