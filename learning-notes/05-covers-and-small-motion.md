#projects/portfolio #learning/web #learning/animation

# 05 Project covers and the small motion

## Map

Apart from the hero, all motion is small, fast and triggered by something you do. It is built from CSS animations switched on by adding one class, plus a tiny JavaScript "controller" that decides when to add it.

```
covers.js (the controller)            CSS (the animation)
  mouse: hover or keyboard focus  -->   card gets class "is-playing"  -->  keyframes run
  touch: most visible card, once  -->   (only one card at a time)
  reduced motion: never           -->   nothing plays, poster shows
```

**Analogy:** a PLC (programmable logic controller) and actuators. The controller only decides which actuator fires and when; each actuator knows its own motion.

## The cover rule that makes everything simple

**A cover at rest is its final frame.** Playing just replays the build-up to that frame.

This one rule covers four situations at once:

| Situation | What you see |
| --- | --- |
| Reduced motion | The final frame |
| No JavaScript | The final frame |
| The mouse leaves mid-play | It snaps to the final frame, with no broken half state |
| After it plays | The final frame |

## How a cover is drawn: SVG

**SVG** (Scalable Vector Graphics) is pictures made of shapes written as code: `<circle>`, `<rect>`, `<path>`. It stays sharp at any size, and CSS can animate each shape.

The Fire cover is the exception. It uses your real report image and its Grad-CAM, because real evidence beats an illustration.

## The shared template: a small set of building blocks

Six covers are built from the same primitives (`styles/components.css`):

| Class | Motion | Used for |
| --- | --- | --- |
| `cv-draw` | A line draws itself | Pipes, curves, CV lines |
| `cv-pop` | Scales up from nothing | Dots, tiles, boxes |
| `cv-grow` | Bar grows from the left | Score-style bars |
| `cv-rise` | Slides up and fades in | Document chunks |
| `cv-drift-a` to `-d` | Drifts in from four directions | Words gathering into topics |
| `d1` to `d10` | Delays from 0.15s to 2.1s | Sequencing the steps |

**The rule:** pick a motion class plus a delay class, and you have choreography with no new code. For example, `class="cv-pop d4"` means "pop in at 0.6s".

**How the line-drawing trick works:** set `pathLength="1"` on the path, make the dash one unit long, then slide the dash offset from 1 to 0. The line appears to draw itself.

## The other small motions

| Motion | Where | Time | Note |
| --- | --- | --- | --- |
| Focus brackets | Card hover, mouse only | 180ms | Amber corners. A frame, not a detection claim |
| Button press | All buttons | 120ms | `scale(0.97)`, so it feels physical |
| Figure reveal | Case study figures below the fold | 600ms | `clip-path` wipe, once, then the clip is removed so focus rings show |
| Caption highlight | Hero stage list | 400ms | Colour change, not opacity (opacity broke contrast) |

## Why only `transform`, `opacity` and `clip-path`

The browser builds a page in three stages: layout (where boxes go), paint (filling pixels) and composite (stacking layers).

- Changing `width` or `top` re-runs **layout** for the whole page, which is slow and janky.
- Changing `transform` or `opacity` only re-runs **composite**, which is cheap and smooth.

One bug caught in this build: the Fire cover's scan line first animated `left`, a layout property. It was rewritten as `transform: translateX`.

## Hover only where hover exists

```css
@media (hover: hover) and (pointer: fine) { .card:hover ... }
```

Phones have no hover. Without this guard, a tap can leave a card stuck in its hover state. The independent audit caught one place (the nav links) that had escaped this rule.

## In industry

- **The terms:** "micro-interactions", "motion design system" and "compositor-only animation".
- **Respecting reduced motion:** honouring the user's setting is part of WCAG, and it is expected in professional front-end work.

## Check yourself

Why would a cover that rested on its *first* frame (blank) be worse when reduced motion is on?
