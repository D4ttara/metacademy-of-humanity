# MoH design canon

Version 1.0 · 2026-09-13

This canon applies across **Memories of Humanity / MoH**, including MET[Ȧ]CADEMY OF HUMANITY, books, field documents, research PDFs, manifesto editions, diagrams and public editorial surfaces. It defines visual and typographic identity, not epistemic status.

## One type family

MoH uses **IBM Plex only** as its canonical type system.

- **IBM Plex Serif** — long-form reading, books, essays, research prose and literary body text.
- **IBM Plex Sans** — headings, navigation, covers, display typography, institutional metadata and interface text.
- **IBM Plex Mono** — code, operators, MSL, technical labels, machine-readable fragments and diagnostic notation.
- When another writing system requires a dedicated script family, use the corresponding **IBM Plex** script family where available, for example IBM Plex Sans Devanagari. A non-Plex fallback is not part of the MoH visual canon.

`MOH TYPOGRAPHY == IBM PLEX FAMILY`

Do not introduce Linux Libertine, Noto, PT, Times, Georgia or other families into a MoH publication merely because they look bookish or happen to be installed. A technical fallback may exist only as an implementation emergency and is not a canonical design choice.

## Primary book trim

The primary MoH long-form print / PDF trim is **6 × 9 in** (152.4 × 228.6 mm), following the North-American trade-book tradition rather than DIN office-paper logic.

Use 6 × 9 for:

- canonical MoH books and novels;
- substantial MET[Ȧ]CADEMY long-form research editions;
- M{Y}OGA, Meta.Logic, Metanautics and comparable book-scale works;
- substantial personal or research portraits intended to read as books rather than reports.

**5 × 8 in** is the preferred compact secondary trim for manifesto editions, field books, portable philosophical texts and short intellectual works.

**B6** may be used deliberately for a small artifact / pocket edition when its physical intimacy is part of the object. It is not the default MoH book trim.

**A4 and A5 are not MoH brand formats.** They may still be used for utility exports, forms, handouts, office printing, proofs or source packets when the task itself requires them. Their presence is functional, not canonical.

`FORMAT FOLLOWS ARTIFACT`

`PRIMARY LONG-FORM TRIM == 6 × 9 IN`

## 6 × 9 typography baseline

The exact setting is tuned to the work, but the default long-form starting point is:

- body: **IBM Plex Serif 9.75–10.25 pt**;
- reference setting: **9.95 pt / 13.35 pt leading**;
- leading usually about **1.30–1.36 ×** the body size;
- measure: roughly **55–75 characters per line**, preferably around 60–70 for continuous reading;
- restrained paragraph spacing; continuous prose normally uses first-line indents rather than large web-style gaps;
- justified text with competent hyphenation and microtypography when the renderer supports it;
- headings: IBM Plex Sans, clearly quieter than poster typography inside the book;
- code / operators: IBM Plex Mono.

Do not solve a weak page by simply enlarging type until every two paragraphs require another page. Page rhythm is produced by trim, measure, margins, leading, paragraph treatment and hierarchy working together.

## Page architecture

MoH books should read as books, not as slide decks or departmental reports.

- Cover is a distinct object.
- Do **not** place a second full pseudo-cover immediately after the cover.
- After the cover, use either a restrained half-title / title page when genuinely useful, or move directly into dedication, note, introduction or opening text.
- Running heads do not appear on the cover and normally stay off title / half-title / dedication / opening front-matter pages.
- Major parts may start on a new page; minor headings should not manufacture large deserts of white space.
- Prevent widows, orphans, clipped headings and one-line page spillovers.
- A short paragraph is allowed because rhythm belongs to the writing, but the layout must not amplify every short paragraph into a screen-like card.

## American editorial direction

For book-scale MoH work, the reference mood is **North-American trade-book / research-editorial design**: readable, confident, dense enough to sustain immersion, restrained enough to let the text carry authority.

Avoid accidental DIN-report aesthetics: oversized body type, wide B5/A4 measures, repetitive title blocks, early running headers and excessive vertical spacing can make a book feel like a formatted memo even when the content is strong.

This is not a command to imitate a specific publisher. It is a design posture: editorial hierarchy, readable measure, calm margins, strong opening pages and a clear distinction between cover, front matter and body.

## Diagrams and infographics

Diagrams belong to the same IBM Plex system.

- Use IBM Plex Sans for labels and titles, IBM Plex Mono for technical notation when useful, and IBM Plex Serif for explanatory captions.
- Prefer a few explanatory diagrams that compress a real relation over decorative astrology wallpaper.
- Every diagram must distinguish measured / calculated content from interpretive or conceptual structure.
- Infographics should support the argument, not interrupt reading every second page.

## Web and screen

The 6 × 9 rule is a print / fixed-page baseline, not a CSS viewport rule.

On the MoH / MET[Ȧ]CADEMY site:

- interface, navigation and display layers may use IBM Plex Sans;
- long-form reading surfaces should prefer IBM Plex Serif where it improves sustained reading;
- IBM Plex Mono remains the technical / machine / operator layer;
- script-specific support should remain inside the IBM Plex family where available.

Responsive screen typography follows screen constraints while preserving the same family roles and hierarchy.

## Inheritance

MET[Ȧ]CADEMY OF HUMANITY inherits this MoH design canon. Individual projects may vary color, density, cover language and diagram style, but typography and publication logic should remain recognizably part of one system.

A legacy artifact is not automatically rebuilt only to satisfy a later rule. New or substantially rebuilt editions follow the current canon.

`CONSISTENT DNA != IDENTICAL OBJECTS`

`LEGACY ARTIFACT != DESIGN PRECEDENT`
