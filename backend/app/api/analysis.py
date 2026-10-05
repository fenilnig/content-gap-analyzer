from fastapi import APIRouter
from app.schemas.models import GapAnalysisResponse, VideoGapItem
from app.config import settings
from app.api.youtube import get_youtube_videos
from app.api.instagram import get_instagram_reels
from app.services.video_hasher import VideoHasher
from app.services.audio_fingerprinter import AudioFingerprinter
from app.services.matcher import ContentMatcher
from datetime import datetime, timezone

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.get("/gap", response_model=GapAnalysisResponse)
async def get_gap_analysis():
    if settings.DEMO_MODE:
        yt_videos = await get_youtube_videos()
        ig_reels = await get_instagram_reels()
        
        matched_indices = [0, 1, 2, 3, 5, 7, 8, 13]
        uncertain_indices = [16, 17] 
        
        videos_result = []
        
        for i, yt in enumerate(yt_videos):
            if i in matched_indices:
                reel = ig_reels[matched_indices.index(i) % len(ig_reels)]
                method = 'title' if i % 2 == 0 else 'hash'
                videos_result.append(VideoGapItem(
                    **yt.model_dump(),
                    match_status='matched',
                    match_method=method,
                    match_confidence=0.95,
                    matched_reel_id=reel.id,
                    matched_reel_permalink=reel.permalink
                ))
            elif i in uncertain_indices:
                videos_result.append(VideoGapItem(
                    **yt.model_dump(),
                    match_status='uncertain',
                    match_method='audio',
                    match_confidence=0.72,
                    matched_reel_id=None,
                    matched_reel_permalink=None
                ))
            else:
                videos_result.append(VideoGapItem(
                    **yt.model_dump(),
                    match_status='missing',
                    match_method='none',
                    match_confidence=0.0,
                    matched_reel_id=None,
                    matched_reel_permalink=None
                ))
                
        return GapAnalysisResponse(
            total_youtube=len(yt_videos),
            total_instagram=len(ig_reels),
            matched=8,
            missing=10,
            uncertain=2,
            videos=videos_result,
            analyzed_at=datetime.now(timezone.utc).isoformat()
        )
        
    yt_videos = await get_youtube_videos()
    ig_reels = await get_instagram_reels()
    
    matcher = ContentMatcher(VideoHasher(), AudioFingerprinter())
    return await matcher.run_gap_analysis(yt_videos, ig_reels)
