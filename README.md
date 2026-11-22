# 🎁 Sanaullah's birthday site

A one-page, mobile-first birthday gift built with React, Vite, TypeScript, Tailwind, Framer Motion and canvas-confetti.

## Edit the content
Everything personal (names, date, timeline, gallery captions, reasons, quiz, messages, letter) lives in
**`src/data/content.ts`**. Search for `✏️ PLACEHOLDER` to find what still needs the real thing.

- **Photos:** put files in `public/photos/` and set e.g. `photo: 'photos/trip.jpg'`. Keep them under ~300 KB each (1200px wide JPG is plenty).
- **Music:** put an mp3 in `public/music/` and set `music: 'music/song.mp3'`. It only plays when tapped.
- **Video:** set `finale.youtubeId` to a YouTube video id.

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:5173/?preview=1` to skip the countdown.

## Deploy
Every push to `main` builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`.
In the repo go to **Settings → Pages → Source: GitHub Actions** if it isn't on already.
