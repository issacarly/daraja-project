from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint('email', 'role', name='_email_role_uc'),)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    password = Column(String)
    role = Column(String, default="STUDENT")
    grade = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
