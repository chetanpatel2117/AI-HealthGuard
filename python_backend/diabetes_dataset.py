"""
AI HealthGuard - Diabetes Dataset Statistics & Feature Metadata
Standardized statistical baseline derived from the NIH / NIDDK Pima Indians Diabetes Dataset
"""

from typing import Dict, Any

# Baseline population diabetes prevalence rate (Pima Indians dataset mean)
BASE_DIABETES_RATE = 34.9  # %

# Feature normalization statistics (mean and standard deviation for Z-score normalization)
FEATURE_STATS: Dict[str, Dict[str, Any]] = {
    "glucose": {
        "mean": 120.89,
        "std": 31.97,
        "unit": "mg/dL",
        "name": "Fasting Plasma Glucose",
        "normal_range": "70 - 99 mg/dL",
        "prediabetes_range": "100 - 125 mg/dL",
        "diabetes_range": ">= 126 mg/dL",
        "weight_importance": 0.38
    },
    "bmi": {
        "mean": 31.99,
        "std": 6.88,
        "unit": "kg/m²",
        "name": "Body Mass Index (BMI)",
        "normal_range": "18.5 - 24.9",
        "overweight_range": "25.0 - 29.9",
        "obese_range": ">= 30.0",
        "weight_importance": 0.28
    },
    "age": {
        "mean": 33.24,
        "std": 11.76,
        "unit": "years",
        "name": "Patient Age",
        "weight_importance": 0.14
    },
    "diabetes_pedigree": {
        "mean": 0.471,
        "std": 0.331,
        "unit": "score",
        "name": "Diabetes Pedigree Function (DPF)",
        "weight_importance": 0.12
    },
    "insulin": {
        "mean": 79.80,
        "std": 115.24,
        "unit": "µU/mL",
        "name": "2-Hour Serum Insulin",
        "weight_importance": 0.08
    },
    "blood_pressure": {
        "mean": 69.11,
        "std": 19.35,
        "unit": "mmHg",
        "name": "Diastolic Blood Pressure",
        "weight_importance": 0.06
    },
    "pregnancies": {
        "mean": 3.84,
        "std": 3.37,
        "unit": "count",
        "name": "Pregnancies",
        "weight_importance": 0.05
    },
    "skin_thickness": {
        "mean": 20.53,
        "std": 15.95,
        "unit": "mm",
        "name": "Triceps Skinfold Thickness",
        "weight_importance": 0.03
    }
}
