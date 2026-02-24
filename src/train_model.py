import os
import pandas as pd

from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split


# File paths
DATA_PATH = "data/credit_risk_dataset.csv"
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "credit_risk_model.json")


def load_data(path: str) -> pd.DataFrame:
    """
    Load dataset from CSV file
    """
    df = pd.read_csv(path)
    print(f"Dataset loaded: {df.shape}")
    return df


def preprocess_data(df: pd.DataFrame):
    """
    Preprocess data: clean, encode, split
    """

    # Remove missing values
    df = df.dropna()

    # Target column
    target_column = "loan_status"

    # Separate features and target
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Convert categorical variables to numeric
    X = pd.get_dummies(X, drop_first=True)

    # Train-test split
    return train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )


def train_model():
    """
    Train and save credit risk model
    """

    print("Loading data...")
    df = load_data(DATA_PATH)

    print("Preprocessing data...")
    X_train, X_test, y_train, y_test = preprocess_data(df)

    print("Training model...")

    model = XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss"
    )

    model.fit(X_train, y_train)

    print("Evaluating model...")

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print(f"\nModel Accuracy: {accuracy:.4f}\n")

    print("Classification Report:")
    print(classification_report(y_test, predictions))

    print("Saving model...")

    # Create models directory if it doesn't exist
    os.makedirs(MODEL_DIR, exist_ok=True)

    # Save model in native XGBoost format
    model.save_model(MODEL_PATH)

    print(f"Model saved at: {MODEL_PATH}")


if __name__ == "__main__":
    train_model()