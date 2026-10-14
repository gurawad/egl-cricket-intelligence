# EGL Cricket Intelligence — Static Web MVP

A static, mobile-responsive prototype based on the validated EGL Cricket Intelligence workbook.

## Included
- Player search and team/role filters
- Team snapshot cards
- Prior-season and provisional ranking views
- Downloadable Instagram portrait cards (1080 × 1350, 4:5)
- Visible disclaimer on the website and every generated card
- Static JSON data; no backend or API keys
- Official EGL logo and MC Financial Services logo included in the header and generated Instagram cards
- Exclusive Partner designation for MC Financial Services

## Run locally
Because the app fetches `data.json`, serve this folder over HTTP rather than opening `index.html` directly:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Deploy to GitHub Pages
1. Unzip the package.
2. Upload `index.html`, `app.js`, `data.json`, and the complete `assets` folder to the repository root (or the configured Pages folder). Do not upload only the HTML/JS files—the logos are stored in `assets`.
3. Commit and push.
4. In GitHub repository settings, enable Pages from the intended branch/folder if not already configured.

## Public-sharing safeguards
- This is for fun and discussion, not an official ranking or match prediction.
- Prior-season EGL stats and CricHeroes career context are not equivalent data sources.
- Do not publish a value without checking the matching workbook row and evidence coverage.
- Review any generated card before posting. The site is a prototype; player photos and individual team logos are not included yet; the official EGL and MC Financial Services brand logos are included.
