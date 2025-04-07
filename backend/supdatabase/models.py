from pydantic import BaseModel
from typing import Optional

class UserSignup(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None  # Optional phone number
    address: Optional[str] = None
