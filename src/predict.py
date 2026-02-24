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

            return {
                "prediction": int(prediction),
                "default_probability": float(probability)
            }

        except Exception as e:

            return {
                "error": str(e),
                "prediction": None,
                "default_probability": None
            }


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