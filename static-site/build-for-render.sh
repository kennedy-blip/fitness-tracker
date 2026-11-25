#!/usr/bin/env bash
set -euo pipefail

python_bin=${FITTRACK_PYTHON:-python3.11}
"$python_bin" -c 'import sys; assert sys.version_info[:2] == (3, 11), sys.version; print(sys.version)'
venv=$(mktemp -d)
trap 'rm -rf "$venv"' EXIT
"$python_bin" -m venv "$venv"
"$venv/bin/python" -m pip install --disable-pip-version-check -r requirements.txt
"$venv/bin/python" -m unittest discover -s tests -v
"$venv/bin/python" build.py
