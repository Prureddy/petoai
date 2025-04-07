import os
import json
import requests
import logging
from dotenv import load_dotenv
from typing import Dict, List, Optional
from enum import Enum
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
import chromadb
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize FastAPI app
app = FastAPI(title="Pet Diet Planner API", description="API for generating personalized pet diet plans")

# Initialize embedding function
embedding_function = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key="AIzaSyA4aXPGSDYVBXuH2jiTAAYA7dxHLsl8ksA"
)

class OpenPetFoodAPI:
    def __init__(self):
        self.base_url = "https://world.openpetfoodfacts.org/api/v0"

    def search_pet_food(self, pet_info: Dict) -> List[Dict]:
        """Search for pet food products based on given criteria."""
        try:
            # Convert health conditions to dietary restrictions
            restrictions = []
            for condition in pet_info.get('healthConditions', []):
                if condition == 'Diabetes':
                    restrictions.append('low_glycemic')
                elif condition == 'Heart Disease':
                    restrictions.append('low_sodium')
                elif condition == 'Kidney Disease':
                    restrictions.append('low_protein')
                elif condition == 'Food Allergies':
                    restrictions.extend(pet_info.get('allergens', []))

            params = {
                "categories_tags": "pet_food",
                "page_size": 5,
                "json": 1,
                "exclude_tags": restrictions
            }
            
            response = requests.get(f"{self.base_url}/search", params=params)
            response.raise_for_status()
            data = response.json()

            products = []
            for product in data.get("products", []):
                if any(food_type.lower() in product.get("product_name", "").lower() 
                      for food_type in pet_info.get('foodTypes', [])):
                    products.append({
                        "name": product.get("product_name", "Unknown"),
                        "brands": product.get("brands", "Unknown"),
                        "nutrition_grades": product.get("nutrition_grades", "N/A"),
                        "ingredients": product.get("ingredients_text", "Not Available"),
                        "nutrients": product.get("nutriments", {})
                    })
            
            return products
        except Exception as e:
            logging.error(f"OpenPetFoodAPI search failed: {str(e)}")
            return []

