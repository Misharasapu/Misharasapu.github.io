#projects/portfolio #learning/web

# 02 Design tokens and the CSS structure

## Map

All the visual decisions sit in one file of named values, `styles/tokens.css`. Every other stylesheet uses those names and never invents its own colours or sizes.

```
tokens.css      the spec sheet: colours, fonts, sizes, spacing, timing
   |
base.css        defaults for every page: body text, links, focus ring, reduced motion
   |
components.css  reusable parts: buttons, cards, spec sheet, metric strip, covers
   |
pages.css       layouts of specific pages: home hero, case study grid
```

**Analogy:** a drawing's title block and material spec. You write "steel grade X" once, and every part references it. To change the steel, you change one line.

## What a token looks like

```css
:root {
  --ice: #6fb8ff;      /* interface: links, buttons, focus */
  --amber: #f5a524;    /* measurement only: metrics, results */
  --dur-hover: 180ms;  /* how long a hover takes */
}

.btn { background: var(--ice); }
```

**The rule:** `--name: value` defines a token, and `var(--name)` uses it. Change `--ice` once and every button, link and focus ring updates.

## The colour roles (a meaning system, not decoration)

| Token | Meaning |
| --- | --- |
| Void, Carbon, Gunmetal | Background, panels, hairlines |
| Frost | Main text |
| Steel | Secondary text (still passes contrast) |
| Slate | Decoration only, never text |
| **Ice** | "You can interact with this" |
| **Amber** | "This was measured" |

This is why the job pipeline's "under 8 minutes" target is **not** amber: it is a target, not a measurement. The colour itself carries an honesty rule.

## How CSS picks which rule wins (the cascade)

There are three rules:

1. **More specific selectors beat general ones:** `.card .title` beats `.title`.
2. **On a tie, the later rule wins.** This is why the files load in a fixed order.
3. **`@media (...)` rules only apply when the condition is true**, for example the screen width, or the user asking for reduced motion.

## Layout in two tools

- **Grid** for two-dimensional layouts (the featured cards, the case study's left heading and right content). See `.featured` in `pages.css`.
- **Flex** for a single row or column of items (the buttons, the header).
- **`clamp(min, preferred, max)`** makes text scale with the screen but stay within limits. The hero name uses it so it fits at 375px and at 1440px.

## Why some things are not hex in CSS

Only two places hold a raw hex colour: the favicon file and the `theme-color` meta tag. Neither can read CSS variables. Both exceptions are logged in `planning/decisions.md`.

## In industry

- **The term:** "design tokens" (sometimes "design system variables").
- **Scale:** big teams share one token set across web, iOS and Android, so the brand stays identical everywhere.
- **Why recruiters care:** it shows you separate decisions from implementation, the same habit as putting config in one place in an ML pipeline.

## Check yourself

If you wanted every amber number on the site to become green, how many files would you edit?
