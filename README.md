# Content Gap Analyzer

Find the videos you posted on YouTube but never on Instagram (and vice versa).

Built for my own channels — [Legend Edits on YouTube](https://www.youtube.com/@Legend_editx0) and [@legend_editx on Instagram](https://www.instagram.com/legend_editx) — where hundreds of edits live across two platforms and it's impossible to track by hand which ones were cross-posted.

## How it works

Titles and captions rarely match between platforms, so matching is done on the **content itself**:

- **Video hashing** — perceptual hashes of each video's frames (`videohash`) catch the same edit even after re-encoding or cropping.
- **Audio fingerprinting** — Chromaprint/AcoustID fingerprints (`pyacoustid`) match videos by their soundtrack.
- **Fuzzy text matching** — titles and captions are compared with `thefuzz` as a tiebreaker.

The dashboard then lists every gap: what's missing where, so it can be scheduled.

## Stack

| Part | Tech |
|---|---|
| Backend | Python, FastAPI, YouTube Data API v3, Instagram Graph API, yt-dlp |
| Matching | videohash, pyacoustid (Chromaprint), thefuzz |
| Frontend | Next.js (React) dashboard — stats bar, gap table, filters |

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
npm run dev                    # http://localhost:3000
```

## Configuration

See [`backend/.env.example`](backend/.env.example). You need a YouTube Data API v3 key and an Instagram Graph API access token (`instagram_business_basic` permission).

---

Made by **Fenil Shah** — [portfolio](https://github.com/fenilnig)
