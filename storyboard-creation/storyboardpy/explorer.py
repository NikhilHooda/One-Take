import asyncio
import json
import os
import re
import time
from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional, Set, Tuple
from urllib.parse import urljoin, urlparse


@dataclass
class Clickable:
    text: Optional[str]
    role: Optional[str]
    tag: Optional[str]
    href: Optional[str]
    aria_label: Optional[str]
    id_attr: Optional[str]
    classes: Optional[str]
    locator_suggestion: Optional[str]
    bbox: Optional[Dict[str, Any]]


@dataclass
class FormField:
    name: Optional[str]
    type: Optional[str]
    placeholder: Optional[str]


@dataclass
class FormInfo:
    selector_hint: Optional[str]
    fields: List[FormField]
    submit_button_text: Optional[str]


@dataclass
class PageSummary:
    url: str
    title: Optional[str]
    description: Optional[str]
    headings: List[str]
    nav_links: List[Tuple[str, str]]  # (text, href)
    clickables: List[Clickable]
    forms: List[FormInfo]
    screenshot_path: Optional[str]
    features_guess: List[str]


def infer_features(headings: List[str], buttons: List[Clickable]) -> List[str]:
    text_blob = " ".join([h.lower() for h in headings] + [
        (c.text or "").lower() for c in buttons
    ])
    hints = [
        ("pricing", re.compile(r"\bpricing|plans?\b")),
        ("docs", re.compile(r"\bdocs?|documentation\b")),
        ("login", re.compile(r"\blog\s*in|sign\s*in\b")),
        ("signup", re.compile(r"\bsign\s*up|register\b")),
        ("dashboard", re.compile(r"\bdashboard\b")),
        ("api", re.compile(r"\bapi\b")),
        ("integrations", re.compile(r"\bintegrations?\b")),
        ("contact", re.compile(r"\bcontact|support\b")),
        ("trial", re.compile(r"\bfree\s*trial|try\s*free|get\s*started\b")),
        ("search", re.compile(r"\bsearch\b")),
    ]
    found = []
    for name, rx in hints:
        if rx.search(text_blob):
            found.append(name)
    return found


