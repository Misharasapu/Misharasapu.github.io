#projects/portfolio #learning/web #learning/testing

# 07 Testing, QA and reviewing agent work

## Map

Checks ran at three levels, from fast and visual to slow and independent:

```
Level 1  LOOK          screenshots at 375px and 1280px, animation on, reduced motion, JS off
Level 2  MEASURE       Lighthouse scores, a scripted browser pass over all 11 pages
Level 3  CHALLENGE     a fresh agent that had not seen the build, given only the ledger and the site
```

**Analogy:** inspection on a production line. A visual check at each station, gauges on every part, then an independent quality auditor who does not trust the line's own paperwork.

## Level 1: screenshots

- Headless Chrome (a browser with no window) took screenshots.
- Phone widths were tested by loading the page inside a 375px-wide frame.
- "JS off" was simulated by saving a copy of each page with its scripts removed.

## Level 2: measurement

**Lighthouse** is Google's page auditor. It scores performance, accessibility, best practices and SEO (search visibility).

| Page | Performance (mobile / desktop) | Accessibility |
| --- | --- | --- |
| Home, first run | 87 / 100 | 96 |
| Home, after fixes | 99 / 100 | 100 |
| Fire | 99 / 100 | 100 |

**The scripted pass** (puppeteer, a library that drives Chrome from code) checked every page for:

- Horizontal scrolling at 375, 390, 768 and 1280px
- Console errors and missing files
- Images without width, height or alt text
- Keyboard: pressing Tab through the page, checking every stop shows a focus ring
- Reduced motion: confirming zero animations run
- Every link returning a working page (LinkedIn blocks bots, so its "999" was expected)

## Level 3: the independent audit

A fresh subagent checked 35 claims against your sources: 29 passed, 3 failed and 3 were partly right. It also found a real accessibility bug: focus rings were clipped on tables after their reveal animation. Every finding was fixed and re-tested.

## What failed first time (kept on purpose)

| Failure | Cause | Lesson |
| --- | --- | --- |
| Surname overflowed at 1280px | Font size too large for the column | Test real copy, not placeholder text |
| Captions failed contrast | Dimmed with opacity | Dim with a token colour that still passes |
| Several "new" screenshots were stale | My own script reused old files | Verify the test tool, not just the product |
| Pause looked broken | Comparing screenshots, not pixels | Pick the measurement that matches the question |

## How to review agent work (the habit)

1. **Read the diff, not the summary.** Agents describe what they meant to do.
2. **Trace each change to the request.** Unrequested changes are suggestions, not fixes.
3. **Run it.** A screenshot or test beats "it should work".
4. **Use a second reviewer.** Codex, or a fresh agent with no context, as here. It found my errors because it did not share my assumptions.
5. **Record what failed.** The QA report keeps failures, so the next session does not repeat them.

## Still not done

- No real phone, no Safari, no Firefox test yet.
- The Codex adversarial review failed to run: the configured model is not available on a ChatGPT account. It needs a model change in the Codex setup, then a re-run with `--base 8c77b9c`.

## In industry

- **The terms:** "QA", "regression testing", "accessibility audit", "Lighthouse CI", and "independent verification".
- **In ML work:** the same three levels appear as eyeballing outputs, then metrics on a held-out test set, then external evaluation or red-teaming.

## Check yourself

Why was the independent audit given only the ledger and the site, and not the build history?
