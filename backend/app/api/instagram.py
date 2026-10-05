from fastapi import APIRouter
from app.schemas.models import InstagramReel
from app.config import settings
from app.services.instagram_service import InstagramService
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/api/instagram", tags=["instagram"])

@router.get("/reels", response_model=list[InstagramReel])
async def get_instagram_reels():
    if settings.DEMO_MODE:
        now = datetime.now(timezone.utc)
        captions = [
            "Neural networks explained simply 🧠 #python", 
            "A day in the life of a dev 💻 #coding", 
            "React vs Vue vs Angular! Which one? 🤔", 
            "Built a SaaS in 30 days! Here is how", 
            "My awesome desk setup for 2024 🔥", 
            "Why I use Vim mostly #developer", 
            "Learning Rust is wild 🦀", 
            "Just another aesthetic coding night ✨", 
            "Don't forget to touch grass 🌿", 
            "Quick tip for CSS centering", 
            "A fast trick to master docker containers", 
            "Is Web3 still a thing? 🌐"
        ]
        
        reels = []
        for i, caption in enumerate(captions):
            timestamp = (now - timedelta(days=i*3)).isoformat()
            reels.append(InstagramReel(
                id=f"ig_mock_{i}",
                caption=caption,
                media_url=f"https://picsum.photos/seed/ig{i}/720/1280",
                thumbnail_url=f"https://picsum.photos/seed/igt{i}/720/1280",
                permalink=f"https://instagram.com/reel/mock{i}/",
                timestamp=timestamp
            ))
        return reels
        
    service = InstagramService(settings.INSTAGRAM_ACCESS_TOKEN, settings.INSTAGRAM_USER_ID)
    return await service.fetch_all_reels()
