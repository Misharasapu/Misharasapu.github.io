@AGENTS.md

# CLAUDE.md: Claude Code specifics

Rules are in AGENTS.md, how the site works is in ARCHITECTURE.md. This file holds only Claude Code specifics.

## Precedence

Where this file and the user-level ~/.claude/CLAUDE.md conflict, this file wins. Where AGENTS.md and this file conflict, this file wins for Claude Code.

## Skills

- Project skills (`.claude/skills`, symlinked from `.agents/skills`): `impeccable`, `gsap-scrolltrigger`.
- Claude-only design skills to use here: `frontend-design` (plugin), `emil-design-eng`, `design:design-critique`, `design:accessibility-review`, `design:ux-copy`.
- For copy in Mishara's voice: `mishara-voice`, then `humanizer`.
- Use one lead design skill at a time (Impeccable). Do not mix rule sets that contradict each other.
- On its first run Impeccable downloads a launcher binary. If that fails, it says so and reads PRODUCT.md and DESIGN.md directly.

## MCP servers

- `chrome-devtools`: screenshots, device emulation, Lighthouse, performance traces. If it reports the browser is already running, another session holds it; fall back to headless Chrome:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --user-data-dir=<scratchpad>/chr --window-size=1440,2400 --screenshot=<scratchpad>/shot.png http://localhost:8000`
  Run it in the background and kill it after the file appears; it can hang otherwise.
- `context7`: current docs for GSAP, MDN APIs (View Transitions, Canvas, IntersectionObserver). Prefer it over memory for API details.

## Codex

- Mishara also builds with Codex, which reads AGENTS.md. Keep shared rules there, not here.
- `/codex:rescue` can hand a stuck task to Codex. `/codex:review` and `/codex:adversarial-review` are user-triggered only; for substantial changes, remind Mishara to run one.
- Record real review findings in `planning/` and respond to them point by point (see `planning/codex-review-response.md`).

## Memory

Auto-memory lives outside the repo. Do not copy AGENTS.md rules into it. Check that a remembered file or flag still exists before relying on it.
