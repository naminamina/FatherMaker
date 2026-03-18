from pathlib import Path
import os

folder = Path(__file__).resolve().parent.parent / "src" / "assets" / "fathers"
targets = [
    "father-supportive-working.png",
    "father-supportive-resting.png",
    "father-supportive-commuting.png",
    "father-supportive-relaxing.png",
    "father-supportive-sleeping.png",
    "father-laidback-working.png",
    "father-laidback-resting.png",
    "father-laidback-commuting.png",
    "father-laidback-relaxing.png",
    "father-laidback-sleeping.png",
    "father-awkward-working.png",
    "father-awkward-resting.png",
    "father-awkward-commuting.png",
    "father-awkward-relaxing.png",
    "father-awkward-sleeping.png",
    "father-playful-working.png",
    "father-playful-resting.png",
    "father-playful-commuting.png",
    "father-playful-relaxing.png",
    "father-playful-sleeping.png",
    "father-organized-working.png",
    "father-organized-resting.png",
    "father-organized-commuting.png",
    "father-organized-relaxing.png",
    "father-organized-sleeping.png",
]

files = sorted([f for f in os.listdir(folder) if f.lower().endswith(".png")])
if len(files) != len(targets):
    raise SystemExit(f"File count {len(files)} does not match targets {len(targets)}")

for src, dest in zip(files, targets):
    src_path = folder / src
    dest_path = folder / dest
    if dest_path.exists():
        dest_path.unlink()
    src_path.rename(dest_path)

print(f"Renamed {len(files)} files in {folder}")
