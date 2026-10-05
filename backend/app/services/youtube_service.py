import os
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.schemas.models import YouTubeVideo


class YouTubeService:
    def __init__(self, api_key: str, channel_id: str):
        self.api_key = api_key
        self.channel_id = channel_id
        if self.api_key:
            self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        else:
            self.youtube = None

    async def _resolve_channel_id(self) -> str:
        """Resolve a YouTube handle (e.g. @Legend_editx0) to a UC... channel ID."""
        if self.channel_id.startswith("UC") and len(self.channel_id) == 24:
            return self.channel_id

        # Handle starts with @ — resolve via channels.list(forHandle=...)
        handle = self.channel_id.lstrip("@")
        try:
            response = self.youtube.channels().list(
                part="id",
                forHandle=handle
            ).execute()

            if response.get("items"):
                resolved_id = response["items"][0]["id"]
                print(f"Resolved handle @{handle} → {resolved_id}")
                return resolved_id
        except HttpError:
            pass

        # Fallback: try forUsername
        try:
            response = self.youtube.channels().list(
                part="id",
                forUsername=handle
            ).execute()

            if response.get("items"):
                resolved_id = response["items"][0]["id"]
                print(f"Resolved username {handle} → {resolved_id}")
                return resolved_id
        except HttpError:
            pass

        raise ValueError(
            f"Could not resolve '{self.channel_id}' to a YouTube channel ID. "
            f"Try using the UC... channel ID directly."
        )

    async def fetch_all_uploads(self) -> list[YouTubeVideo]:
        if not self.youtube:
            raise ValueError("YouTube API key is not configured.")

        # Resolve handle to channel ID if needed
        resolved_id = await self._resolve_channel_id()

        videos = []
        try:
            channel_response = self.youtube.channels().list(
                part="contentDetails,snippet",
                id=resolved_id
            ).execute()

            if not channel_response.get("items"):
                raise ValueError(f"Channel {resolved_id} not found.")

            uploads_playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
            channel_title = channel_response["items"][0]["snippet"]["title"]
            print(f"Fetching uploads for channel: {channel_title} ({resolved_id})")

            next_page_token = None
            while True:
                playlist_response = self.youtube.playlistItems().list(
                    part="snippet,contentDetails",
                    playlistId=uploads_playlist_id,
                    maxResults=50,
                    pageToken=next_page_token
                ).execute()

                for item in playlist_response.get("items", []):
                    snippet = item["snippet"]
                    videos.append(YouTubeVideo(
                        video_id=snippet["resourceId"]["videoId"],
                        title=snippet["title"],
                        description=snippet["description"],
                        thumbnail_url=snippet["thumbnails"].get("high", snippet["thumbnails"].get("medium", snippet["thumbnails"].get("default", {}))).get("url", ""),
                        published_at=snippet["publishedAt"]
                    ))

                next_page_token = playlist_response.get("nextPageToken")
                if not next_page_token:
                    break

        except HttpError as e:
            print(f"An HTTP error occurred: {e}")
            raise

        print(f"Total videos fetched: {len(videos)}")
        return videos
