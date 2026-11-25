# FitTrack static migration

This directory is independently buildable; the root Vite bridge publishes it for Render. Python 3.11 was available (3.11.2), Node was available (22.22.3), and Ruby was not installed. Jinja2 renders HTML from `site.json` and `data/fitness.json`; handwritten CSS preserves the responsive dashboard. Only `dist/` gets published. No Node, Ruby, backend, credentials, or browser JavaScript are required by this build.

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

## Render deployment and rollback

Production is the Render Static Site `fitness-tracker` (`srv-d616kl0nputs73ahkda0`), tracking `main`. Before cutover the owner reported live revision `2d30ead`, an unset root directory, build command `npm ci && ./node_modules/.bin/vite build`, publish directory `dist`, auto-deploy **On Commit**, and PR previews off. No settings change is needed for the authorized GitHub-driven cutover.

The root `.python-version` pins Python 3.11.2. Vite's build config invokes the Python 3.11 generator in an isolated virtual environment, bundles the generated HTML and CSS, then copies the public JSON to root `dist/`. Render's build environment must expose `python3.11` with `venv` and PyPI access; a clean local exact-command run is not proof of that remote environment. `npm run dev` builds and previews the replacement; the legacy reference remains in Git at `2d30ead`.

After auto-deploy, check the deploy revision and Events log, run `python3 static-site/smoke.py https://fitness-tracker-u2xt.onrender.com` from a network that can reach Render, and visually check dashboard content, responsive layout, sticky header, and workout hover. The smoke test distinguishes pre-rendered replacement HTML from the old SPA or an HTML fallback. The FitTrack app has no county, crop, or year selectors.

If the deploy fails or checks do not pass, preserve the old source and collect the non-secret build/deploy log. The pre-transition Render deploy at `2d30ead` is the rollback target: record its deploy ID from Events and use Render rollback if a bad build went live. Ensure the bad revision cannot redeploy until fixed; reconcile `main` by reverting the cutover through GitHub if needed. Only remove old source after live verification. Node/Vite remain required until Render's command is changed; check GitHub's language breakdown after cleanup with `gh api repos/kennedy-blip/fitness-tracker/languages`.
