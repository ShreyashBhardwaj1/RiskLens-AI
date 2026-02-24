import pandas as pd
import xgboost as xgb


MODEL_PATH = "models/credit_risk_model.json"


class RiskPredictor:

    def __init__(self):

        # Load model using native XGBoost method
        self.model = xgb.XGBClassifier()
        self.model.load_model(MODEL_PATH)

        print("Model loaded successfully")

    def predict(self, input_data: dict):

        # Convert input to DataFrame
        df = pd.DataFrame([input_data])

        # Convert categorical variables
        df = pd.get_dummies(df)

        # Align with model features
        model_features = self.model.get_booster().feature_names
        df = df.reindex(columns=model_features, fill_value=0)

        # Predict
        prediction = self.model.predict(df)[0]
        probability = self.model.predict_proba(df)[0][1]

        return {
            "prediction": int(prediction),
            "default_probability": float(probability)
        }


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