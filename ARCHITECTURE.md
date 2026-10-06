# ARCHITECTURE.md: how the site is built

Rules for agents are in AGENTS.md. This file describes the system: what exists now, where the redesign is taking it, and how the pieces fit.

## 1. The whole in one picture

```
   browser
      |
      v
   GitHub Pages  (serves the `main` branch as static files, via Jekyll)
      |
      +-- index.html                  home page
      +-- <project>.html  x7          case study pages (flat, at the root)
      +-- style.css                   one shared stylesheet
      +-- assets/                     images (PNG) and report PDFs
```

There is no server, database, build step or framework. A page is a file; publishing is pushing to `main`. Think of it as a printed brochure rather than a machine: every page is finished before it is sent.

## 2. Current state (`main`, as of 2026-10-04)

| Path | What it is |
| --- | --- |
| `index.html` | Home: header, About, 7 project cards, contact footer. Two inline scripts (footer year, card fade-in) |
| `brompton.html`, `fire-detection.html`, `gas-network-rl.html`, `graduate-employment.html`, `oop-hatchery-finance.html`, `text-analytics.html`, `word-clustering.html` | Case study pages. Each repeats its header and has 16 to 18 inline `style` attributes |
| `style.css` | Shared styles for all pages |
| `assets/*.png` | Card covers (1536x1024, ~1.7 MB each) and figures |
| `assets/*-report.pdf` | Five project reports, linked from case study pages |

Known problems are listed in `planning/01-audit.md`.

## 3. Target structure (redesign, proposed)

Existing URLs stay where they are, because they are already in sent applications. New code goes into folders.

```
index.html                    home
<project>.html                one per project, existing names kept; 3 new ones added
                              (job-application-pipeline, genai-insurance, wildcat-hostel; names TBC)
styles/
  tokens.css                  every colour, font, size, spacing and easing value
  base.css                    reset, typography, focus ring, reduced-motion rules
  components.css              buttons, cards, spec sheet, metric strip, figures, nav
  pages.css                   home and case study layouts
scripts/
  site.js                     shared: sets `js` class, reveals, nav, year
  hero.js                     particle hero (home page only)
  covers.js                   animated project covers controller
assets/
  covers/                     poster frames for covers (WebP)
  figures/<project>/          real figures from reports (WebP)
  *.pdf                       reports stay at their current paths
  og-card.png, favicon        link preview image and tab icon
_config.yml                   tells Jekyll which repo files not to publish
```

`style.css` is retired once every page has moved to `styles/`.

## 4. How a page is put together

Every page loads the same four stylesheets in order: tokens, base, components, pages. Later files may use tokens but never redefine them.

**Progressive enhancement.** Each page is complete as plain HTML. `site.js` adds a `js` class to `<html>`, and only then do styles hide elements that are about to animate in. If JavaScript fails, nothing stays hidden.

**Case study anatomy** (from `planning/04-new-projects.md`): title and one-line outcome, spec sheet (context, my part, dates, stack, status, links), hero media, metric strip with evaluation context, Problem, Approach with a Key decision, Results, Limitations and next steps, next project.

## 5. Motion architecture

| Piece | Where | How it works |
| --- | --- | --- |
| Particle hero | `scripts/hero.js`, one `<canvas aria-hidden="true">` | Three target shapes (bike drawing, data clusters, neural network) are sampled once into typed arrays. Each frame interpolates every point between the current and next shape with a small per-point delay. A simple state machine runs assemble, then the stages, then stops. Rendering pauses when the canvas is offscreen, the tab is hidden, or the scene is still. Pixel ratio capped at 2. Point count halves on small screens |
| Hero variants | same file | A: plays through once on its own, with a replay control. B: a short (about 120vh) pin with GSAP ScrollTrigger scrubbing the progress. Only one ships; B adds the GSAP dependency |
| Project covers | `scripts/covers.js`, inline SVG per card | Each cover is an SVG whose animation starts when the card gets an `is-playing` class (CSS or Web Animations API). One controller decides which card plays: hover on mouse devices; on touch, the single most-visible card, once. Every cover has a static poster state |
| Small interactions | `styles/components.css` | Button press, focus brackets on hover, short figure reveals. CSS transitions using the easing and duration tokens |
| Reduced motion | `styles/base.css` and each script | CSS media query removes movement; scripts read `matchMedia('(prefers-reduced-motion: reduce)')` and render final states instead |

## 6. Deployment and preview

| Stage | How |
| --- | --- |
| Live | GitHub Pages serves `main` at https://misharasapu.github.io. Jekyll runs first: files and folders starting with `.` (such as `.agents`, `.claude`) are never published, and `_config.yml` excludes the agent docs and lock file |
| Preview of `redesign` | Local only: `python3 -m http.server 8000` from the repo root |
| Later | Move to Vercel (Hobby) for a preview URL per branch and analytics. The old address then needs a redirect page per old URL; see `planning/codex-review.md`, Hosting |

`planning/` is gitignored, so it is never committed or published. Gitignore is not access control: it only protects files that are never pushed.

## 7. Agent tooling in the repo

| Path | Purpose | Committed |
| --- | --- | --- |
| `AGENTS.md` | Shared rules for Claude Code and Codex | Yes |
| `CLAUDE.md` | Claude Code specifics; imports AGENTS.md | Yes |
| `ARCHITECTURE.md` | This file | Yes |
| `.agents/skills/` | Project skills (impeccable, gsap-scrolltrigger), read by Codex | Yes |
| `.claude/skills/` | Symlinks to the above, read by Claude Code | Yes |
| `skills-lock.json` | Pinned skill sources and hashes | Yes |
| `planning/` | Plans, decisions, reviews | No (gitignored) |
