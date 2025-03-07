from fastapi import FastAPI
from app.routes import user  # Import the user router

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Career Backend!"}

# Include the router
app.include_router(user.router)

