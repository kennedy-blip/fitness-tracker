"""Build the independent static dashboard into dist/."""
import json
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from shutil import copytree, rmtree

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

ROOT = Path(__file__).resolve().parent


def load_json(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


STATS = (
    ("steps", "Steps", "", "👟"), ("calories", "Calories", "cal", "🔥"),
    ("distance", "Distance", "km", "📍"), ("activeMinutes", "Active", "min", "⏱️"),
    ("heartRate", "Heart Rate", "bpm", "❤️"),
)
WEEKLY = (
    ("steps", "Steps", "steps", "👟", "indigo"),
    ("calories", "Calories", "cal", "🔥", "orange"),
    ("workouts", "Workouts", "sessions", "💪", "blue"),
    ("activeMinutes", "Active Min", "min", "⏱️", "purple"),
)


def dashboard(data):
    max_goal = max(day["goal"] for day in data["dailySteps"])
    max_calories = max(day["calories"] for day in data["caloriesBurned"])
    return {
        "stats": [dict(label=label, value=data["todayStats"][key], unit=unit, icon=icon)
                  for key, label, unit, icon in STATS],
        "weekly": [dict(metric, label=label, unit=unit, icon=icon, color=color,
                        complete=metric["current"] >= metric["goal"],
                        percent=min(100, 100 * metric["current"] / metric["goal"]))
                   for key, label, unit, icon, color in WEEKLY
                   for metric in [data["weeklyProgress"][key]]],
        "steps": [dict(day, height=100 * day["steps"] / max_goal,
                       goal_height=100 * day["goal"] / max_goal,
                       label=Decimal(day["steps"] / 1000).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP),
                       complete=day["steps"] >= day["goal"])
                  for day in data["dailySteps"]],
        "calories": [dict(day, height=100 * day["calories"] / max_calories,
                          high=day["calories"] > 450) for day in data["caloriesBurned"]],
        "zone_total": sum(zone["duration"] for zone in data["heartRateZones"]),
    }


def build(output=ROOT / "dist"):
    env = Environment(loader=FileSystemLoader(ROOT / "templates"),
                      autoescape=select_autoescape(), undefined=StrictUndefined)
    env.filters["number"] = lambda value: format(value, ",")
    data = load_json("data/fitness.json")
    html = env.get_template("index.html").render(site=load_json("site.json"),
                                                 data=data, **dashboard(data))
    if output.exists():
        rmtree(output)
    output.mkdir(parents=True)
    (output / "index.html").write_text(html + "\n", encoding="utf-8")
    for directory in ("assets", "data"):
        copytree(ROOT / directory, output / directory)


if __name__ == "__main__":
    build()