class PetDietPlanner:
    def __init__(self):
        self.gemini_api_key = "AIzaSyA4aXPGSDYVBXuH2jiTAAYA7dxHLsl8ksA"
        if not self.gemini_api_key:
            logging.error("GEMINI_API_KEY is missing.")
            raise ValueError("GEMINI_API_KEY is not set")

        self.gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        self.collection_name = "pet_chunks"
        self.pet_food_api = OpenPetFoodAPI()

        try:
            self.chroma_client = chromadb.PersistentClient(path="./chroma_rag_data")
            try:
                self.collection = self.chroma_client.get_collection(name=self.collection_name)
            except ValueError:
                self.collection = self.chroma_client.create_collection(
                    name=self.collection_name,
                    metadata={"hnsw:space": "cosine"}
                )
            logging.info("✅ Successfully initialized PetDietPlanner")
        except Exception as e:
            logging.error(f"Failed to initialize: {str(e)}")
            raise

    def calculate_daily_calories(self, weight: float, activity_level: str) -> float:
        """Calculate daily caloric needs based on weight and activity level."""
        rer = 70 * (float(weight) ** 0.75)
        activity_factors = {
            "Low": 1.2,
            "Medium": 1.4,
            "High": 1.6
        }
        return rer * activity_factors.get(activity_level, 1.4)

    # ... (previous imports and initial setup remain the same until the generate_gemini_prompt method)

    def generate_gemini_prompt(self, pet_info: Dict, food_recommendations: List[Dict], daily_calories: float) -> str:
        """Generate a detailed prompt for Gemini API."""
        # Break down the prompt into smaller parts
        pet_profile = f"""
        Pet Profile:
        - Name: {pet_info['name']}
        - Age: {pet_info['age']}
        - Breed: {pet_info['breed']}
        - Weight: {pet_info['weight']} kg
        - Activity Level: {pet_info['activityLevel']}"""

        health_conditions = f"""
        Health Conditions: {', '.join(pet_info.get('healthConditions', ['None']))}"""

        dietary_prefs = f"""
        Dietary Preferences:
        - Preferred Food Types: {', '.join(pet_info.get('foodTypes', []))}
        - Allergens to Avoid: {', '.join(pet_info.get('allergens', []))}
        - Additional Restrictions: {pet_info.get('customRestrictions', 'None')}"""

        caloric_needs = f"""
        Calculated Daily Caloric Needs: {daily_calories:.2f} calories"""

        # Format food recommendations separately
        food_recs = "\n".join([
            f"- **Name**: {food['name']}, **Brand**: {food['brands']}, **Nutrition**: {food['nutrition_grades']}"
            for food in food_recommendations[:3]
        ])

        commercial_foods = f"""
        Available Commercial Foods:
        {food_recs}"""

        health_context = """
        Health Conditions and Dietary Considerations:
        - Diabetes: Requires consistent meal timing and low-glycemic foods
        - Heart Disease: Needs low-sodium diet with monitored fluid intake
        - Kidney Disease: Requires low-protein, high-quality protein sources
        - Joint Issues: Benefits from omega-3 supplementation
        - Food Allergies: Must avoid specific allergens"""

        response_format = response_format = """
    The response should be in markdown format. 
    - Use headings (`##` for sections)
    - Use bold (`**bold text**`) for important words
    - Use bullet points (`- item`) where necessary
    - **Do not use JSON format or structured data.**
"""


        instructions = """
        Please provide a comprehensive diet plan that includes:
        1. Detailed daily meal schedule (breakfast, lunch, dinner) with specific portions and timing
        2. Precise nutrient breakdown (protein, fat, carbs percentages)
        3. Specific food recommendations and portions from the available commercial foods
        4. Supplement recommendations if needed
        5. Special feeding instructions based on health conditions
        6. Tips for maintaining proper hydration
        7. Guidance for treats and snacks
        8. Weekly meal rotation suggestions
        9. Signs to monitor for diet effectiveness
        10. Instructions for transitioning to the new diet
            """

        # Combine all parts
        prompt = "\n".join([
            "Generate a detailed and comprehensive diet plan for a pet with the following information:",
            pet_profile,
            health_conditions,
            dietary_prefs,
            caloric_needs,
            commercial_foods,
            health_context,
            instructions,
            response_format
        ])

        return prompt

   
    def generate_diet_plan(self, pet_info: Dict, food_recommendations: List[Dict]) -> Dict:
        """Generate a comprehensive diet plan using Gemini."""
        try:
            # Calculate daily caloric needs
            daily_calories = self.calculate_daily_calories(
                weight=float(pet_info['weight']), 
                activity_level=pet_info['activityLevel']
            )

            # Generate the prompt for Gemini
            prompt = self.generate_gemini_prompt(pet_info, food_recommendations, daily_calories)

            # Call Gemini API with modified parameters
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.3,  # Reduced temperature for more consistent output
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 2048,
                }
            }

            response = requests.post(
                f"{self.gemini_url}?key={self.gemini_api_key}",
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            
            # Extract and parse the response
            result = response.json()
            response_text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            #print(response_text)
            
            if not response_text:
                raise HTTPException(status_code=500, detail="Empty response from Gemini")

            # Log the raw response for debugging
            #logging.info(f"Raw Gemini response: {response_text[:500]}...")  # Log first 500 chars

            # Parse and validate the response
            # diet_plan = self.parse_gemini_response(response_text)
            
            
            
            return response_text

        except Exception as e:
            logging.error(f"Failed to generate diet plan: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate diet plan: {str(e)}")

# Pydantic models for request validation
class DietaryPreferences(BaseModel):
    foodTypes: List[str]
    allergens: List[str]
    customRestrictions: str
    
# Add stricter input validation
class ActivityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class PetProfile(BaseModel):
    name: str
    age: str
    breed: str
    weight: str
    activityLevel: ActivityLevel
    healthConditions: List[str]

    @validator('weight')
    def validate_weight(cls, v):
        try:
            float(v)
            return v
        except ValueError:
            raise ValueError('Weight must be a valid number')
# Add error handling middleware
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": str(exc.detail)
        }
    )

class DietPlanRequest(BaseModel):
    petProfile: PetProfile
    dietaryPreferences: DietaryPreferences

# Initialize the PetDietPlanner
planner = PetDietPlanner()

@app.post("/generate-diet-plan")
async def generate_diet_plan(request: DietPlanRequest):
    """Generate a personalized diet plan based on frontend data."""
    try:
        # Combine pet profile and dietary preferences
        pet_info = {
            **request.petProfile.dict(),
            **request.dietaryPreferences.dict()
        }
        
        # Get food recommendations
        food_recommendations = planner.pet_food_api.search_pet_food(pet_info)
        
        # Generate the diet plan using Gemini
        diet_plan = planner.generate_diet_plan(pet_info, food_recommendations)
        
        return {
            "status": "success",
            "data": diet_plan
        }
    except Exception as e:
        logging.error(f"Error generating diet plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))