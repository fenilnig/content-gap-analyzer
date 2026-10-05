import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import youtube, instagram, analysis

app = FastAPI(title="Content Gap Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(youtube.router)
app.include_router(instagram.router)
app.include_router(analysis.router)

@app.on_event("startup")
async def startup_event():
    os.makedirs(settings.TEMP_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Content Gap Analyzer API is running.", "demo_mode": settings.DEMO_MODE}
