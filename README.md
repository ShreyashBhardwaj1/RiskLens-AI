# RiskLens-AI: Credit Risk Prediction & Lending Intelligence Platform

## Live Production API

Base URL:
https://risklens-ai-hh7t.onrender.com

Interactive API Docs:
https://risklens-ai-hh7t.onrender.com/docs

---

## Overview

RiskLens-AI is a production-deployed machine learning system that predicts loan default risk and supports intelligent lending decisions.

It simulates real-world fintech risk engines used by banks and financial institutions to assess borrower creditworthiness.

This project implements a complete end-to-end ML pipeline including:

• Data preprocessing  
• Feature engineering  
• Model training and evaluation  
• Credit risk prediction using XGBoost  
• REST API deployment using FastAPI  
• Cloud deployment using Render  
• Production-grade model loading and inference  

---

## Key Features

• Predicts loan default probability in real time  
• Provides binary risk classification (Default / No Default)  
• Production-deployed REST API  
• Cloud-hosted inference engine  
• Scalable and deployment-ready architecture  
• Feature-aligned prediction pipeline  

---

## Problem Statement

Loan defaults cause major financial losses. Financial institutions need reliable systems to:

• Predict borrower default risk  
• Quantify probability of default  
• Enable risk-based lending decisions  
• Automate credit evaluation  

RiskLens-AI solves this using machine learning.

---

## Machine Learning Pipeline

### 1. Data Preprocessing
- Missing value handling  
- Categorical encoding  
- Feature transformation  

### 2. Feature Engineering
- Risk-relevant feature selection  
- Feature alignment with training schema  

### 3. Model Training

Algorithm used:
XGBoost Classifier

Why XGBoost:
• High accuracy  
• Excellent performance on tabular data  
• Used in real fintech risk systems  

---

## Model Performance

Example output:

```json
{
  "prediction": 1,
  "default_probability": 0.9983
}
```
