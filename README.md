# The Architecture of Us — 6th Anniversary

A single-page site that mixes **blueprint/architecture** theme (for her), **version-control** metaphors (for you), and interactive bits: time-in-Pune counter, distance countdown, map, sticker wall, and photo gallery.

## Quick start

1. **Edit your story** in `js/config.js`:
   - `siteSurveyYear` — year you met at school
   - `puneMoveDate` — date she moved to Pune (YYYY-MM-DD)
   - `galleryImages` — list of filenames for the Pune gallery

2. **Add photos** in the `photos/` folder:
   - `photos/college.jpg` — your college photo (v1.0 section)
   - `photos/pune/` — e.g. `1.jpg`, `2.jpg`, … (or names you set in `galleryImages`)
   - `photos/stickers/` — optional images for the sticker wall

3. **Open** `index.html` in a browser, or use a local server (e.g. `npx serve .`).

## Deploy on GitHub Pages

1. Create a repo (e.g. `happy-6th-anniversary`).
2. Push this project to the repo.
3. **Settings → Pages → Source:** Deploy from branch `main` (or `master`), folder `/ (root)`.
4. Site will be at `https://<username>.github.io/happy-6th-anniversary/`.

No backend needed — static HTML, CSS, and JS only.

## Tech

- Vanilla HTML/CSS/JS
- [Leaflet](https://leafletjs.com/) for Nagpur → Pune map
- [AOS](https://michalsnik.github.io/aos/) for scroll animations
- Blueprint-style palette and grid
