from fastapi import APIRouter
from app.schemas.models import YouTubeVideo
from app.config import settings
from app.services.youtube_service import YouTubeService
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/api/youtube", tags=["youtube"])

@router.get("/videos", response_model=list[YouTubeVideo])
async def get_youtube_videos():
    if settings.DEMO_MODE:
        now = datetime.now(timezone.utc)
        titles = [
            "Building a Neural Network from Scratch in Python",
            "Day in My Life as a Software Developer",
            "React vs Vue vs Angular - 2024 Comparison",
            "How I Built a SaaS in 30 Days",
            "10 Python Tips You Should Know",
            "My Desk Setup 2024",
            "Why I Switched from Mac to Windows",
            "Mastering Docker in 10 Minutes",
            "Vim vs VSCode",
            "Deploying a FastAPI App to AWS",
            "Understanding Asyncio in Python",
            "Top 5 Programming Languages to Learn",
            "Building a Discord Bot with Python",
            "What is Web3?",
            "Machine Learning for Beginners",
            "The History of Linux",
            "Learning Rust as a Python Developer",
            "How to Ace Your Coding Interview",
            "Creating a Beautiful Portfolio Website",
            "Why Open Source Matters"
        ]
        
        videos = []
        for i, title in enumerate(titles):
            pub_date = (now - timedelta(days=i*2)).isoformat()
            videos.append(YouTubeVideo(
                video_id=f"yt_mock_{i}",
                title=title,
                description=f"This is a mock description for {title}.",
                thumbnail_url=f"https://picsum.photos/seed/yt{i}/640/360",
                published_at=pub_date,
                duration="10:00"
            ))
        return videos
        
    service = YouTubeService(settings.YOUTUBE_API_KEY, settings.YOUTUBE_CHANNEL_ID)
    return await service.fetch_all_uploads()
