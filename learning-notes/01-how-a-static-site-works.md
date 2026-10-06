#projects/portfolio #learning/web

# 01 How a static site works

## Map

A static site is a folder of finished files. GitHub Pages hands them to the browser exactly as they are, and the browser does all the assembly.

```
browser asks for /fire-detection.html
        |
GitHub Pages sends the file (no thinking, just delivery)
        |
browser reads the HTML, sees it needs:
   styles/*.css  ->  fetches, applies
   scripts/*.js  ->  fetches, runs after the page is readable (defer)
   images, fonts ->  fetches as needed
        |
page on screen
```

**Analogy:** a printed brochure posted to someone, against a vending machine that makes each item on demand. A static site is the brochure: everything is finished before it is sent.

## The three file types, as three rules

| File | Rule | Example in this repo |
| --- | --- | --- |
| HTML | **What it is** (content and meaning) | `index.html`, `brompton.html` |
| CSS | **How it looks** (colour, size, layout) | `styles/tokens.css` and friends |
| JS | **How it behaves** (anything that changes after load) | `scripts/hero.js` |

If you ever wonder where a change belongs, ask: is it content, look, or behaviour?

## Why no framework or build step

- **What a framework is:** a system such as React or Next.js (used for Wildcat) that generates HTML from code. You need it when pages share lots of live logic.
- **What a build step is:** a program that turns your source into the final files before upload.
- **Why we skipped both:** a portfolio is about 11 pages of mostly fixed content, so both would add moving parts with little benefit.

The one exception was this session: the case study pages were *generated once* by a throwaway Python script to avoid copy-paste errors. The repo only holds the finished HTML. That gives the benefit of a template without a build step to maintain.

## Where things live

```
index.html, <project>.html      pages (old URLs kept, they are in sent applications)
styles/                         tokens.css, base.css, components.css, pages.css
scripts/                        site.js, hero.js, covers.js
assets/figures/<project>/       WebP figures from your reports
assets/*.pdf                    project reports
_config.yml                     tells GitHub Pages which files NOT to publish
```

## In industry

- **The term:** "static site" or "JAMstack".
- **Hosting:** teams host these on CDNs (content delivery networks: copies of your files on servers around the world). Vercel and Netlify are the common choices, and give each branch its own preview link.

## Check yourself

What would happen to the site if `scripts/hero.js` failed to download? (Answer in note 03.)
