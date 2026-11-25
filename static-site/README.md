# FitTrack static migration

This is an independent candidate, not the production build. Python 3.11 was available (3.11.2), Node was available (22.22.3), and Ruby was not installed. Jinja2 renders HTML from `site.json` and `data/fitness.json`; handwritten CSS preserves the responsive dashboard. Only `dist/` gets published. No Node, Ruby, backend, credentials, or browser JavaScript are required by this build.

## Local build

From the repository root:

```sh
cd static-site
python3.11 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
python -m unittest discover -s tests -v
python build.py
python -m http.server 8000 --directory dist
```

`build.py` regenerates `dist/` with `index.html`, `assets/site.css`, `assets/favicon.svg`, and `data/fitness.json`. The JSON is public sample data exported from `src/App.tsx`; don't add personal data or secrets. The date and weekly numbers remain sample values, not live readings or aggregates recomputed from the displayed series.

## Baseline recorded before migration

- Supplied production URL: https://fitness-tracker-u2xt.onrender.com. The sandbox could not establish a TLS connection; live behavior and the actual Render service ID, deployed revision, service type, runtime, root, build command and publish directory are **unverified**. There is no Render configuration in the checkout that establishes those settings.
- Repository entry: `index.html` loads `src/main.tsx`, which mounts `App` from `src/App.tsx` and imports `src/index.css`. Local commands: `npm ci`, `npm run dev`, `npm run build`, `npm run preview`. The production-style local build is `npm run build` and emits Vite's single-file `dist/index.html`; preview is not a confirmed Render start command. The checked-in `node_modules` had a non-executable Vite shim, so the baseline was built successfully with `npm ci` in a disposable copy.
- Actual package stack: React/React DOM 19, Vite 7, TypeScript 5.9, Tailwind 4, PostCSS/autoprefixer, React and single-file Vite plugins, `clsx` and `tailwind-merge`. No declared test script or first-party test suite; no Recharts dependency despite the legacy README. The charts use styled HTML. The baseline has static stats, color-coded chart bars, progress, zones, workout hover feedback and a sticky responsive header; no implemented chart tooltip, editing, API, or persistence.
- Local verification: both builds passed. Headless Chromium compared rendered text (normalizing whitespace near units), headings and section positions at viewport widths of 390, 768 and 1440 px, checked for horizontal overflow, and verified workout hover feedback. This is repository-baseline evidence, not a live-production comparison or a pixel-perfect guarantee.

## Render staging and cutover gate

1. In Render, locate the **existing service by its exact production URL**. Record its service ID/type, repository, branch, deployed commit, known-good deploy ID, runtime/version, root, build and publish or start commands, and relevant environment variable names (not values). Independently capture the live desktop/mobile dashboard before proceeding.
2. Create a **new Static Site**, e.g. `fitness-tracker-static-staging`. Select this repository and the assigned feature branch (`arena/be790835-fitness-tracker`) after the branch is published. Do not use the existing service or attach a production domain. Proposed staging settings (verify in the dashboard and build logs):

   | Setting | Value |
   | --- | --- |
   | Service type | Static Site (no Python process after build) |
   | Root directory | `static-site` |
   | Build-time Python | `3.11.2` (`.python-version`; set staging `PYTHON_VERSION` if needed) |
   | Build command | `python3 --version && python3 -m pip install -r requirements.txt && python3 -m unittest discover -s tests -v && python3 build.py` |
   | Publish directory | `dist` (relative to the configured root) |
   | Auto-deploy | Off initially |

3. Verify the actual Python version, build command and published directory in staging. Record the staging URL, deploy ID and commit. Confirm HTTP 200 for `/`, `/assets/site.css`, `/assets/favicon.svg` and `/data/fitness.json`; compare staging against live at mobile and desktop sizes for layout, chart values, zones, hover and sticky header. Document and resolve discrepancies before approval. Staging has not been provisioned or verified in this session.
4. **Stop before cutover** until live parity and staging evidence are recorded and the owner approves. At cutover, retain the known-good deploy and old settings. Verify the same URLs and behaviors on production immediately; on failure restore the previous known-good deployment **and** any settings or routing changed during the cutover, then recheck the live URL.
5. Only after production is proven, remove legacy source and build tooling in a separate change, update the root documentation, then check GitHub's language breakdown after it refreshes (`gh api repos/kennedy-blip/fitness-tracker/languages`). No cleanup or language classification changes are part of this candidate.