class WebsiteExplorer:
    def __init__(
        self,
        start_url: str,
        max_pages: int = 5,
        same_origin_only: bool = True,
        artifacts_dir: Optional[str] = None,
        headless: bool = True,
        max_links_per_page: int = 30,
        screenshot: bool = True,
        timeout_ms: int = 20000,
    ) -> None:
        self.start_url = start_url
        self.max_pages = max_pages
        self.same_origin_only = same_origin_only
        self.artifacts_dir = artifacts_dir
        self.headless = headless
        self.max_links_per_page = max_links_per_page
        self.screenshot = screenshot
        self.timeout_ms = timeout_ms
        if artifacts_dir:
            os.makedirs(artifacts_dir, exist_ok=True)

    async def explore(self) -> Dict[str, Any]:
        try:
            from playwright.async_api import async_playwright
            use_playwright = True
        except Exception:
            use_playwright = False

        if use_playwright:
            return await self._explore_with_playwright()
        else:
            return await self._explore_with_requests()

    async def _explore_with_playwright(self) -> Dict[str, Any]:
        from playwright.async_api import async_playwright

        origin = urlparse(self.start_url).netloc
        queue: List[str] = [self.start_url]
        visited: Set[str] = set()
        pages: List[PageSummary] = []

        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=self.headless)
            context = await browser.new_context()
            try:
                for idx in range(self.max_pages):
                    if not queue:
                        break
                    url = queue.pop(0)
                    if url in visited:
                        continue
                    if self.same_origin_only and urlparse(url).netloc != origin:
                        continue
                    visited.add(url)

                    page = await context.new_page()
                    try:
                        await page.goto(url, wait_until="domcontentloaded", timeout=self.timeout_ms)
                    except Exception:
                        await page.close()
                        continue

                    # Title and meta
                    title = await page.title()
                    description = await page.evaluate(
                        "() => document.querySelector('meta[name=\"description\"]')?.getAttribute('content') || ''"
                    )

                    # Headings
                    headings = await page.evaluate(
                        "() => Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean)"
                    )

                    # Nav links
                    nav_links = await page.evaluate(
                        "() => Array.from(document.querySelectorAll('nav a[href]')).slice(0, 50).map(a => [a.innerText.trim(), a.href])"
                    )

                    # Clickables
                    clickables_js = """
                        () => Array.from(document.querySelectorAll('a, button, [role="button"], input[type="submit"], [onclick]')).slice(0, 100).map(el => {
                          const tag = el.tagName.toLowerCase();
                          const role = el.getAttribute('role');
                          const href = el.getAttribute('href');
                          const aria = el.getAttribute('aria-label');
                          const id = el.id || null;
                          const cls = el.className || null;
                          const text = (el.innerText || el.value || '').trim();
                          const bbox = el.getBoundingClientRect();
                          let locator = null;
                          if (aria) locator = `role=${role||'button'}[name="${aria.replace(/"/g, '\\"')}"]`;
                          else if (id) locator = `#${id}`;
                          else if (text && text.length <= 60) locator = `text=${text.replace(/\s+/g, ' ')}`;
                          return { tag, role, href, aria_label: aria, id_attr: id, classes: cls, text, locator_suggestion: locator, bbox: {x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height} };
                        })
                    """
                    clickables_raw = await page.evaluate(clickables_js)
                    clickables = [Clickable(**c) for c in clickables_raw]

                    # Forms
                    forms_js = """
                        () => Array.from(document.querySelectorAll('form')).slice(0, 20).map((f, i) => {
                          const fields = Array.from(f.querySelectorAll('input, textarea, select')).slice(0, 20).map(el => ({
                            name: el.getAttribute('name') || el.id || null,
                            type: (el.getAttribute('type') || el.tagName || '').toLowerCase(),
                            placeholder: el.getAttribute('placeholder') || null
                          }));
                          const submit = f.querySelector('[type="submit"], button[type="submit"], button');
                          const submitText = submit ? (submit.innerText || submit.value || '').trim() : null;
                          let hint = f.id ? `#${f.id}` : null;
                          if (!hint) {
                            const name = f.getAttribute('name');
                            hint = name ? `form[name="${name}"]` : `form:nth-of-type(${i+1})`;
                          }
                          return { selector_hint: hint, fields, submit_button_text: submitText };
                        })
                    """
                    forms_raw = await page.evaluate(forms_js)
                    forms = [FormInfo(
                        selector_hint=f.get("selector_hint"),
                        fields=[FormField(**fld) for fld in f.get("fields", [])],
                        submit_button_text=f.get("submit_button_text"),
                    ) for f in forms_raw]

                    # Screenshot
                    screenshot_path = None
                    if self.screenshot and self.artifacts_dir:
                        screenshot_path = os.path.join(self.artifacts_dir, f"page_{len(pages)+1}.png")
                        try:
                            await page.screenshot(path=screenshot_path, full_page=True)
                        except Exception:
                            screenshot_path = None

                    features_guess = infer_features(headings, clickables)

                    pages.append(PageSummary(
                        url=url,
                        title=title,
                        description=description or None,
                        headings=headings,
                        nav_links=nav_links,
                        clickables=clickables,
                        forms=forms,
                        screenshot_path=screenshot_path,
                        features_guess=features_guess,
                    ))

                    # Enqueue links
                    links = await page.evaluate(
                        "() => Array.from(document.querySelectorAll('a[href]')).slice(0, 200).map(a => a.href)"
                    )
                    await page.close()

                    # Dedup and filter
                    next_links = []
                    for link in links:
                        if link in visited:
                            continue
                        if self.same_origin_only and urlparse(link).netloc != origin:
                            continue
                        next_links.append(link)
                    queue.extend(next_links[: self.max_links_per_page])
            finally:
                await context.close()
                await browser.close()

        return {
            "engine": "playwright",
            "started_at": int(time.time()),
            "start_url": self.start_url,
            "max_pages": self.max_pages,
            "pages": [self._page_to_dict(p) for p in pages],
        }

    async def _explore_with_requests(self) -> Dict[str, Any]:
        import requests
        from bs4 import BeautifulSoup

        origin = urlparse(self.start_url).netloc
        queue: List[str] = [self.start_url]
        visited: Set[str] = set()
        pages: List[PageSummary] = []

        session = requests.Session()

        for _ in range(self.max_pages):
            if not queue:
                break
            url = queue.pop(0)
            if url in visited:
                continue
            if self.same_origin_only and urlparse(url).netloc != origin:
                continue
            visited.add(url)
            try:
                resp = session.get(url, timeout=15)
            except Exception:
                continue
            if not (200 <= resp.status_code < 400):
                continue
            soup = BeautifulSoup(resp.text, 'html.parser')
            title = soup.title.string.strip() if soup.title and soup.title.string else None
            meta = soup.find('meta', attrs={'name': 'description'})
            description = meta['content'].strip() if meta and meta.get('content') else None
            headings = [h.get_text(strip=True) for h in soup.select('h1, h2, h3')][:50]
            nav_links_tags = soup.select('nav a[href]')[:50]
            nav_links = [(a.get_text(strip=True), urljoin(url, a['href'])) for a in nav_links_tags]

            # Clickables approximation
            clickables: List[Clickable] = []
            for el in soup.select('a, button, [role="button"], input[type="submit"], [onclick]')[:100]:
                tag = el.name.lower() if hasattr(el, 'name') else None
                role = el.get('role')
                href = el.get('href')
                aria = el.get('aria-label')
                id_attr = el.get('id')
                classes = el.get('class')
                text = el.get_text(strip=True) if hasattr(el, 'get_text') else None
                if tag == 'input' and not text:
                    text = el.get('value')
                locator = None
                if aria:
                    locator = f"role={role or 'button'}[name=\"{aria}\"]"
                elif id_attr:
                    locator = f"#{id_attr}"
                elif text and len(text) <= 60:
                    cleaned_text = re.sub(r'\s+', ' ', text)
                    locator = f"text={cleaned_text}"
                clickables.append(Clickable(
                    text=text, role=role, tag=tag, href=(urljoin(url, href) if href else None),
                    aria_label=aria, id_attr=id_attr, classes=' '.join(classes) if classes else None,
                    locator_suggestion=locator, bbox=None
                ))

            # Forms approximation
            forms: List[FormInfo] = []
            for i, f in enumerate(soup.select('form')[:20]):
                fields: List[FormField] = []
                for fld in f.select('input, textarea, select')[:20]:
                    fields.append(FormField(
                        name=fld.get('name') or fld.get('id'),
                        type=(fld.get('type') or fld.name or '').lower(),
                        placeholder=fld.get('placeholder')
                    ))
                submit = f.select_one('[type="submit"], button[type="submit"], button')
                submit_text = None
                if submit:
                    submit_text = submit.get_text(strip=True) or submit.get('value')
                hint = f.get('id')
                if hint:
                    hint = f"#{hint}"
                else:
                    name = f.get('name')
                    hint = f"form[name=\"{name}\"]" if name else f"form:nth-of-type({i+1})"
                forms.append(FormInfo(selector_hint=hint, fields=fields, submit_button_text=submit_text))

            features_guess = infer_features(headings, clickables)

            pages.append(PageSummary(
                url=url, title=title, description=description, headings=headings,
                nav_links=nav_links, clickables=clickables, forms=forms,
                screenshot_path=None, features_guess=features_guess
            ))

            # Enqueue links
            links = [urljoin(url, a['href']) for a in soup.select('a[href]')][:200]
            next_links = []
            for link in links:
                if link in visited:
                    continue
                if self.same_origin_only and urlparse(link).netloc != origin:
                    continue
                next_links.append(link)
            queue.extend(next_links[: self.max_links_per_page])

        return {
            "engine": "requests",
            "started_at": int(time.time()),
            "start_url": self.start_url,
            "max_pages": self.max_pages,
            "pages": [self._page_to_dict(p) for p in pages],
        }

    def _page_to_dict(self, p: PageSummary) -> Dict[str, Any]:
        return {
            "url": p.url,
            "title": p.title,
            "description": p.description,
            "headings": p.headings,
            "nav_links": p.nav_links,
            "clickables": [asdict(c) for c in p.clickables],
            "forms": [
                {
                    "selector_hint": f.selector_hint,
                    "fields": [asdict(ff) for ff in f.fields],
                    "submit_button_text": f.submit_button_text,
                }
                for f in p.forms
            ],
            "screenshot_path": p.screenshot_path,
            "features_guess": p.features_guess,
        }
