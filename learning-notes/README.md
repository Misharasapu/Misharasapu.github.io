#projects/portfolio #learning/web

# Learning notes: how the portfolio redesign was built

These notes explain how the Signal redesign works, from the whole system down to the details. Read them in order; each one starts with a map.

## The whole system on one page

```
  YOU (content and decisions)
        |
        v
  EVIDENCE LAYER        reports, notebooks, READMEs  ->  claims ledger (the gate)
        |
        v
  STRUCTURE LAYER       HTML pages: real text, real numbers, real links
        |
        v
  APPEARANCE LAYER      CSS: tokens -> base -> components -> pages
        |
        v
  MOTION LAYER          JavaScript: hero, covers, reveals (optional extras)
        |
        v
  CHECK LAYER           screenshots, Lighthouse, scripted QA, independent audit
        |
        v
  DELIVERY              GitHub Pages serves the files to the browser
```

**Engineering analogy:** a machine on a drawing board.
- The evidence is the test data.
- The HTML is the frame.
- The CSS is the finish and paint spec.
- The JavaScript is the motors.

The machine has to stand up and be usable with the motors switched off. That rule, called **progressive enhancement**, shapes every decision below.

## The notes

| File | Layer | What you will understand after |
| --- | --- | --- |
| [01-how-a-static-site-works.md](01-how-a-static-site-works.md) | Delivery | What happens between typing the URL and seeing the page, and why there is no server or build step |
| [02-design-tokens-and-css.md](02-design-tokens-and-css.md) | Appearance | How one file of variables controls the whole look, and the four-layer CSS structure |
| [03-page-structure.md](03-page-structure.md) | Structure | How the HTML is laid out, the case study template, and why everything works without JavaScript |
| [04-the-hero-animation.md](04-the-hero-animation.md) | Motion | How 2,400 points morph from a bike to data to a network |
| [05-covers-and-small-motion.md](05-covers-and-small-motion.md) | Motion | Project covers, hover brackets, reveals, and the reduced-motion rules |
| [06-evidence-and-claims.md](06-evidence-and-claims.md) | Evidence | The claims ledger, and why it matters more than the animation |
| [07-testing-and-qa.md](07-testing-and-qa.md) | Check | How the site was verified, what failed first time, and how to review agent work |

## Five rules that generate most of the decisions

1. **Content first, effects second.** If JavaScript fails, nothing is lost but the motion.
2. **One source of truth per thing.** Colours live in one file, claims in one ledger, page structure in one template.
3. **Animate only `transform` and `opacity`** (and `clip-path` for reveals). These are cheap for the browser to change.
4. **Motion must stop or be stoppable within 5 seconds**, and turns off for anyone who asks their device for reduced motion.
5. **No claim without a source.** A target is labelled as a target.

## Interview line for the whole project

"I rebuilt my portfolio as a static site where every claim is traced to a source in a claims ledger, with animation layered on top so the content works without it. An independent audit caught three of my own overclaims, which I fixed. The honest limitation is that I have only tested it in Chrome, not on real phones yet."
