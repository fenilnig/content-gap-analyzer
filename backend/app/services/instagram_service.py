import requests
from app.schemas.models import InstagramReel


class InstagramService:
    def __init__(self, access_token: str, user_id: str):
        self.access_token = access_token
        self.user_id = user_id
        self.base_url = "https://graph.instagram.com/v23.0"

    async def _resolve_user_id(self) -> str:
        """If user_id is 'me', resolve to actual numeric IG user ID."""
        if self.user_id and self.user_id != "me":
            return self.user_id

        # Use the /me endpoint to resolve
        try:
            response = requests.get(
                f"{self.base_url}/me",
                params={
                    "fields": "id,username",
                    "access_token": self.access_token
                }
            )
            response.raise_for_status()
            data = response.json()
            resolved_id = data["id"]
            username = data.get("username", "unknown")
            print(f"Resolved Instagram user: @{username} ({resolved_id})")
            return resolved_id
        except requests.RequestException as e:
            print(f"Failed to resolve Instagram user ID: {e}")
            raise

    async def fetch_all_reels(self) -> list[InstagramReel]:
        if not self.access_token:
            raise ValueError("Instagram access token is not configured.")

        resolved_id = await self._resolve_user_id()

        reels = []
        url = f"{self.base_url}/{resolved_id}/media"
        params = {
            "fields": "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp",
            "access_token": self.access_token,
            "limit": 100
        }

        try:
            while url:
                response = requests.get(url, params=params if params else None)
                response.raise_for_status()
                data = response.json()

                for item in data.get("data", []):
                    # Check for Reels specifically using media_product_type
                    is_reel = (
                        item.get("media_product_type") == "REELS" or
                        item.get("media_type") == "VIDEO" or
                        "/reel/" in item.get("permalink", "")
                    )
                    if is_reel:
                        reels.append(InstagramReel(
                            id=item["id"],
                            caption=item.get("caption", ""),
                            media_url=item.get("media_url"),
                            thumbnail_url=item.get("thumbnail_url"),
                            permalink=item.get("permalink", ""),
                            timestamp=item.get("timestamp", "")
                        ))

                # Follow pagination cursor
                url = data.get("paging", {}).get("next")
                params = None  # Pagination URL includes params

        except requests.RequestException as e:
            print(f"Instagram API error: {e}")
            raise

        print(f"Total Instagram Reels fetched: {len(reels)}")
        return reels
