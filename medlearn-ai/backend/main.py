from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

from api.routes import router
from database.db import init_db

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print(" Starting MedLearn AI API...")
    await init_db()
    os.makedirs("static/audio", exist_ok=True)
    os.makedirs("data", exist_ok=True)
    print(" Database initialized")
    print(" Static folders ready")
    yield
    # Shutdown
    print(" Shutting down...")

# Create FastAPI app
app = FastAPI(
    title="MedLearn AI API",
    description="Adaptive Medical Learning Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": " MedLearn AI API is running!",
        "status": "healthy",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check for deployment"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    print(" Starting MedLearn AI Backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
