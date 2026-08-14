# M{Y}OGA JYOTISH · CASE LAB / VALIDATION ENGINE v0.6

**Date:** 2026-08-15  
**Status:** `VERIFIED EXECUTABLE RESEARCH LAYER`  
**Parent:** v0.5 Prediction / Question Engine  
**MSL bridge:** `0.9.1a1`

v0.6 moves from single-case preregistration to corpus validation. It does not declare astrology scientifically validated. It provides machinery that preserves blind conditions, holdout partitions, matched-case contracts, counterexamples and method-specific descriptive outcomes without collapsing them into one truth score.

## Pipeline

```text
CASE PASSPORT
→ PARTITION (TRAIN / HOLDOUT / FUTURE_PREREGISTERED)
→ BLIND BUNDLE + SEALED HIDDEN HASH
→ METHOD SUBMISSION FREEZE
→ REVEAL VERIFICATION
→ CATEGORICAL OUTCOME
→ COUNTEREXAMPLE LEDGER
→ STRATIFIED METHOD COMPARISON
```

## Guards

`BLIND_BEFORE_REVEAL`  
`HOLDOUT != TRAIN`  
`LEAKAGE_INVALIDATES_BLIND_CLAIM`  
`MATCHED_CASES_CONTROL_DECLARED_COVARIATES_ONLY`  
`COUNTEREXAMPLES_ARE_FIRST_CLASS_DATA`  
`NO_UNIVERSAL_TRUTH_SCORE`  
`NO_CROSS_LAYER_AVERAGING`  
`DESCRIPTIVE_RATIOS != PROBABILITIES`

## Blind case seal

Hidden biography/outcome fields are hashed before the reading. A later reveal is accepted as the same hidden payload only when its hash matches the seal. Leakage into the visible bundle invalidates the blind claim instead of being cosmetically downgraded.

## Method tournament

Results are stratified by `methodId × sourceLayer × lensId`. The engine reports categorical counts, resolved coverage, blind-eligible coverage and descriptive support/contradiction ratios. It intentionally does not produce a universal winner.

## Verification receipt

Verified source ZIP SHA-256:

`48335027793a67b520ba5603e9c8af60ccd72af05fa0caecd887e203286be058`

Package size: `11858135` bytes.

The final ZIP was extracted into a clean directory and the complete test suite was run from the extracted package:

- 146 JS test files PASS
- 3 base Python tests PASS
- 58 MSL / M{Y}OGA / DotLinux Python tests PASS
- DOTVM C PASS
- full packaged regression EXIT 0

Drive source artifact ID: `1dTXqEKKblppb3LL8S6zuQ1_8PWR0Ndpd`.

## MSL consequence

The domain-neutral validation mechanisms are promoted into MSL 0.9.1a1 as `BlindCaseSeal`, `ValidationPartition`, `MatchedCaseContract`, `CounterexampleReceipt` and `MethodComparisonReceipt`.

The public Document 006 manifesto remains unchanged.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
