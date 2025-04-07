@auth_router.post("/petprofilesetup")
async def store_pet_profile(profile_data: Dict):
    """Stores pet profile data for the authenticated user."""
    
    user_id = profile_data["user_id"]  # Get user_id from frontend

    response = supabase.table("pet_profiles").insert({
        "user_id": user_id,
        "photo": profile_data["photo"],
        "name": profile_data["name"],
        "species": profile_data["species"],
        "breed": profile_data["breed"],
        "age": profile_data["age"],
        "age_unit": profile_data["ageUnit"],
        "weight": profile_data["weight"],
        "weight_unit": profile_data["weightUnit"],
        "activity_level": profile_data["activityLevel"],
        "health_conditions": profile_data["healthConditions"],
        "dietary_preferences": profile_data["dietaryPreferences"],
        "notes": profile_data["notes"]
    }).execute()

    return {"message": "Pet profile saved successfully."}
