# Content Gap Analyzer

Find the YouTube videos you never cross-posted to Instagram.

Built for my own channels — [Legend Edits on YouTube](https://www.youtube.com/@Legend_editx0) and [@legend_editx on Instagram](https://www.instagram.com/legend_editx) — where hundreds of edits live across two platforms and it's impossible to track by hand which ones made it to both.

## How it works

1. **Pulls every upload** from your YouTube channel (YouTube Data API v3) and every reel from your Instagram account (Instagram Graph API).
2. **Matches each YouTube video against your reels** using fuzzy text matching (`thefuzz` token-sort ratio, ≥ 85% confidence) on titles vs. captions.
3. **Shows the gaps** in a dashboard — every video marked *matched* or *missing*, with match confidence, stats, and filters — so you know exactly what still needs to be posted.

### In progress: content-based matching

Titles and captions often differ between platforms, so the next matching tiers compare the **content itself**. The building blocks are implemented in `backend/app/services/` but not yet wired into the matcher:

- **Video hashing** (`video_hasher.py`) — perceptual hashes of video frames with `videohash`, to catch the same edit after re-encoding or cropping.
- **Audio fingerprinting** (`audio_fingerprinter.py`) — Chromaprint/AcoustID fingerprints with `pyacoustid`, to match videos by their soundtrack.

## Stack

| Part | Tech |
|---|---|
| Backend | Python, FastAPI, YouTube Data API v3, Instagram Graph API |
| Matching | thefuzz (live); videohash, pyacoustid (in progress) |
| Frontend | Next.js (React) dashboard — stats bar, gap table, status filters |

## Running it

**Backend**

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # then add your API keys
uvicorn app.main:app --reload --port 8000
```

`DEMO_MODE=true` (the default) runs with sample data, no API keys needed.

**Frontend**

```bash
cd frontend
npm install
npm run dev                    # http://localhost:3000 (talks to the backend on :8000)
```

## Configuration

See [`backend/.env.example`](backend/.env.example). You need a YouTube Data API v3 key and an Instagram Graph API access token (`instagram_business_basic` permission).

---

Made by **Fenil Shah** — [GitHub](https://github.com/fenilnig)
