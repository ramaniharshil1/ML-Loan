"""
LoanPredict Flask Backend — Full Version
=========================================
Run:
  pip install -r requirements.txt
  python app.py
Runs on: http://localhost:5000

Place loan_model.pkl in the same folder as this file.
"""

import os
import pickle
from datetime import datetime, timedelta

import bcrypt
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from flask_sqlalchemy import SQLAlchemy

import glob

# ─── App Setup ───────────────────────────────────────────────────────────────
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///loanpredict.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY", "loanpredict-super-secret-key-change-in-production"
)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

db  = SQLAlchemy(app)
jwt = JWTManager(app)

# CORS(
#     app,
#     resources={
#         r"/*": {
#             "origins": [
#                 "http://localhost:5173",
#                 "http://localhost:3000",
#                 "http://127.0.0.1:5173",
#                 "http://127.0.0.1:3000",
#             ]
#         }
#     },
# )
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "https://loan-predict-nine.vercel.app"
            ]
        }
    },
    supports_credentials=True
)


# ─── Database Models ──────────────────────────────────────────────────────────
class User(db.Model):
    __tablename__ = "users"
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(100), nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    predictions   = db.relationship(
        "Prediction", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}


class Prediction(db.Model):
    __tablename__   = "predictions"
    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    age             = db.Column(db.Integer)
    income          = db.Column(db.Float)
    loan_amount     = db.Column(db.Float)
    credit_score    = db.Column(db.Integer)
    months_employed = db.Column(db.Integer)
    interest_rate   = db.Column(db.Float)
    dti_ratio       = db.Column(db.Float)
    education       = db.Column(db.String(50))
    employment      = db.Column(db.String(50))
    marital         = db.Column(db.String(50))
    result          = db.Column(db.String(10))
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":              self.id,
            "age":             self.age,
            "income":          self.income,
            "loan_amount":     self.loan_amount,
            "credit_score":    self.credit_score,
            "months_employed": self.months_employed,
            "interest_rate":   self.interest_rate,
            "dti_ratio":       self.dti_ratio,
            "education":       self.education,
            "employment":      self.employment,
            "marital":         self.marital,
            "result":          self.result,
            "created_at":      self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


# ─── Load ML Model ────────────────────────────────────────────────────────────
# MODEL_PATH = os.path.join(os.path.dirname(__file__), "loan_model.pkl")
# model = None

# try:
#     with open(MODEL_PATH, "rb") as f:
#         model = pickle.load(f)
#     print(f"✅ Model loaded from: {MODEL_PATH}")
# except FileNotFoundError:
#     print("❌  loan_model.pkl not found — place it in the backend/ folder")
# except Exception as exc:
#     print(f"❌  Error loading model: {exc}")



# ─── Load ML Model (Split-Merge Logic) ────────────────────────────────────────
def load_merged_model():
    base_name = "loan_model.pkl"
    temp_full = "temp_full_model.pkl"
    
    # Check for split parts (loan_model.pkl.part0, .part1, etc.)
    parts = sorted(glob.glob(f"{base_name}.part*"))
    
    if parts:
        print(f"📦 Found {len(parts)} model parts. Merging...")
        with open(temp_full, "wb") as outfile:
            for part in parts:
                with open(part, "rb") as infile:
                    outfile.write(infile.read())
        
        with open(temp_full, "rb") as f:
            loaded_model = pickle.load(f)
        
        # Clean up temporary file to save cloud disk space
        if os.path.exists(temp_full):
            os.remove(temp_full)
        return loaded_model
    
    # If no parts, try to load single file (local dev)
    elif os.path.exists(base_name):
        with open(base_name, "rb") as f:
            return pickle.load(f)
    
    return None

model = load_merged_model()

if model:
    print("✅ Model loaded successfully!")
else:
    print("❌ Model files not found. Ensure loan_model.pkl.partX files exist.")





# ─── Init DB ──────────────────────────────────────────────────────────────────
with app.app_context():
    db.create_all()
    print("✅ Database ready (loanpredict.db)")


# ─── Helper ───────────────────────────────────────────────────────────────────
def uid() -> int:
    return int(get_jwt_identity())


# ─── Health ───────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({
        "status":       "ok",
        "message":      "LoanPredict API is running!",
        "model_loaded": model is not None,
    })


