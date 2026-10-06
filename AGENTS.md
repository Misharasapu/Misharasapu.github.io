# AGENTS.md: rules for any coding agent (Claude Code, Codex)

How the site is built is in ARCHITECTURE.md. Claude Code specifics are in CLAUDE.md. Plans, decisions and reviews are in `planning/` (gitignored, local only).

## 1. What this is

Mishara Sapukotanage's personal portfolio: a static HTML/CSS/JS site served by GitHub Pages at https://misharasapu.github.io. Audience: UK hiring managers and recruiters for AI/ML and data science roles. The link goes into every job application, so the live site must never break.

The story the site tells: mechanical engineering, then data science, then AI/ML.

## 2. Read before working

1. `planning/README.md`: current status and "start here next session".
2. `planning/decisions.md`: what has been decided. Do not re-open a recorded decision without saying so.
3. `planning/02-design-direction.md`: the visual and motion spec ("Signal").
4. `planning/03-roadmap.md`: the current phase and its success check.

If `planning/` is missing (fresh clone), ask Mishara for it rather than inventing a direction.

## 3. Working rules

- **Branches:** redesign work happens on `redesign`. `main` is the live site. Never merge into `main` without Mishara's explicit go-ahead.
- **One step at a time.** State what success looks like, do the step, verify it, then stop for confirmation.
- **Multi-file changes:** show the plan before writing code.
- **Git:** never push, force, `reset --hard`, or delete files without asking. Commit only when asked. Never commit secrets.
- **Dependencies:** no new library, CDN script, font, skill, plugin or MCP server without naming the exact package, version and scope and getting a yes.
- **Scope:** touch only what the task needs. Mention unrelated problems; do not fix them silently.
- **Writing style:** UK spelling. No em dashes. No emojis.
- **Recording:** add decisions to `planning/decisions.md` (date, decision, why, who). Write reviews into `planning/`.

## 4. Stack constraints

- Plain HTML, CSS and JavaScript. No framework, no build step, no package.json.
- Allowed external sources: Google Fonts (Archivo, Instrument Sans, Martian Mono). GSAP 3.x + ScrollTrigger from jsDelivr only if the short-pin hero is chosen (pending). Nothing else without a yes.
- Keep existing public URLs working (`index.html`, the seven `*.html` project pages, `assets/*.pdf`). People have these links in old applications.

## 5. Content and claims (most important)

- **Never invent results.** No made-up metrics, confidence scores, timings or outcomes, including inside illustrations and animations.
- **Brompton** is tyre wear classification into Good / Monitor / Replace. Do not describe it as detection, or as covering other components, unless Mishara confirms.
- A **target** is not a measurement (for example the job pipeline's "under eight minutes").
- Every metric needs its evaluation context (what it was measured on).
- Every published image goes in the asset log in `planning/04-new-projects.md` first, with source and permission. Brompton and SYNOPTIX material needs clearance.
- **Private repos** get a "Private code" label, never a broken link. Repo visibility is still to be confirmed.
- Real figures from the reports go on case study pages. Generated images only where nothing real exists.

## 6. Design and motion rules

Full spec in `planning/02-design-direction.md`. The non-negotiables:

- Colours, type and timing come from tokens (CSS custom properties). No hard-coded hex values outside the tokens file.
- The site must read well with every animation off and with JavaScript off. Real text and numbers are always in the HTML; animations are a decorative layer.
- `prefers-reduced-motion: reduce` turns off all movement (hero, covers, reveals, transitions); opacity fades may stay.
- Nothing moves for more than 5 seconds without stopping or offering a pause (WCAG 2.2.2).
- Animate `transform` and `opacity` (and `clip-path` for reveals). Never animate layout properties.
- Hover effects only inside `@media (hover: hover) and (pointer: fine)`.
- Only one project cover animates at a time.

## 7. Quality floor (check before calling anything done)

- Works at 375px, 768px and 1440px wide with no horizontal scroll.
- Visible keyboard focus on every interactive element; everything reachable by keyboard.
- Text contrast WCAG AA (4.5:1 body, 3:1 large text).
- Images: WebP, explicit `width` and `height`, `loading="lazy"` below the fold, meaningful `alt` (empty `alt` for decorative).
- No console errors.

## 8. Previewing and verifying

The `redesign` branch is not published. Preview it locally:

```bash
python3 -m http.server 8000   # from the repo root, then open http://localhost:8000
```

Verify visually with screenshots at desktop and phone widths before saying a UI change is done, and say what you checked. Note: headless Chrome cannot go narrower than about 500px, so phone checks need device emulation or a real phone.

## 9. Skills in this repo

Installed for both agents (`.agents/skills`, symlinked into `.claude/skills`):

- `impeccable`: lead design skill (shape, critique, audit, animate, polish, overdrive).
- `gsap-scrolltrigger`: only if the short-pin hero is chosen.

User-level skills worth using here: `review-animations`, `improve-animations`, `emil-design-eng`, `accessibility`, `performance`, `seo`, `schema`, `gsap-core`.

## 10. Explaining work to Mishara

Mishara has an engineering background (not CS) and is learning while building, aiming for an AI/ML or data science role by early 2027.

- Start with where a thing fits in the whole, then detail. Engineering analogies help.
- Short and plain; define jargon the first time. Mishara will ask for depth.
- After a change: two or three lines on what changed, why this approach, and the alternative passed on.
- Add an "In industry" line where it fits, and for significant work one interview-ready sentence including the honest limitation.
- End non-trivial changes with a plain-English summary.
