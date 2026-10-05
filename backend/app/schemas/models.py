from typing import Literal, Optional, List
from pydantic import BaseModel

class YouTubeVideo(BaseModel):
    video_id: str
    title: str
    description: str
    thumbnail_url: str
    published_at: str
    duration: Optional[str] = None

class InstagramReel(BaseModel):
    id: str
    caption: str
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    permalink: str
    timestamp: str

class MatchResult(BaseModel):
    match_status: Literal['missing', 'matched', 'uncertain']
    match_method: Literal['title', 'hash', 'audio', 'none']
    match_confidence: float
    matched_reel_id: Optional[str] = None
    matched_reel_permalink: Optional[str] = None

class VideoGapItem(YouTubeVideo, MatchResult):
    pass

class GapAnalysisResponse(BaseModel):
    total_youtube: int
    total_instagram: int
    matched: int
    missing: int
    uncertain: int
    videos: List[VideoGapItem]
    analyzed_at: str
