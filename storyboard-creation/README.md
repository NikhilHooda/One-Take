# storyboardpy

An OpenAI-powered Python agent that explores a website, analyzes its functionality and UI, and generates a JSON storyboard for a product demo. The storyboard captures recommended duration, actions (clicks, inputs, navigations), and features to highlight or test. You can feed this JSON to another agent or tool to produce a demo video.

## Features

- Headless exploration with Playwright (fallback to simple HTML crawl via `requests + bs4`)
- Collects pages, nav links, buttons, forms, and feature hints
- Uses the OpenAI Agents SDK to synthesize a storyboard JSON following a clear schema
- CLI for scanning sites and generating storyboards
- Saves optional screenshots for reference

## Requirements

- Python 3.9+
- An OpenAI API key

## Install

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Install Playwright browsers
python -m playwright install
```

## Configure

Copy `.env.example` to `.env` and set your API key.

```bash
cp .env.example .env
```

Edit `.env`:

```
OPENAI_API_KEY=sk-...
# Optional: override model
OPENAI_MODEL=gpt-4o-mini
# Alternatively, Agents SDK respects OPENAI_DEFAULT_MODEL if you prefer
# OPENAI_DEFAULT_MODEL=gpt-4o-mini
```

## Usage

Generate a storyboard in one step (explore + synthesize) and write transcript.txt:

```bash
python -m storyboardpy --url https://example.com --max-pages 5 --duration-hint 90 --out storyboards/example.storyboard.json --transcript-out storyboards/transcript.txt
```

Or run the two phases separately:

1) Scan the site and save a site summary

```bash
python -m storyboardpy scan --url https://example.com --max-pages 5 --artifacts-dir artifacts/example --site-out site_dumps/example.site.json
```

2) Create storyboard from an existing site summary

```bash
python -m storyboardpy storyboard --site-in site_dumps/example.site.json --duration-hint 90 --out storyboards/example.storyboard.json --transcript-out storyboards/transcript.txt
```

## Output

See `examples/storyboard.example.json` for the JSON structure. High-level fields:

- `product_name`: Name inferred from the site
- `suggested_duration_seconds`: Total recommended video duration
- `scenes[]`: Ordered scenes with narration and on-screen actions (click, input, navigate, scroll, wait)
- `scenes[].shots[]`: Cinematic shot plan with camera moves (zoom/pan/focus), timing, easing, transitions, overlays
- `coverage`: What features are demonstrated or tested
- `transcript`: Language + list of timed segments (start/end/text) aligned to scenes for TTS voiceover. The CLI also writes a plain text version to `transcript.txt` by default (or to `--transcript-out`).
- `assumptions` and `risks`: Caveats the video generator should know

## Notes

- Playwright is recommended for JS-heavy sites and to capture screenshots. If Playwright is not available, the tool falls back to a simple HTML crawl which may miss dynamic UI.
- The agent does not execute destructive actions; it only recommends storyboarded steps and cinematic camera directions. Validate any account-specific flows before recording.

## License

This project is provided as-is. Add your preferred license if you plan to distribute.
