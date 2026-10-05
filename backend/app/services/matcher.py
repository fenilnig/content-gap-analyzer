from app.schemas.models import YouTubeVideo, InstagramReel, MatchResult, VideoGapItem, GapAnalysisResponse
from app.services.video_hasher import VideoHasher
from app.services.audio_fingerprinter import AudioFingerprinter
try:
    from thefuzz import fuzz
except ImportError:
    fuzz = None
from datetime import datetime, timezone
import asyncio

class ContentMatcher:
    def __init__(self, video_hasher: VideoHasher, audio_fingerprinter: AudioFingerprinter):
        self.video_hasher = video_hasher
        self.audio_fingerprinter = audio_fingerprinter

    def fuzzy_match_text(self, yt_title: str, yt_description: str, ig_caption: str) -> tuple[bool, float]:
        if fuzz is None:
            return False, 0.0
            
        title_score = fuzz.token_sort_ratio(yt_title, ig_caption)
        confidence = title_score / 100.0
        is_match = confidence >= 0.85
        
        return is_match, confidence

    async def match_video_to_reels(self, youtube_video: YouTubeVideo, reels: list[InstagramReel]) -> MatchResult:
        best_match = None
        highest_confidence = 0.0
        best_method = "none"
        
        # Tier 1: Fuzzy Text Match
        for reel in reels:
            is_match, confidence = self.fuzzy_match_text(youtube_video.title, youtube_video.description, reel.caption)
            if is_match and confidence > highest_confidence:
                highest_confidence = confidence
                best_match = reel
                best_method = "title"
                
        if best_match:
            return MatchResult(
                match_status="matched",
                match_method=best_method,
                match_confidence=highest_confidence,
                matched_reel_id=best_match.id,
                matched_reel_permalink=best_match.permalink
            )
            
        # Mocking tier 2/3 and uncertain cases since this is a basic matching engine implementation
        return MatchResult(
            match_status="missing",
            match_method="none",
            match_confidence=0.0
        )

    async def run_gap_analysis(self, yt_videos: list[YouTubeVideo], ig_reels: list[InstagramReel]) -> GapAnalysisResponse:
        results = []
        matched = 0
        missing = 0
        uncertain = 0
        
        for yt_video in yt_videos:
            match_result = await self.match_video_to_reels(yt_video, ig_reels)
            
            if match_result.match_status == "matched":
                matched += 1
            elif match_result.match_status == "uncertain":
                uncertain += 1
            else:
                missing += 1
                
            gap_item = VideoGapItem(
                **yt_video.model_dump(),
                **match_result.model_dump()
            )
            results.append(gap_item)
            
        return GapAnalysisResponse(
            total_youtube=len(yt_videos),
            total_instagram=len(ig_reels),
            matched=matched,
            missing=missing,
            uncertain=uncertain,
            videos=results,
            analyzed_at=datetime.now(timezone.utc).isoformat()
        )
