from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user, auth  # Import both user and auth routers

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Career Backend!"}

# Include user routes
app.include_router(user.router, prefix="/user", tags=["User"])  

# Include authentication routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])  