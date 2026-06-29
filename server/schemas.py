import re
from pydantic import BaseModel, EmailStr, validator

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str = "STUDENT"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    password_confirm: str
    role: str = "STUDENT"
    grade: str = "Grade 5"
    securityQuestion: str
    securityAnswer: str
    institutionId: int | None = None
    uic: str | None = None

    @validator('password_confirm')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

    @validator('password')
    def password_complexity(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[@$!%*#?&^()_\-+=]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    grade: str | None

    class Config:
        from_attributes = True
