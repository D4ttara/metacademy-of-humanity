# M{Y}OGA JYOTISH · Failure-Driven Revision v0.12

**Status:** VERIFIED EXECUTABLE REVISION FREEZE · NO EFFICACY CLAIM

v0.12 preserves the v0.11 negative result unchanged and creates new method versions from an explicit failure diagnosis. It does not repair the old round post hoc.

## Immutable ancestor

Round 1B remains:

- frozen v0.10 primary: `1 HIT / 3 CONTRADICTIONS / NOT_SUPPORTED`;
- frozen v0.10 null: `1 HIT / 3 CONTRADICTIONS / NOT_SUPPORTED`;
- comparison: `TIE_ON_HIT_COUNT__NO_DESCRIPTIVE_PRIMARY_ADVANTAGE`.

`NEGATIVE RESULT STAYS`.

## Failure diagnosis

Observed v0.10 maximum scores were `[2,1,1,1]`; prediction-set sizes were `[1,5,2,4]`, mean `3.0 / 6 domains`. Three of four events therefore had only a single relation-family signal, while the old rule still authorized classification whenever the maximum was greater than zero.

Diagnosis SHA-256:

`1b16d0ff548c4dcf22c9ec823cb22199c23b57efc53b290649b7d338271007c2`

The diagnosis motivates revision; it is not a causal proof.

## Frozen revision candidates

### A · strict MD+AD

`MYOGA_VIMSHOTTARI_DOMAIN_CONVERGENCE_STRICT_V012`

Keeps the parent MD+AD feature families but predicts only when the top domain is unique and `maxScore >= 2`; otherwise returns `UNRESOLVED`.

### B · MD+AD+PD temporal depth

`MYOGA_VIMSHOTTARI_PD_DOMAIN_CONVERGENCE_STRICT_V012`

Adds Pratyantardaśā as a third temporal level and uses typed temporal/sign, lagna-contact and dasha-chain dispositor relations, with the same strict abstention gate. BPHS Ch.51 is a source anchor for nested daśā structure; the combined domain classifier remains explicitly `M{Y}OGA_EXTENSION`.

### Null

`NULL_DATE_ONLY_HASH_DOMAIN_BASELINE_V012`

Uses `SHA256(caseId|YYYY-MM-DD|methodId)` so a day-level source no longer depends on an invented sub-day projection.

## Training replay is not validation

Princess Anne replay is diagnostic only:

- STRICT-A: `1 HIT / 0 CONTRADICTIONS / 3 UNRESOLVED`, coverage `0.25`;
- PD-B: `2 HIT / 0 CONTRADICTIONS / 2 UNRESOLVED`, coverage `0.50`;
- date-only null: `0 HIT / 4 CONTRADICTIONS`.

No winner is selected from this already-revealed case.

`RETROSPECTIVE IMPROVEMENT != PROSPECTIVE VALIDATION`.

## New freeze

Revision freeze SHA-256:

`2badfc6b8215e2892509942e6d8358633d98972ffb3837633100290b66c7f978`

State:

`FROZEN_AFTER_FAILURE_DIAGNOSIS__BEFORE_NEW_UNSEEN_CASE_SELECTION`

Future validation must run both revision candidates and the new date-only null on new cases without method mutation after selection.

Final verified v0.12 source package SHA-256:

`e7c345d823ae9c39ae88578ec5416cce424f8e454d00765a382a1a903f8535fc`

Packaged clean-reextract verification:

`169 JS + 3 base Python + 89 MSL/M{Y}OGA/DotLinux Python + DOTVM C`, final `EXIT 0`.

## Guards

`V011 RESULT REMAINS UNCHANGED`  
`ABSTENTION != SYSTEM FAILURE`  
`FAILURE DIAGNOSIS != CAUSAL PROOF`  
`TRAINING REPLAY != VALIDATION`  
`FAILURE-DRIVEN REVISION REQUIRES NEW FREEZE`  
`DECLARED SUCCESS != VERIFIED RESULT`

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
