# MET[Ȧ]CADEMY OF HUMANITY
## Document identity and numbering · v0.1

**Status:** OWNER-DIRECTED WORKING GOVERNANCE · 2026-08-15

## Why this exists

A single global integer sequence has started carrying too many different meanings: publication chronology, research lineage, field manifests and source-derived syntheses. That is how a library quietly becomes a bus station where 005, 006 and 006-something all insist they leave from platform two.

The rule is now: **identity follows provenance before chronology.** Existing integer IDs remain durable historical publication identifiers. New source-derived research series may use their own lineage IDs.

## Global Academy Documents

`003`, `004`, `005`, `006` and any already reserved/publication-candidate integer IDs are never silently renumbered. Document `005` remains **When Time Becomes Relational**. Document `006` remains **M{Y}OGA JYOTISH**. Open review work using `007-011` keeps those branch reservations until Owner review resolves them; this policy does not steal or rewrite them.

## Provenance-based branch IDs

Science Aperture source syntheses use:

`SA<source-number>-<material-number>`

For Science Aperture #004 / Пушка #29:

`SA004-01 ... SA004-10`.

The ID answers two questions at once: which source lineage produced the research note, and which material inside that source is being expanded. It does **not** claim to be the seventh, twelfth or forty-second universal Academy document.

> **ID != CHRONOLOGY.**

> **SERIES ID PRESERVES PROVENANCE; GLOBAL ID PRESERVES PUBLICATION HISTORY.**

## Routes

Global integer documents retain `documents/<NNN>-<slug>/`. Provenance-series research notes use `documents/<series-id-lowercase>-<slug>/`, for example `documents/sa004-01-evidence-arrives-out-of-order/`.

## Registry

`publications/PUBLICATION_REGISTRY.yml` keeps `documents:` for global integer publications and adds `series_documents:` for provenance-based branches. Each series entry records parent source, item number, status, date, paths, checksums and implementation relations.

## Mutation guard

No merge may renumber an already published or Owner-reserved document solely to make the sequence prettier. Gaps are permitted when they preserve lineage. Pretty numbering is cheaper than broken provenance, therefore pretty numbering loses.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
