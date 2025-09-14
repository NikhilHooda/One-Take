import argparse
import asyncio
import json
import os
from typing import Optional, List, Dict, Any

from dotenv import load_dotenv

from .explorer import WebsiteExplorer
from .agent import StoryboardAgent


def _ensure_dir(path: Optional[str]):
    if not path:
        return
    dirpath = os.path.dirname(path)
    if dirpath:
        os.makedirs(dirpath, exist_ok=True)


def _format_time(seconds: float) -> str:
    try:
        seconds = float(seconds)
    except Exception:
        seconds = 0.0
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"


def _derive_transcript(storyboard: Dict[str, Any]) -> List[Dict[str, Any]]:
    # Prefer provided transcript.segments; otherwise derive from scenes/narration
    tx = storyboard.get("transcript", {}) or {}
    segs = tx.get("segments")
    if isinstance(segs, list) and segs:
        return segs
    # Derive basic segments from scenes
    segments: List[Dict[str, Any]] = []
    t = 0.0
    for scene in storyboard.get("scenes", []):
        dur = float(scene.get("duration_seconds", 0))
        text = scene.get("narration") or scene.get("title") or ""
        if dur and text:
            segments.append({
                "scene_id": scene.get("id"),
                "start_seconds": t,
                "end_seconds": t + dur,
                "text": text,
            })
        t += dur
    return segments


def _render_transcript_text(segments: List[Dict[str, Any]]) -> str:
    lines = []
    for seg in segments:
        start = _format_time(seg.get("start_seconds", 0))
        end = _format_time(seg.get("end_seconds", 0))
        text = seg.get("text", "").strip()
        scene = seg.get("scene_id")
        scene_part = f" scene={scene}" if scene else ""
        lines.append(f"[{start} - {end}]{scene_part} {text}")
    return "\n".join(lines) + ("\n" if lines else "")


async def cmd_scan(args: argparse.Namespace):
    explorer = WebsiteExplorer(
        start_url=args.url,
        max_pages=args.max_pages,
        same_origin_only=not args.cross_origin,
        artifacts_dir=args.artifacts_dir,
        headless=not args.headed,
        max_links_per_page=args.max_links_per_page,
        screenshot=not args.no_screenshot,
    )
    site_summary = await explorer.explore()
    if args.site_out:
        _ensure_dir(args.site_out)
        with open(args.site_out, "w", encoding="utf-8") as f:
            json.dump(site_summary, f, indent=2)
        print(f"Saved site summary: {args.site_out}")
    else:
        print(json.dumps(site_summary, indent=2))


async def cmd_storyboard(args: argparse.Namespace):
    if args.site_in:
        with open(args.site_in, "r", encoding="utf-8") as f:
            site_summary = json.load(f)
    else:
        explorer = WebsiteExplorer(
            start_url=args.url,
            max_pages=args.max_pages,
            same_origin_only=not args.cross_origin,
            artifacts_dir=args.artifacts_dir,
            headless=not args.headed,
            max_links_per_page=args.max_links_per_page,
            screenshot=not args.no_screenshot,
        )
        site_summary = await explorer.explore()

    agent = StoryboardAgent(model=args.model, temperature=args.temperature)
    storyboard = await agent.create_storyboard_async(
        site_summary=site_summary,
        duration_hint=args.duration_hint,
        persona=args.persona,
        goal=args.goal,
    )

    if args.out:
        _ensure_dir(args.out)
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(storyboard, f, indent=2)
        print(f"Saved storyboard: {args.out}")
    else:
        print(json.dumps(storyboard, indent=2))

    # Always write transcript.txt unless disabled in the future
    segments = _derive_transcript(storyboard)
    transcript_text = _render_transcript_text(segments)
    # Decide output path
    tx_out = getattr(args, "transcript_out", None)
    if not tx_out:
        base_dir = os.path.dirname(args.out) if args.out else os.getcwd()
        tx_out = os.path.join(base_dir or ".", "transcript.txt")
    _ensure_dir(tx_out)
    with open(tx_out, "w", encoding="utf-8") as f:
        f.write(transcript_text)
    print(f"Saved transcript: {tx_out}")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Website explorer and storyboard generator")
    sub = p.add_subparsers(dest="cmd")

    # Common args
    def add_common(sp):
        sp.add_argument("--url", help="Start URL", required=False)
        sp.add_argument("--max-pages", type=int, default=5)
        sp.add_argument("--max-links-per-page", type=int, default=30)
        sp.add_argument("--cross-origin", action="store_true", help="Allow leaving the origin domain")
        sp.add_argument("--artifacts-dir", default=None, help="Directory to save screenshots and artifacts")
        sp.add_argument("--headed", action="store_true", help="Run browser in headed mode (Playwright)")
        sp.add_argument("--no-screenshot", action="store_true")

    sp_scan = sub.add_parser("scan", help="Explore a site and output a summary JSON")
    add_common(sp_scan)
    sp_scan.add_argument("--site-out", default=None, help="Path to write the site summary JSON")
    sp_scan.set_defaults(func=lambda a: asyncio.run(cmd_scan(a)))

    sp_story = sub.add_parser("storyboard", help="Generate a storyboard from a site (existing summary or fresh scan)")
    add_common(sp_story)
    sp_story.add_argument("--site-in", default=None, help="Use existing site summary JSON instead of scanning")
    sp_story.add_argument("--duration-hint", type=int, default=None, help="Target total duration in seconds")
    sp_story.add_argument("--persona", default="Prospective user")
    sp_story.add_argument("--goal", default="Show the core value and test key flows")
    sp_story.add_argument("--model", default=None)
    sp_story.add_argument("--temperature", type=float, default=None)
    sp_story.add_argument("--out", default=None, help="Path to write the storyboard JSON")
    sp_story.add_argument("--transcript-out", default=None, help="Path to write transcript text (default transcript.txt next to --out)")
    sp_story.set_defaults(func=lambda a: asyncio.run(cmd_storyboard(a)))

    # Top-level convenience shortcut: default command = storyboard
    p.add_argument("--url", help="Start URL (shortcut; maps to storyboard)", nargs="?")
    p.add_argument("--max-pages", type=int, default=5)
    p.add_argument("--duration-hint", type=int, default=None)
    p.add_argument("--out", default=None)
    p.add_argument("--transcript-out", default=None)

    return p


def main():
    load_dotenv()
    parser = build_parser()
    args = parser.parse_args()
    if args.cmd:
        return args.func(args)

    # Shortcut path: treat top-level args as storyboard command if provided
    if args.url:
        sa = argparse.Namespace(
            url=args.url,
            max_pages=args.max_pages,
            max_links_per_page=30,
            cross_origin=False,
            artifacts_dir=None,
            headed=False,
            no_screenshot=False,
            site_in=None,
            duration_hint=args.duration_hint,
            persona="Prospective user",
            goal="Show the core value and test key flows",
            model=None,
            temperature=None,
            out=args.out,
            transcript_out=args.transcript_out,
        )
        return asyncio.run(cmd_storyboard(sa))

    parser.print_help()


if __name__ == "__main__":
    main()
