#projects/portfolio #learning/web

# 03 Page structure and progressive enhancement

## Map

Every page is complete, readable HTML first. CSS then styles it, and JavaScript then adds motion. Each layer only adds; none of them is needed to read the content.

```
Layer 1  HTML only        all text, numbers, links, figures      -> fully readable
Layer 2  + CSS            colours, layout, fonts                 -> looks right
Layer 3  + JavaScript     hero animation, covers, reveals        -> feels alive
```

**Analogy:** a building's structure, finishes and lifts. If the lift breaks, the stairs still get everyone up.

## How the "JS might fail" rule is enforced

| Thing | Without JS | With JS |
| --- | --- | --- |
| Hero visual | A still image of the final network (`assets/hero-poster.webp`) | The canvas animation replaces it, but only after the first frame has drawn |
| Stage captions | All three are listed as normal text | Highlighted one by one as the animation plays |
| Figures and tables | Visible | JS hides them *only once it has loaded*, then wipes them in as you scroll |
| Hero name | The real name | A decode effect on a separate layer over the real text, which screen readers still read |

**The rule:** JavaScript may only hide something it is about to reveal. That is why `site.js` adds the `reveal-ready` class itself, instead of the HTML starting hidden.

Answer to note 01's question: without `hero.js`, you see the still network image and all three captions. Nothing is lost but the motion.

## The case study template

Every project page has the same skeleton, which is why recruiters can compare projects quickly:

1. Back link, title, one-line outcome
2. **Spec sheet:** context, my part, dates, stack, status, links
3. Hero media: a real figure, or a system diagram for private projects
4. **Metric strip:** 1 to 3 numbers, each saying what it was measured on
5. Problem
6. Approach, with a **Key decision** box
7. Results, with the evaluation context
8. Limitations and next steps
9. Next project link

**Analogy:** a standard test report format. Every report has the same sections, so a reviewer knows where to find the method and where to find the limits.

## Semantic HTML: tags that say what things are

| Tag | Meaning | Why it matters |
| --- | --- | --- |
| `<h1>` to `<h4>` | Heading levels (one `h1` per page) | Screen readers and Google navigate by them |
| `<nav>`, `<main>`, `<footer>` | Page regions | "Skip to content" can jump straight to `main` |
| `<dl>`, `<dt>`, `<dd>` | A list of terms and their values | Used for the spec sheet |
| `<table>` with `<caption>` | Real data | The Fire results are a table, not an image, so they are readable and searchable |
| `<button>` against `<a>` | A button *does* something; a link *goes* somewhere | The hero pause control is a button; the cards are links |

## Private projects

There's no screenshot of private data. Instead, each private project shows an **ordered system diagram** written in HTML (the `.flow` steps). That is evidence of design thinking without exposing anything, and it is honest about the code being private (the "Private code" label).

## In industry

- **The terms:** "progressive enhancement" and "graceful degradation".
- **Accessibility:** semantic HTML is the base of accessibility (often written a11y), which UK public sector and many companies are legally required to meet (WCAG 2.2 AA).

## Check yourself

Why is the confusion matrix on the Fire page built from HTML, rather than a cropped picture from the report?
