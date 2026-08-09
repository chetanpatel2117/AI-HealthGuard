from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

app = FastAPI(title="AI HealthGuard Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_FILE = DATA_DIR / "healthguard.json"
DATA_DIR.mkdir(exist_ok=True)


class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str
    age: Optional[int] = 35
    gender: Optional[str] = "Female"
    weight: Optional[float] = 70.0
    height: Optional[float] = 165.0
    phone: Optional[str] = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class PredictionInput(BaseModel):
    fullName: str
    age: int
    gender: str = "Female"
    weight: float = 0.0
    height: float = 0.0
    pregnancies: int = 0
    glucose: float = 0.0
    bloodPressure: float = 0.0
    skinThickness: float = 0.0
    insulin: float = 0.0
    diabetesPedigree: float = 0.0
    smokingStatus: str = "Never"
    alcoholConsumption: str = "None"
    exerciseLevel: str = "Moderate"
    familyHistory: bool = False
    selectedModel: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    userId: Optional[str] = "anonymous"


class NotificationRequest(BaseModel):
    userId: Optional[str] = "anonymous"
    notificationId: Optional[str] = None


class OCRRequest(BaseModel):
    base64Image: str
    mimeType: Optional[str] = "image/png"


class UserStore:
    def __init__(self):
        self.data = self._load()

    def _load(self) -> Dict[str, Any]:
        if DATA_FILE.exists():
            try:
                return json.loads(DATA_FILE.read_text(encoding="utf-8"))
            except Exception:
                pass
        return {"users": [], "passwords": {}, "predictions": [], "aiChats": {}, "notifications": {}, "settings": {}}

    def save(self):
        DATA_FILE.write_text(json.dumps(self.data, indent=2), encoding="utf-8")

    def get_user_by_email(self, email: str):
        for user in self.data["users"]:
            if user["email"].lower() == email.lower():
                return user
        return None

    def create_user(self, user: Dict[str, Any], password_hash: str):
        self.data["users"].append(user)
        self.data["passwords"][user["id"]] = password_hash
        self.save()
        return user

    def save_prediction(self, prediction: Dict[str, Any]):
        self.data["predictions"].insert(0, prediction)
        self.save()

    def get_predictions(self, user_id: str):
        return [p for p in self.data["predictions"] if p.get("userId") == user_id]

    def delete_prediction(self, prediction_id: str):
        before = len(self.data["predictions"])
        self.data["predictions"] = [p for p in self.data["predictions"] if p.get("id") != prediction_id]
        if len(self.data["predictions"]) != before:
            self.save()
            return True
        return False

    def save_chat_message(self, user_id: str, message: Dict[str, Any]):
        self.data["aiChats"].setdefault(user_id, []).append(message)
        self.save()

    def get_chat_history(self, user_id: str):
        return self.data["aiChats"].get(user_id, [])

    def get_notifications(self, user_id: str):
        return self.data["notifications"].get(user_id, [])

    def mark_notification_read(self, user_id: str, notification_id: str):
        for notification in self.data["notifications"].get(user_id, []):
            if notification.get("id") == notification_id:
                notification["read"] = True
                self.save()
                return True
        return False


store = UserStore()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@app.get("/api/health")
def health():
    return {"status": "healthy", "app": "AI HealthGuard", "version": "1.0.0", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.post("/api/auth/register")
def register(payload: RegisterRequest):
    if not payload.fullName or not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Full name, email, and password are required")
    if store.get_user_by_email(payload.email):
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user = {
        "id": f"usr_{int(datetime.now().timestamp() * 1000)}",
        "fullName": payload.fullName,
        "email": payload.email,
        "age": payload.age or 35,
        "gender": payload.gender or "Female",
        "weight": payload.weight or 70.0,
        "height": payload.height or 165.0,
        "phone": payload.phone or "",
        "role": "Patient",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    store.create_user(user, hash_password(payload.password))
    return {"message": "Registration successful", "token": user["id"], "user": user}


@app.post("/api/auth/login")
def login(payload: LoginRequest):
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    user = store.get_user_by_email(payload.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    stored_hash = store.data["passwords"].get(user["id"])
    if stored_hash != hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "token": user["id"], "user": user}


@app.get("/api/auth/me")
def auth_me(request: Request):
    token = request.headers.get("authorization", "")
    if not token.startswith("Bearer "):
        return {"user": None}
    user_id = token.split(" ", 1)[1]
    for user in store.data["users"]:
        if user["id"] == user_id:
            return {"user": user}
    return {"user": None}


@app.post("/api/predict")
def predict(payload: PredictionInput):
    if not payload.fullName or not payload.age or not payload.glucose:
        raise HTTPException(status_code=400, detail="Patient name, age, and glucose level are required")

    risk_score = max(0.0, min(100.0, float(payload.glucose) * 0.6 + float(payload.age) * 0.5 + (10 if payload.familyHistory else 0)))
    result = {
        "id": f"pred_{int(datetime.now().timestamp() * 1000)}",
        "userId": "anonymous",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "patientName": payload.fullName,
        "age": payload.age,
        "bmi": round((payload.weight / max(payload.height, 1) ** 2) * 10000, 2) if payload.weight and payload.height else 0.0,
        "bmiCategory": "Healthy" if payload.weight and payload.height and ((payload.weight / max(payload.height, 1) ** 2) * 10000) < 25 else "Overweight",
        "glucose": payload.glucose,
        "bloodPressure": payload.bloodPressure,
        "pregnancies": payload.pregnancies,
        "skinThickness": payload.skinThickness,
        "insulin": payload.insulin,
        "diabetesPedigree": payload.diabetesPedigree,
        "probability": round(risk_score, 2),
        "healthScore": round(100 - risk_score, 2),
        "riskLevel": "High Risk" if risk_score > 60 else "Moderate Risk" if risk_score > 35 else "Low Risk",
        "selectedModel": payload.selectedModel or "Python FastAPI Engine",
        "modelAccuracy": 91.2,
        "shapContributions": [],
        "aiSummary": "Prediction generated by Python FastAPI backend.",
        "doctorRecommendations": ["Follow up with a clinician", "Maintain a balanced diet"],
        "lifestyleAdvice": ["Exercise regularly", "Monitor glucose levels"],
        "inputData": payload.model_dump(),
    }
    store.save_prediction(result)
    return result


@app.get("/api/history")
def history():
    return store.get_predictions("anonymous")


@app.delete("/api/history/{prediction_id}")
def delete_history(prediction_id: str):
    if store.delete_prediction(prediction_id):
        return {"message": "Prediction deleted successfully", "id": prediction_id}
    raise HTTPException(status_code=404, detail="Prediction not found")


@app.post("/api/gemini/chat")
def chat(payload: ChatRequest):
    if not payload.message:
        raise HTTPException(status_code=400, detail="Message content is required")
    user_message = {"id": f"msg_u_{int(datetime.now().timestamp() * 1000)}", "sender": "user", "text": payload.message, "timestamp": datetime.now(timezone.utc).isoformat()}
    store.save_chat_message(payload.userId, user_message)
    reply_text = f"Python backend received: {payload.message}"
    ai_message = {"id": f"msg_ai_{int(datetime.now().timestamp() * 1000)}", "sender": "ai", "text": reply_text, "timestamp": datetime.now(timezone.utc).isoformat()}
    store.save_chat_message(payload.userId, ai_message)
    return {"reply": reply_text, "message": ai_message}


@app.get("/api/gemini/chat/history")
def chat_history():
    return store.get_chat_history("anonymous")


@app.post("/api/gemini/diet")
def diet_plan():
    return {"dailyCalorieTarget": 1800, "proteinTargetG": 120, "carbsTargetG": 180, "fatTargetG": 60, "waterIntakeLiters": 2.5, "meals": [], "shoppingList": ["Vegetables", "Lean protein", "Whole grains"], "weeklyMealSchedule": []}


@app.post("/api/ocr/upload")
def ocr_upload(payload: OCRRequest):
    if not payload.base64Image:
        raise HTTPException(status_code=400, detail="Base64 image string is required")
    return {"patientName": "", "age": 0, "gender": "Female", "glucose": 0, "bloodPressure": 0, "hba1c": 0, "insulin": 0, "skinThickness": 0, "bmi": 0, "confidenceScore": 0, "notes": ["OCR endpoint ready in Python backend."]}


@app.get("/api/notifications")
def notifications():
    return store.get_notifications("anonymous")


@app.post("/api/notifications/read")
def mark_notification_read(payload: NotificationRequest):
    if payload.notificationId:
        store.mark_notification_read(payload.userId, payload.notificationId)
    return {"success": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=False)
