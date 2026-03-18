from pathlib import Path
from statistics import mean
from typing import Iterable
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FATHERS_DIR = ROOT / "src" / "assets" / "fathers"
TOLERANCE = 10


def average_color(pixels: Iterable[tuple[int, int, int, int]]) -> tuple[int, int, int]:
  channels = list(zip(*pixels))
  return tuple(int(mean(ch[:3])) for ch in channels[:3])


def is_near_white(pixel: tuple[int, int, int]) -> bool:
  return min(pixel) >= 235 and max(pixel) - min(pixel) <= 20


def should_clear(pixel: tuple[int, int, int], bg: tuple[int, int, int]) -> bool:
  if is_near_white(pixel):
    return True
  return all(abs(pixel[i] - bg[i]) <= TOLERANCE for i in range(3))


def process_image(path: Path) -> bool:
  img = Image.open(path).convert("RGBA")
  w, h = img.size
  corners = [
    img.getpixel((0, 0)),
    img.getpixel((w - 1, 0)),
    img.getpixel((0, h - 1)),
    img.getpixel((w - 1, h - 1)),
  ]
  bg = average_color(corners)

  data = img.getdata()
  new_data = []
  changed = False
  for r, g, b, a in data:
    if a == 0:
      new_data.append((r, g, b, a))
      continue
    if should_clear((r, g, b), bg):
      new_data.append((r, g, b, 0))
      changed = True
    else:
      new_data.append((r, g, b, a))

  if changed:
    img.putdata(new_data)
    img.save(path)
  return changed


def main():
  if not FATHERS_DIR.exists():
    raise SystemExit(f"Missing {FATHERS_DIR}")
  total = 0
  changed = 0
  for png in sorted(FATHERS_DIR.glob("*.png")):
    total += 1
    if process_image(png):
      changed += 1
      print(f"Updated {png.name}")
    else:
      print(f"Skipped {png.name}")
  print(f"Done. {changed}/{total} files updated.")


if __name__ == "__main__":
  main()
