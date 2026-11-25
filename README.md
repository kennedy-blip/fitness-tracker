# FitTrack

FitTrack is a static fitness dashboard built with Python 3.11 and Jinja2. It shows sample daily stats, weekly goals, step and calorie charts, heart-rate zones, and workout history. No backend, accounts, or browser JavaScript are required.

## Build and preview

With Python 3.11 (including `venv`) and Node 22:

```sh
npm ci && ./node_modules/.bin/vite build
npm run preview
```

The command runs the Python tests and generates the site before Vite publishes it to `dist/`. Vite is retained only to support Render's existing build command. For a Python-only build, see [the static-site instructions](static-site/README.md).

## Production

[FitTrack on Render](https://fitness-tracker-u2xt.onrender.com/) is a Static Site tracking `main`; the root is unset, the publish directory is `dist`, and auto-deploy is On Commit. Do not remove Vite unless the Render build command is intentionally changed.

Verify the deployed pages and public assets with:

```sh
python3 static-site/smoke.py https://fitness-tracker-u2xt.onrender.com
```

The migration landed in [PR #1](https://github.com/kennedy-blip/fitness-tracker/pull/1) (`93285ed`). The old app remains retrievable at `2d30ead`, the pre-migration rollback revision. See [deployment and rollback](static-site/README.md#render-deployment-and-rollback).