# ─── Auth ─────────────────────────────────────────────────────────────────────
@app.route("/api/auth/register", methods=["POST"])
def register():
    data     = request.get_json(force=True) or {}
    name     = (data.get("name") or "").strip()
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "This email is already registered"}), 409

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user   = User(name=name, email=email, password_hash=hashed)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data     = request.get_json(force=True) or {}
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()})


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def me():
    user = User.query.get(uid())
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


# ─── Predict ──────────────────────────────────────────────────────────────────
@app.route("/api/predict", methods=["POST"])
@jwt_required()
def predict():
    if model is None:
        return jsonify({"error": "ML model not loaded. Add loan_model.pkl to backend folder"}), 500

    data = request.get_json(force=True) or {}

    try:
        age             = int(data["age"])
        income          = float(data["income"])
        loan_amount     = float(data["loan_amount"])
        credit_score    = int(data["credit_score"])
        months_employed = int(data["months_employed"])
        interest_rate   = float(data["interest_rate"])
        dti_ratio       = float(data["dti_ratio"])
        education       = str(data["education"])
        employment      = str(data["employment"])
        marital         = str(data["marital"])
    except (KeyError, TypeError, ValueError) as exc:
        return jsonify({"error": f"Missing or invalid field: {exc}"}), 400

    df = pd.DataFrame({
        "Age":            [age],
        "Income":         [income],
        "LoanAmount":     [loan_amount],
        "CreditScore":    [credit_score],
        "MonthsEmployed": [months_employed],
        "InterestRate":   [interest_rate],
        "DTIRatio":       [dti_ratio],
        "Education":      [education],
        "EmploymentType": [employment],
        "MaritalStatus":  [marital],
        # Static defaults (matching original app.py)
        "NumCreditLines": [2],
        "LoanTerm":       [36],
        "HasMortgage":    ["No"],
        "HasDependents":  ["No"],
        "LoanPurpose":    ["Other"],
        "HasCoSigner":    ["No"],
    })

    try:
        raw    = model.predict(df)[0]
        result = "Safe" if int(raw) == 0 else "Risk"
    except Exception as exc:
        print(f"❌ Prediction error: {exc}")
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    pred = Prediction(
        user_id=uid(),
        age=age, income=income, loan_amount=loan_amount,
        credit_score=credit_score, months_employed=months_employed,
        interest_rate=interest_rate, dti_ratio=dti_ratio,
        education=education, employment=employment, marital=marital,
        result=result,
    )
    db.session.add(pred)
    db.session.commit()

    print(f"✅ Prediction [{result}] — Credit:{credit_score} DTI:{dti_ratio} Loan:₹{loan_amount}")
    return jsonify({"prediction": result, "status": "success", "id": pred.id})


# ─── History ──────────────────────────────────────────────────────────────────
@app.route("/api/history", methods=["GET"])
@jwt_required()
def history():
    preds = (
        Prediction.query
        .filter_by(user_id=uid())
        .order_by(Prediction.created_at.desc())
        .all()
    )
    return jsonify([p.to_dict() for p in preds])


@app.route("/api/history/<int:pred_id>", methods=["DELETE"])
@jwt_required()
def delete_prediction(pred_id):
    pred = Prediction.query.filter_by(id=pred_id, user_id=uid()).first()
    if not pred:
        return jsonify({"error": "Prediction not found"}), 404
    db.session.delete(pred)
    db.session.commit()
    return jsonify({"message": "Deleted successfully", "id": pred_id})


# ─── Stats ────────────────────────────────────────────────────────────────────
@app.route("/api/stats", methods=["GET"])
@jwt_required()
def stats():
    preds  = Prediction.query.filter_by(user_id=uid()).all()
    total  = len(preds)
    safe   = sum(1 for p in preds if p.result == "Safe")
    risk   = total - safe

    def avg(attr):
        return round(sum(getattr(p, attr) or 0 for p in preds) / total, 2) if total else 0

    return jsonify({
        "total":        total,
        "safe":         safe,
        "risk":         risk,
        "safe_percent": round((safe / total) * 100, 1) if total else 0,
        "avg_credit":   avg("credit_score"),
        "avg_loan":     avg("loan_amount"),
        "avg_dti":      avg("dti_ratio"),
        "avg_income":   avg("income"),
    })


# ─── Error Handlers ───────────────────────────────────────────────────────────
@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(_):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(422)
def unprocessable(_):
    return jsonify({"error": "Invalid or missing JWT token"}), 422


# ─── Entry ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n🚀 LoanPredict API starting...")
    print("   https://loan-ml-production.up.railway.app\n")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
