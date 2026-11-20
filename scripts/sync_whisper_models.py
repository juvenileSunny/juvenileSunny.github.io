"""Refresh reference VRAM values from the public OpenAI Whisper README.

Usage (run from portfolio repo root):
    python scripts/sync_whisper_models.py

Offline verification:
    python scripts/sync_whisper_models.py --input-file path/to/README.md

This is an OWNER-MAINTAINED snapshot: the published page reads a local JSON
file, so visitors do not need to contact GitHub or permit cross-origin scraping.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = "https://raw.githubusercontent.com/openai/whisper/main/README.md"
EXPECTED = ("tiny", "base", "small", "medium", "large", "turbo")


def parse_reference_markdown(readme):
    models = {}
    for line in readme.splitlines():
        if "|" not in line:
            continue
        cells = [part.strip() for part in line.strip().strip("|").split("|")]
        if len(cells) < 5:
            continue
        name = cells[0].strip('` ').lower()
        if name not in EXPECTED:
            continue
        memory = re.search(r"(~?\s*\d+(?:\.\d+)?)\s*GB", cells[4], re.IGNORECASE)
        params = re.search(r"(\d+(?:\.\d+)?)\s*M", cells[1], re.IGNORECASE)
        if memory and params:
            models[name] = {
                "name": name,
                "parameters_million": int(float(params.group(1))),
                "vram_gb": float(memory.group(1).replace("~", "").strip()),
            }
    if set(models) != set(EXPECTED):
        raise ValueError("Could not extract the full Whisper reference table; upstream layout may have changed. Existing JSON left unchanged.")
    return [models[name] for name in EXPECTED]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-file", type=Path, help="Use a locally saved README.md instead of downloading")
    parser.add_argument("--output", type=Path, default=ROOT / "assets" / "whisper-models.json")
    args = parser.parse_args()
    if args.input_file:
        readme = args.input_file.read_text(encoding="utf-8")
    else:
        req = Request(SOURCE, headers={"User-Agent": "VideoSpeakerStudio-portfolio-model-reference/1.0"})
        with urlopen(req, timeout=25) as response:
            readme = response.read().decode("utf-8")
    models = parse_reference_markdown(readme)
    payload = {"source": "https://github.com/openai/whisper/blob/main/README.md", "description":
               "Approximate GPU VRAM requirements for the original OpenAI Whisper implementation; not hard limits for faster-whisper.", "models": models}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    tmp = args.output.with_suffix(args.output.suffix + ".tmp")
    tmp.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    tmp.replace(args.output)
    print(f"Updated {args.output} from official reference table ({len(models)} models).")


if __name__ == "__main__":
    main()
