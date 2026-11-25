"""Check that a deployed URL is serving this migration, not the Vite build."""
import argparse
from html.parser import HTMLParser
import json
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = {}

    def handle_starttag(self, tag, attrs):
        if tag == "link":
            attrs = dict(attrs)
            if attrs.get("rel") in {"stylesheet", "icon"}:
                self.links[attrs["rel"]] = attrs["href"]


def verify(base_url):
    base = base_url.rstrip("/") + "/"

    def read(path, expected_type, marker=None):
        url = urljoin(base, path)
        if urlsplit(base).netloc != urlsplit(url).netloc:
            raise ValueError(f"{path}: expected a same-origin asset")
        with urlopen(url, timeout=20) as response:
            body = response.read()
            if response.status != 200 or response.headers.get_content_type() != expected_type:
                raise ValueError(f"{path}: unexpected status or content type")
            if marker is not None and marker not in body:
                raise ValueError(f"{path}: static candidate marker missing")
        print(f"Verified {path}")
        return body

    html = read("/", "text/html", b'<h3>Heart Rate Zones</h3>')
    if b'<h3>Workout History</h3>' not in html or b'<script' in html:
        raise ValueError("Expected pre-rendered dashboard without scripts")
    assets = Assets()
    assets.feed(html.decode("utf-8"))
    read(assets.links["stylesheet"], "text/css", b".step-chart")
    read(assets.links["icon"], "image/svg+xml", b"<svg")
    data = json.loads(read("/data/fitness.json", "application/json"))
    if (len(data["dailySteps"]), len(data["workoutHistory"])) != (7, 5):
        raise ValueError("Dashboard sample data is incomplete")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base_url")
    verify(parser.parse_args().base_url)
