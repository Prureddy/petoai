from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import chromadb
import google.generativeai as genai
from typing import List
import re
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from visionModel import analyze_image

app = FastAPI()

# Load ChromaDB
db_path = "chroma_rag_data"
db_name = "pet_chunks"

def load_chroma_db(path: str, name: str, dimension: int = 768):
    chroma_client = chromadb.PersistentClient(path=path)
    try:
        collection = chroma_client.get_collection(name=name)
    except chromadb.errors.InvalidCollectionException:
        collection = chroma_client.create_collection(name=name, dimension=dimension)
    return collection

db = load_chroma_db(db_path, db_name)

# Initialize embedding function
embedding_function = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=" "
)

# Update QueryRequest to include language
class QueryRequest(BaseModel):
    query: str
    language: str  # e.g., "English", "Kannada", etc.

# Function to retrieve relevant passages using embeddings
def get_relevant_passage(query: str, db, embedding_function, n_results: int = 5):
    query_embedding = embedding_function.embed_query(query)
    results = db.query(query_embeddings=[query_embedding], n_results=n_results)
    return [passage for doc in results["documents"] for passage in doc]

def refine_query(query: str) -> str:
    refine_prompt = (
        f"You are an expert in query understanding. Your task is to refine the given user query to make it clearer, "
        f"without changing its meaning. Keep it concise, more specific, and well-structured for better information retrieval.\n\n"
        f"If there are any grammar mistakes, correct them.\n\n"
        f"If the user is asking a question but has not included a question mark, convert it into a proper question.\n\n"
        f"### User Query:\n{query}\n\n"
        f"### Refined Query:"
    )

    genai.configure(api_key="")
    model = genai.GenerativeModel("gemini-1.5-flash")
    result = model.generate_content(refine_prompt, generation_config={"temperature": 0.3})
    return result.text.strip()

def clean_text(text):
    text = text.replace("'", "").replace('"', "").replace("\n", " ")
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Updated make_rag_prompt to include language parameter
def make_rag_prompt(query: str, relevant_passages: List[str], language: str) -> str:
    cleaned_passages = " ".join([clean_text(passage) for passage in relevant_passages])
    
    prompt = (
        f"You are a professional, knowledgeable, and friendly Petcare Virtual Assistant. "
        f"Your goal is to help pet owners with reliable and practical advice on pet health, symptoms, cures, nutrition, grooming, and behavior. "
        f"Your responses should be detailed, well-structured, and easy to understand. Provide examples when needed.\n\n"

        f"### Instructions:\n"
        f"1. If the user greets (e.g., 'hi', 'hello', 'hey'), respond politely with a warm greeting.\n"
        f"2. If the user asks about pet care, provide thorough and structured advice. Avoid short answers.\n"
        f"3. Use the given context (if available) to answer the query. If the context is insufficient, rely on your own knowledge.\n"
        f"4. Always provide additional useful advice to enhance the user's understanding.\n"
        f"5. Keep responses professional yet friendly, making pet owners feel comfortable and confident.\n\n"
        f"6. IMPORTANT: Answer ONLY in {language}. Do not include any words in any other language.\n\n"
        f"### User Query:\n{query}\n\n"
        f"### Relevant Context (if available):\n{cleaned_passages}\n\n"
        f"### Your Response:"
    )
    return prompt


def generate_answer(prompt: str) -> str:
    genai.configure(api_key="")
    model = genai.GenerativeModel("gemini-1.5-flash")
    result = model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.3, 
            "max_output_tokens": 1024 
        }
    )
    return result.text

@app.post("/generate_answer")
def generate_response(request: QueryRequest):
    query = request.query
    language = request.language  # Capture the language selected in the frontend
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    refined_query = refine_query(query)
    relevant_passages = get_relevant_passage(refined_query, db, embedding_function)
    
    if not relevant_passages:
        return {"message": "No relevant passages found.", "response": "I'm sorry, but I couldn't find relevant information."}
    
    # Pass language to the prompt template
    prompt = make_rag_prompt(refined_query, relevant_passages, language)
    answer = generate_answer(prompt)
    
    return {"refined_query": refined_query, "response": answer}

@app.post("/analyze-image/")
async def analyze_image_route(file: UploadFile = File(...)):
    """
    Endpoint to analyze an uploaded image for medical conditions.
    """
    try:
        if file.content_type not in ["image/png", "image/jpg", "image/jpeg"]:
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PNG, JPG, or JPEG image.")

        image_data = await file.read()
        analysis_result = analyze_image(image_data, file.content_type)
        return JSONResponse(content={
            "status": "success",
            "analysis": analysis_result
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
