"""Check that a deployed URL is serving this migration, not the Vite build."""
import argparse
import json
from urllib.request import urlopen


def verify(base_url):
    for path, expected_type, marker in (
        ("/", "text/html", b'href="assets/site.css"'),
        ("/assets/site.css", "text/css", b".step-chart"),
        ("/assets/favicon.svg", "image/svg+xml", b"<svg"),
        ("/data/fitness.json", "application/json", None),
    ):
        with urlopen(base_url.rstrip("/") + path, timeout=20) as response:
            body = response.read()
            if response.status != 200 or response.headers.get_content_type() != expected_type:
                raise ValueError(f"{path}: unexpected status or content type")
            if marker is not None and marker not in body:
                raise ValueError(f"{path}: static candidate marker missing")
            if marker is None:
                data = json.loads(body)
                if (len(data["dailySteps"]), len(data["workoutHistory"])) != (7, 5):
                    raise ValueError(f"{path}: dashboard sample data is incomplete")
            print(f"Verified {path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base_url")
    verify(parser.parse_args().base_url)
