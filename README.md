# EGL Cricket Intelligence 2.1 — Website package

This package is a first implementation pass based on the supplied website ZIP.

## Included
- `index.html` — GitHub Pages entry point (renamed from the supplied `index-2.html`)
- `app.js` — existing website logic plus searchable player/team comparison selectors and a Career Centre
- `data.json` — original validated website dataset plus a `Photo_Path` field for each of the 96 players
- `assets/` — EGL and MC Financial Services logos plus 96 optimized WebP player photos

## What changed
- Added player photos to player tiles and player data modals.
- Added searchable filters for each side of the head-to-head comparison, so users do not have to scroll through 96 players.
- Added a Career Centre with sortable career-wide leaderboards for runs, wickets, matches, batting strike rate, bowling economy and wickets per match.
- Kept career-wide figures separate from prior-season EGL figures.
- Preserved the existing fun/discussion disclaimer and missing-value handling.
- Corrected asset folder casing by packaging all live website assets under lowercase `assets/`, matching the existing code references.

## Deployment
1. Keep a backup of the current live repository.
2. Upload the contents of this folder to the same GitHub Pages source directory, replacing `index.html`, `app.js`, and `data.json`, and adding the `assets/PlayerPhotos/` folder.
3. Commit the changes and wait for GitHub Pages to redeploy.
4. Test player search, player/team comparison, career leaderboard filters, player photos, team views, and PNG generation on desktop and mobile.

**Important:** `auction.db` is deliberately not included in this deployment package. Do not publish the database or other source-only files to a public GitHub repository unless you have reviewed their contents and confirmed that they are safe to publish.

## Data audit note
The supplied `data.json` contains 96 players and 8 teams. All 96 players were mapped to distinct image files using player names and checked photo-name variants. The source photo folder contained 98 files; 96 were matched to the current website players, and two unmatched files were excluded from the deployment package. Photos were resized/optimized for faster page loading, and three HEIC files mislabeled with `.jpg` extensions were converted to WebP. The auction database was not merged into the public website data during this pass; the existing validated website dataset remains the source of truth until any cross-source identity differences are manually reconciled.
