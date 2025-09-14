import json
import os
from typing import Any, Dict, Optional, Iterable
import io
import contextlib
import asyncio
import inspect
import re

from dotenv import load_dotenv
import cohere
from .schemas import STORYBOARD_JSON_SCHEMA


class StoryboardAgent:
    """Generates storyboard JSON using Cohere Chat API."""

    def __init__(self, model: Optional[str] = None, temperature: Optional[float] = None):
        load_dotenv()
        if not os.getenv("COHERE_API_KEY"):
            raise RuntimeError("COHERE_API_KEY not set. Provide via environment or .env file.")

        self.api_key = os.getenv("COHERE_API_KEY")
        
        # Model resolution: explicit arg > COHERE_MODEL > default
        self.model = (
            model
            or os.getenv("COHERE_MODEL")
            or "command-r"  # Use newer non-deprecated model
        )
        
        # Temperature settings
        try:
            self.temperature = float(os.getenv("COHERE_TEMPERATURE", str(temperature if temperature is not None else 0.2)))
        except ValueError:
            self.temperature = 0.2
            
        try:
            self.timeout_seconds = int(os.getenv("COHERE_TIMEOUT_SECONDS", "120"))
        except ValueError:
            self.timeout_seconds = 120

        # Initialize Cohere client
        self.co = cohere.Client(self.api_key)

    def _safe_slice(self, text: Optional[str], max_length: int) -> str:
        """Safely slice text, handling None values."""
        if text is None:
            return ""
        return str(text)[:max_length]

    def _build_prompt(self, site_summary: Dict[str, Any], duration_hint: Optional[int], persona: str, goal: str) -> str:
        # Get the main URL/title to make the prompt more specific
        start_url = site_summary.get("start_url", "")
        pages = site_summary.get("pages", [])
        main_title = ""
        if pages and len(pages) > 0:
            main_title = pages[0].get("title", "")
        
        return (
            f"Create a JSON storyboard for demonstrating the website: {start_url}\n"
            f"Website title: {main_title}\n\n"
            f"CONTEXT: You are creating a demo for this specific website. Focus ONLY on the content and features found on this website.\n\n"
            f"Task: Create a product demo storyboard showing how to use this website.\n"
            f"Persona: {persona}\n"
            f"Goal: {goal}\n"
            f"Duration: {duration_hint or 90} seconds\n\n"
            f"IMPORTANT RULES:\n"
            f"1. Return ONLY valid JSON - no markdown, no explanations\n"
            f"2. Base the demo ONLY on the actual website content provided below\n"
            f"3. Create 3-5 realistic scenes showing actual user interactions with THIS website\n"
            f"4. Use real selectors and content from the website data\n"
            f"5. Make sure all scenes relate to the actual website, not generic examples\n"
            f"6. Transcript segments MUST be objects with scene_id, start_seconds, end_seconds, and text fields\n\n"
            f"Required JSON structure:\n"
            f"{{\n"
            f'  "product_name": "Website Name",\n'
            f'  "suggested_duration_seconds": {duration_hint or 90},\n'
            f'  "scenes": [/* array of scene objects with id, title, duration_seconds, narration, shots */],\n'
            f'  "coverage": "Description of what the demo covers",\n'
            f'  "assumptions": ["List of assumptions"],\n'
            f'  "risks": ["List of potential risks"],\n'
            f'  "transcript": {{\n'
            f'    "segments": [\n'
            f'      {{\n'
            f'        "scene_id": "scene-1",\n'
            f'        "start_seconds": 0,\n'
            f'        "end_seconds": 30,\n'
            f'        "text": "Narration text here"\n'
            f'      }}\n'
            f'    ]\n'
            f'  }}\n'
            f"}}\n\n"
            f"Website data to base the demo on:\n"
            f"{json.dumps(self._trim_site_summary(site_summary), indent=1)}\n\n"
            f"Create a storyboard that demonstrates THIS specific website, not a generic example."
        )

    def _trim_site_summary(self, site_summary: Dict[str, Any]) -> Dict[str, Any]:
        """Trim site summary for token efficiency with safe None handling."""
        if not site_summary or not isinstance(site_summary, dict):
            return {"engine": "unknown", "start_url": "", "pages": []}
        
        pages = site_summary.get("pages", [])
        if not isinstance(pages, list):
            pages = []
        
        # Trim more aggressively for token efficiency
        pages = pages[:3]  # Reduced from 8 to 3
        trimmed_pages = []
        
        for p in pages:
            if not isinstance(p, dict):
                continue
                
            # Safely get and trim clickables
            clickables = p.get("clickables", [])
            if not isinstance(clickables, list):
                clickables = []
            clickables = clickables[:15]  # Increased to get more context
            
            # Safely get other fields
            forms = p.get("forms", [])
            if not isinstance(forms, list):
                forms = []
            forms = forms[:5]
            
            headings = p.get("headings", [])
            if not isinstance(headings, list):
                headings = []
            headings = headings[:8]  # Increased to get more context
            
            nav_links = p.get("nav_links", [])
            if not isinstance(nav_links, list):
                nav_links = []
            nav_links = nav_links[:10]
            
            features_guess = p.get("features_guess", [])
            if not isinstance(features_guess, list):
                features_guess = []
            features_guess = features_guess[:5]
            
            trimmed_pages.append({
                "url": self._safe_slice(p.get("url"), 200),
                "title": self._safe_slice(p.get("title"), 100),
                "description": self._safe_slice(p.get("description"), 300),  # Increased for better context
                "headings": headings,
                "nav_links": nav_links,
                "clickables": [
                    {
                        "text": self._safe_slice(c.get("text") if isinstance(c, dict) else None, 80),  # Increased
                        "role": c.get("role") if isinstance(c, dict) else None,
                        "tag": c.get("tag") if isinstance(c, dict) else None,
                        "href": self._safe_slice(c.get("href") if isinstance(c, dict) else None, 150) or None,
                        "aria_label": self._safe_slice(c.get("aria_label") if isinstance(c, dict) else None, 80) or None,
                        "id_attr": c.get("id_attr") if isinstance(c, dict) else None,
                        "locator_suggestion": self._safe_slice(c.get("locator_suggestion") if isinstance(c, dict) else None, 80) or None,
                    }
                    for c in clickables if isinstance(c, dict)
                ],
                "forms": forms,
                "features_guess": features_guess,
            })
        
        return {
            "engine": site_summary.get("engine", "unknown"),
            "start_url": self._safe_slice(site_summary.get("start_url"), 200),
            "pages": trimmed_pages,
        }

    def _fix_transcript_structure(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure transcript has the correct structure for CLI compatibility."""
        if "transcript" not in data:
            data["transcript"] = {"segments": []}
            return data
        
        transcript = data["transcript"]
        
        # If transcript is a list, wrap it in segments
        if isinstance(transcript, list):
            data["transcript"] = {"segments": transcript}
            transcript = data["transcript"]
        
        # If transcript is not a dict, create empty structure
        if not isinstance(transcript, dict):
            data["transcript"] = {"segments": []}
            return data
        
        # Ensure segments exists and is a list
        if "segments" not in transcript or not isinstance(transcript["segments"], list):
            transcript["segments"] = []
        
        # Validate and fix each segment
        fixed_segments = []
        for i, segment in enumerate(transcript["segments"]):
            if isinstance(segment, str):
                # Convert string segments to proper objects
                fixed_segments.append({
                    "scene_id": f"scene-{i+1}",
                    "start_seconds": i * 30,
                    "end_seconds": (i + 1) * 30,
                    "text": segment
                })
            elif isinstance(segment, dict):
                # Ensure required fields exist
                fixed_segment = {
                    "scene_id": segment.get("scene_id", f"scene-{i+1}"),
                    "start_seconds": segment.get("start_seconds", i * 30),
                    "end_seconds": segment.get("end_seconds", (i + 1) * 30),
                    "text": segment.get("text", "")
                }
                fixed_segments.append(fixed_segment)
        
        data["transcript"]["segments"] = fixed_segments
        return data

    def _invoke_cohere(self, prompt: str) -> str:
        """Invoke Cohere Chat API."""
        try:
            response = self.co.chat(
                model=self.model,
                message=prompt,
                temperature=0.1,  # Lower temperature for more focused responses
                max_tokens=4000
            )
            
            # Extract text from chat response
            if hasattr(response, 'text'):
                return response.text
            else:
                raise RuntimeError(f"Chat response has no text attribute: {response}")
            
        except Exception as e:
            raise RuntimeError(f"Cohere API request failed: {e}")

    async def create_storyboard_async(
        self,
        site_summary: Dict[str, Any],
        duration_hint: Optional[int] = None,
        persona: str = "Prospective user",
        goal: str = "Show the core value and test key flows",
    ) -> Dict[str, Any]:
        # Validate inputs
        if not site_summary:
            site_summary = {"engine": "unknown", "start_url": "", "pages": []}
        
        prompt = self._build_prompt(site_summary, duration_hint, persona, goal)
        result = self._invoke_cohere(prompt)
        content_text = result

        # Try to parse JSON
        try:
            data = json.loads(content_text)
        except json.JSONDecodeError as e:
            # Try extracting JSON from text
            start = content_text.find('{')
            end = content_text.rfind('}')
            if start != -1 and end != -1 and end > start:
                snippet = content_text[start:end+1]
                try:
                    data = json.loads(snippet)
                except json.JSONDecodeError as e2:
                    raise RuntimeError(f"Cohere did not return valid JSON. Raw response: {content_text[:1000]}")
            else:
                raise RuntimeError(f"Cohere did not return valid JSON. Raw response: {content_text[:1000]}")

        # Validate required fields and add defaults if missing
        required_fields = {
            "product_name": "Website Demo",
            "suggested_duration_seconds": duration_hint or 90,
            "scenes": [],
            "coverage": "Basic overview",
            "assumptions": ["Standard web environment"],
            "risks": ["Content may vary"],
            "transcript": {"segments": []}
        }
        
        for field, default_value in required_fields.items():
            if field not in data or data[field] is None:
                data[field] = default_value

        # Fix transcript structure for CLI compatibility
        data = self._fix_transcript_structure(data)

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