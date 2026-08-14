# MSL 0.9.1a1 · Blind / Holdout Validation Protocol

**Date:** 2026-08-15  
**Originating laboratory case:** M{Y}OGA JYOTISH Case Lab v0.6  
**Status:** `ADDITIVE RESEARCH SNAPSHOT / NOT STABLE RUNTIME DECLARATION`

M{Y}OGA v0.6 forced several validation mechanisms into executable form. MSL promotes the domain-neutral parts while keeping the originating astrological domain separate from the protocol itself.

## 1. BlindCaseSeal

A blind evaluation may expose only the declared visible payload. Hidden biography, outcome labels or other answer-bearing fields are sealed before the reading with a reproducible hash.

A later reveal is accepted as the same hidden payload only if it reproduces that seal.

`BLIND_BEFORE_REVEAL`  
`LEAKAGE_INVALIDATES_BLIND_CLAIM`

## 2. ValidationPartition

Cases explicitly carry one of:

- `TRAIN`
- `HOLDOUT`
- `FUTURE_PREREGISTERED`
- `UNASSIGNED`

A holdout case cannot silently become fitting evidence after the result is known.

`HOLDOUT != TRAIN`

## 3. MatchedCaseContract

A matched set records the covariates being controlled. Matching on declared covariates does not imply that cases are identical in every other respect.

`MATCHED_ON_DECLARED_COVARIATES != IDENTICAL_CASE`

## 4. CounterexampleReceipt

`NOT_SUPPORTED` and `CONTRADICTED` outcomes are first-class records. They are not deleted, folded into ambiguous success, or hidden from later method summaries.

`COUNTEREXAMPLE != TRASH`

## 5. MethodComparisonReceipt

Method comparison remains stratified by method, source layer and lens. MSL may report categorical counts, coverage and descriptive ratios, but it does not collapse different epistemic layers into a universal truth score.

`SOURCE_LAYER != LENS`  
`NO_CROSS_LAYER_AVERAGING`  
`DESCRIPTIVE_RATIO != PROBABILITY`  
`METHOD_COMPARISON != UNIVERSAL_TRUTH_SCORE`

## 6. Generality

These contracts can be used beyond astrology: semantic migration tests, translation evaluation, AI comparisons, cultural classification, human-subject reading experiments, and other domains where answer-bearing evidence must be hidden until after a frozen response.

M{Y}OGA is therefore a laboratory case for MSL, not an authority over it.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
