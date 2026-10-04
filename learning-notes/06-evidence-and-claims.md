#projects/portfolio #learning/evaluation

# 06 Evidence and the claims ledger

## Map

The site makes factual claims (numbers, dates, results). Each one must trace back to a source. The **claims ledger** (`planning/claims-ledger.md`, private, never committed) is the gate between your evidence and the published copy.

```
sources                     ledger                          site copy
reports (PDF)       --->    claim | source+page | status --->  only status V ships
notebooks, READMEs          V verified
live site (your words)      NC needs confirmation  --->  safest true wording, or left out
                            X contradicted         --->  removed
```

**Analogy:** a traceability matrix in safety engineering. Every requirement links to the test that proves it, and an untraced requirement fails the audit.

## How claims were checked

1. The PDFs were turned into text with macOS's built-in PDFKit, using a small Swift script (no installs).
2. Every number on the old site was searched for in its source.
3. Each claim was given a status: V, NC or X.
4. Where a fact was unknown, the safest true wording was used. For example, "Private code" instead of a link, and no job title until you confirm it.

## What it caught (the useful part)

| Old or draft claim | What the source said | What the site says now |
| --- | --- | --- |
| Brompton early model accuracy figure | Not traceable to a model output in the notes | No number; the story is told qualitatively, and Brompton dataset sizes are withheld for confidentiality |
| Brompton "final system prioritises safety" | Demo model is "not a production safety tool" | Two models described honestly |
| Fire "mix beat either source in every phase" (my own error) | Real-only led outdoors with about 5x the real images | Corrected |
| GenAI documents "700 to 1,000 words" (README) | `wc -w`: 714 to 1,896 | Corrected |
| Gas "recovery time improved" | Not in the report | Removed |
| GenAI classifier as a success | 5 test documents, ROC AUC 0.50 (chance) | Shown honestly as a limitation |

## Rules worth keeping for every future project

1. **A metric needs its context:** what it was measured on, the test-set size, and whether it is validation or test.
2. **A target is not a measurement:** "under 8 minutes" stays labelled "Target".
3. **Check the source, not the summary:** the GenAI README was wrong about its own data.
4. **Count before claiming:** a Brompton dataset size first written as "the training set" was really the whole dataset before splitting.
5. **Honest limitations read as judgement:** recruiters trust the Fire page more *because* it shows the model's misses (Fig 4.16).

## In industry

- **The terms:** this is "evaluation rigour" and "data provenance". In ML roles it shows up as model cards, experiment tracking, and reporting a metric with its confidence and dataset split.
- **Why interviewers probe it:** "what was your test set?" is one of the most common follow-up questions after any metric.

## Interview line

"I kept a claims ledger that traced every number on my portfolio to a source and page. It caught my own overclaims, like an accuracy figure that did not match my notes. The limitation is that some Brompton results can't be shown until the company clears them."

## Check yourself

If someone asks "F1 0.984 on what?", what are the three facts you should give in one breath?
