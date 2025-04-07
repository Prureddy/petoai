from fastapi import APIRouter, HTTPException
from database.supabase_client import supabase
from database.models import UserSignup
from typing import Dict

auth_router = APIRouter()

@auth_router.post("/signup")
async def signup(user: UserSignup):
    """Registers a user and sends a verification email."""
    
    # Step 1: Sign up user with Supabase Auth
    auth_response = supabase.auth.sign_up({
        "email": user.email,
        "password": user.password
    })

    if "error" in auth_response and auth_response["error"]:
        raise HTTPException(status_code=400, detail=auth_response["error"]["message"])

    user_data = auth_response["user"]

    # Step 2: Store user in database with verification pending
    response = supabase.table("users").insert({
        "id": user_data["id"],
        "email": user.email,
        "full_name": user.full_name,
        "is_verified": False  # Initially False until email is confirmed
    }).execute()

    return {"message": "Verification email sent. Please check your inbox."}

@auth_router.get("/verify-email/{user_id}")
async def verify_email(user_id: str):
    """Marks the user as verified once email confirmation is clicked."""
    response = supabase.table("users").update({"is_verified": True}).eq("id", user_id).execute()

    if response.data:
        return {"message": "Email verified successfully. You can now log in."}
    else:
        raise HTTPException(status_code=400, detail="User not found or already verified.")


@auth_router.post("/login")
async def login(user: Dict[str, str]):
    """Logs in a user only if their email is verified."""
    
    auth_response = supabase.auth.sign_in_with_password({
        "email": user["email"],
        "password": user["password"]
    })

    if "error" in auth_response and auth_response["error"]:
        raise HTTPException(status_code=400, detail=auth_response["error"]["message"])

    user_id = auth_response["user"]["id"]

    # Check if the user is verified
    user_data = supabase.table("users").select("is_verified").eq("id", user_id).execute()

    if not user_data.data[0]["is_verified"]:
        raise HTTPException(status_code=403, detail="Email not verified. Please check your inbox.")

    return {"message": "Login successful", "session": auth_response["session"]}
