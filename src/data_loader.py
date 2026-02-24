import pandas as pd
import os

def load_data(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    
    df = pd.read_csv(path)
    print("Data loaded successfully")
    print("Shape:", df.shape)
    return df


if __name__ == "__main__":
    df = load_data("data/credit_risk_dataset.csv")
    print(df.head())