from html.parser import HTMLParser
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from build import build, dashboard, load_json


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        if tag == "link":
            self.assets.append(dict(attrs)["href"])
        if tag == "script":
            self.scripts.append(attrs)


class StaticSiteTests(unittest.TestCase):
    def test_dashboard_calculations(self):
        result = dashboard(load_json("data/fitness.json"))
        self.assertEqual([metric["complete"] for metric in result["weekly"]],
                         [True, True, False, False])
        self.assertEqual([metric["percent"] for metric in result["weekly"]][:2], [100, 100])
        self.assertAlmostEqual(result["weekly"][2]["percent"], 500 / 7)
        self.assertAlmostEqual(result["weekly"][3]["percent"], 32000 / 350)
        self.assertEqual(result["zone_total"], 290)
        self.assertEqual(result["steps"][1]["height"], 112.5)
        self.assertEqual(result["steps"][1]["goal_height"], 100)
        self.assertEqual(str(result["steps"][1]["label"]), "11.3")
        self.assertEqual(result["calories"][5]["height"], 100)
        self.assertFalse(result["calories"][1]["high"])
        self.assertTrue(result["calories"][5]["high"])

    def test_build_exports_complete_standalone_dashboard(self):
        with TemporaryDirectory() as tmp:
            output = Path(tmp) / "dist"
            build(output)
            html = (output / "index.html").read_text(encoding="utf-8")
            page = Page()
            page.feed(html)
            self.assertEqual(page.assets, ["assets/favicon.svg", "assets/site.css"])
            for asset in page.assets:
                self.assertGreater((output / asset).stat().st_size, 0)
            self.assertFalse(page.scripts)
            data = json.loads((output / "data/fitness.json").read_text(encoding="utf-8"))
            self.assertEqual(data, load_json("data/fitness.json"))
            self.assertEqual(len(data["dailySteps"]), 7)
            self.assertEqual(len(data["caloriesBurned"]), 7)
            self.assertEqual(len(data["heartRateZones"]), 4)
            self.assertEqual(len(data["workoutHistory"]), 5)
            for text in ("Today's Stats", "Weekly Progress", "Daily Steps", "Calories Burned",
                         "Heart Rate Zones", "Workout History", "8,432", "11.3k", "290 min"):
                self.assertIn(text, html)
            for workout in data["workoutHistory"]:
                self.assertIn(workout["type"], html)
                self.assertIn(workout["date"], html)
            (output / "stale.html").touch()
            build(output)
            self.assertFalse((output / "stale.html").exists())
            self.assertEqual((output / "index.html").read_text(encoding="utf-8"), html)
