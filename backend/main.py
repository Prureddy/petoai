# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from chatbot import app as chatbot_app
# from dietPlanner import app as dietplanner_app
# import uvicorn

# # Create main FastAPI instance
# main_app = FastAPI()

# # Configure CORS with all possible frontend development ports
# origins = [
#     "http://localhost:5173",  # Vite default
#     "http://localhost:3000",  # Common React port
#     "http://127.0.0.1:5173",
#     "http://127.0.0.1:3000",
# ]

# main_app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Mount different backend modules under relevant paths
# main_app.mount("/chatapi", chatbot_app)
# main_app.mount("/diseaseapi", chatbot_app)
# main_app.mount("/dietplanner", dietplanner_app)

# if __name__ == "__main__":
#     uvicorn.run(main_app, host="0.0.0.0", port=8000)



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chatbot import app as chatbot_app
from dietPlanner import app as dietplanner_app
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A simple root endpoint that responds with a welcome message
@app.get("/")
async def root():
    return {"message": "Welcome to the backend API"}

@app.get("/signin")
async def get_signin():
    return {"message": "Sign In Page - Render your sign-in UI here"}

@app.get("/signup")
async def get_signup():
    return {"message": "Sign Up Page - Render your sign-up UI here"}

# Mount your other backend modules
app.mount("/chatapi", chatbot_app)
app.mount("/diseaseapi", chatbot_app)
app.mount("/dietplanner", dietplanner_app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
