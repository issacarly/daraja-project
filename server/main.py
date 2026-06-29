from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

import models, schemas
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Daraja LMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.0.104:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import bcrypt

JWT_SECRET = "dev_secret" # Use env variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

@app.get("/")
def read_root():
    return {"message": "Daraja LMS API running via FastAPI!"}

@app.post("/api/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email, models.User.role == user.role).first()
    if db_user:
        raise HTTPException(status_code=409, detail="An account with this email and role already exists.")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        name=user.name, 
        email=user.email, 
        password=hashed_password, 
        role=user.role,
        grade=user.grade,
        securityQuestion=user.securityQuestion,
        securityAnswer=user.securityAnswer.lower().strip() if user.securityAnswer else None,
        institutionId=user.institutionId,
        uic=user.uic
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    return {"token": access_token, "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email, "role": new_user.role, "grade": new_user.grade, "institutionId": new_user.institutionId, "uic": new_user.uic}}

@app.post("/api/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    print(f"Login attempt: email='{user_credentials.email}', role='{user_credentials.role}', pass='{user_credentials.password}'")
    user = db.query(models.User).filter(models.User.email == user_credentials.email, models.User.role == user_credentials.role).first()
    if not user:
        print(f"User not found for email='{user_credentials.email}' and role='{user_credentials.role}'")
        raise HTTPException(status_code=401, detail="Invalid email, password, or role.")
    
    is_password_correct = verify_password(user_credentials.password, user.password)
    if not is_password_correct:
        print("Password mismatch")
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    print("Login successful")
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"token": access_token, "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "grade": user.grade, "institutionId": user.institutionId, "uic": user.uic}}

from pydantic import BaseModel

class SecurityQuestionRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    securityAnswer: str
    newPassword: str

@app.post("/api/auth/security-question")
def get_security_question(req: SecurityQuestionRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email.")
    if not user.securityQuestion:
        raise HTTPException(status_code=400, detail="This account does not have a security question set up.")
    return {"securityQuestion": user.securityQuestion}

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email.")
    if not user.securityAnswer:
        raise HTTPException(status_code=400, detail="This account does not have a security question set up.")
    
    # Check answer (case-insensitive)
    if req.securityAnswer.lower().strip() != user.securityAnswer.lower().strip():
        raise HTTPException(status_code=400, detail="Incorrect security answer.")
    
    # Hash new password and save
    user.password = get_password_hash(req.newPassword)
    db.commit()
    return {"success": True, "message": "Password has been successfully reset."}
