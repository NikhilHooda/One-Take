import json
import os
from typing import Any, Dict, Optional, Iterable
import io
import contextlib
import asyncio
import inspect

from dotenv import load_dotenv
from openai.types.shared import Reasoning
from agents import Agent, ModelSettings

from .schemas import STORYBOARD_JSON_SCHEMA


class StoryboardAgent:
    """Generates storyboard JSON using the OpenAI Agents SDK (not Assistants)."""

    def __init__(self, model: Optional[str] = None, temperature: Optional[float] = None):
        load_dotenv()
        if not os.getenv("OPENAI_API_KEY"):
            raise RuntimeError("OPENAI_API_KEY not set. Provide via environment or .env file.")

        # Model resolution: explicit arg > OPENAI_MODEL > OPENAI_DEFAULT_MODEL > sensible default
        resolved_model = (
            model
            or os.getenv("OPENAI_MODEL")
            or os.getenv("OPENAI_DEFAULT_MODEL")
            or "gpt-4o-mini"
        )
        # Temperature is not universally supported by the Agents SDK yet; keep for future use
        try:
            self.temperature = float(os.getenv("OPENAI_TEMPERATURE", str(temperature if temperature is not None else 0.2)))
        except ValueError:
            self.temperature = 0.2
        try:
            self.timeout_seconds = int(os.getenv("OPENAI_TIMEOUT_SECONDS", "120"))
        except ValueError:
            self.timeout_seconds = 120

        self.agent = Agent(
            name="Storyboard Director",
            instructions=(
                "You generate ONLY valid JSON that matches the provided schema. "
                "No prose, no markdown. If uncertain, make reasonable assumptions and proceed."
            ),
            model=resolved_model,
        )

    def _build_prompt(self, site_summary: Dict[str, Any], duration_hint: Optional[int], persona: str, goal: str) -> str:
        schema_hint = json.dumps(STORYBOARD_JSON_SCHEMA, indent=2)
        return (
            "You are a product demo director. Given a website exploration summary, "
            "produce a JSON storyboard that another agent will use to record a clean, concise UI demo.\n\n"
            "Constraints:\n"
            "- Return ONLY valid JSON. No markdown.\n"
            "- Use the provided JSON schema exactly.\n"
            "- Choose selectors that are robust (role+name, id, or short text).\n"
            "- Favor primary flows (landing -> key feature -> value -> CTA).\n"
            "- Avoid account-specific or destructive actions.\n"
            "- Include brief narration per scene to explain what's on screen.\n"
            "- For each scene, include a cinematic shot plan in scenes[].shots with zooms/pans/focus on key elements.\n"
            "- Shots should include start/end times, camera_move (zoom_in/zoom_out/pan_*/focus_element/static), target_selector (+ by), easing, transition_after, and any overlays or emphasis.\n"
            "- Also include a transcript with timed segments that sync to scenes; each scene should have at least one segment whose start/end times align with cumulative scene durations.\n"
            "- The final transcript end time should approximately equal the suggested total duration.\n\n"
            f"Persona: {persona}\n"
            f"Goal: {goal}\n"
            f"Duration hint (seconds): {duration_hint if duration_hint else 'no preference'}\n\n"
            f"JSON Schema (use this strictly):\n{schema_hint}\n\n"
            f"Website Summary (trimmed):\n{json.dumps(self._trim_site_summary(site_summary), indent=2)}\n"
        )

    def _trim_site_summary(self, site_summary: Dict[str, Any]) -> Dict[str, Any]:
        # Trim for token efficiency while keeping key context
        pages = site_summary.get("pages", [])[:8]
        trimmed_pages = []
        for p in pages:
            clickables = p.get("clickables", [])[:20]
            forms = p.get("forms", [])[:5]
            headings = p.get("headings", [])[:10]
            nav_links = p.get("nav_links", [])[:15]
            trimmed_pages.append({
                "url": p.get("url"),
                "title": p.get("title"),
                "description": p.get("description"),
                "headings": headings,
                "nav_links": nav_links,
                "clickables": [
                    {
                        "text": c.get("text"),
                        "role": c.get("role"),
                        "tag": c.get("tag"),
                        "href": c.get("href"),
                        "aria_label": c.get("aria_label"),
                        "id_attr": c.get("id_attr"),
                        "locator_suggestion": c.get("locator_suggestion"),
                    }
                    for c in clickables
                ],
                "forms": forms,
                "features_guess": p.get("features_guess", []),
            })
        return {
            "engine": site_summary.get("engine"),
            "start_url": site_summary.get("start_url"),
            "pages": trimmed_pages,
        }

    def _coerce_result_to_text(self, result: Any) -> str:
        # Direct string
        if isinstance(result, str):
            return result
        # Common attributes
        for attr in ("output_text", "text", "content"):
            if hasattr(result, attr) and isinstance(getattr(result, attr), str):
                return getattr(result, attr)
        # Dict-like
        if isinstance(result, dict):
            for key in ("output_text", "text", "content"):
                if isinstance(result.get(key), str):
                    return result[key]
            # Messages list pattern
            msgs = result.get("messages")
            if isinstance(msgs, list) and msgs:
                parts = []
                for m in msgs:
                    if isinstance(m, dict):
                        c = m.get("content") or m.get("text")
                        if isinstance(c, str):
                            parts.append(c)
                if parts:
                    return "\n".join(parts)
        # Iterable event stream pattern
        if isinstance(result, Iterable) and not isinstance(result, (str, bytes)):
            parts = []
            try:
                for ev in result:
                    # ev as dict or object
                    if isinstance(ev, dict):
                        if isinstance(ev.get("text"), str):
                            parts.append(ev["text"])
                        elif isinstance(ev.get("delta"), dict) and isinstance(ev["delta"].get("text"), str):
                            parts.append(ev["delta"]["text"])
                    else:
                        for attr in ("text", "delta"):
                            if hasattr(ev, attr):
                                val = getattr(ev, attr)
                                if isinstance(val, str):
                                    parts.append(val)
                                elif isinstance(val, dict) and isinstance(val.get("text"), str):
                                    parts.append(val["text"])
                if parts:
                    return "".join(parts)
            except TypeError:
                pass
        # Fallback
        return str(result)

    async def _invoke_agent(self, prompt: str) -> Any:
        """Invoke the Agents SDK using AgentRunner (SDK 0.3.0)."""
        try:
            from agents import run as run_mod  # type: ignore
        except Exception as e:
            raise RuntimeError("openai-agents package not available") from e

        runner = run_mod.get_default_agent_runner()
        # Prefer the async runner API when inside an event loop
        try:
            return await runner.run(self.agent, input=prompt)
        except TypeError:
            # Some variants accept messages instead of input
            return await runner.run(self.agent, input=[{"role": "user", "content": prompt}])

    async def create_storyboard_async(
        self,
        site_summary: Dict[str, Any],
        duration_hint: Optional[int] = None,
        persona: str = "Prospective user",
        goal: str = "Show the core value and test key flows",
    ) -> Dict[str, Any]:
        prompt = self._build_prompt(site_summary, duration_hint, persona, goal)
        result = await self._invoke_agent(prompt)
        content_text = self._coerce_result_to_text(result)

        def _parse_json_relaxed(txt: str):
            try:
                return json.loads(txt)
            except Exception:
                # Try to extract a JSON object substring
                start = txt.find('{')
                end = txt.rfind('}')
                if start != -1 and end != -1 and end > start:
                    snippet = txt[start:end+1]
                    try:
                        return json.loads(snippet)
                    except Exception:
                        pass
                raise

        try:
            data = _parse_json_relaxed(content_text)
        except Exception as e:
            raise RuntimeError(f"Agent did not return valid JSON. Error: {e}\nRaw: {content_text[:1000]}")

        # Basic shape checks
        for key in ["product_name", "suggested_duration_seconds", "scenes", "coverage", "assumptions", "risks", "transcript"]:
            if key not in data:
                raise RuntimeError(f"Storyboard missing required field: {key}")
        return data

    def create_storyboard(
        self,
        site_summary: Dict[str, Any],
        duration_hint: Optional[int] = None,
        persona: str = "Prospective user",
        goal: str = "Show the core value and test key flows",
    ) -> Dict[str, Any]:
        # Synchronous wrapper for non-async contexts
        try:
            asyncio.get_running_loop()
            raise RuntimeError("create_storyboard called inside an event loop; use create_storyboard_async instead")
        except RuntimeError:
            return asyncio.run(self.create_storyboard_async(site_summary, duration_hint, persona, goal))
