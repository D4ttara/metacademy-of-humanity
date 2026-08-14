# M{Y}OGA JYOTISH · Corpus / Benchmark Engine v0.7

**Date:** 2026-08-15  
**Status:** `VERIFIED EXECUTABLE RESEARCH FRONTIER`  
**Lower compatible layer:** Case Lab / Validation v0.6  
**Constitutional parent:** MET[Ȧ]CADEMY Document 006 + `MYOGA_DISCIPLINE_PROTOCOL_v0.1.md`

v0.7 moves validation from isolated case-lab sessions to versioned corpora and repeated benchmark rounds.

## Executable chain

```text
v0.1 Varga
→ v0.2 Relation
→ v0.3 Time
→ v0.4 Experience / Event
→ v0.5 Prediction / Question
→ v0.6 Case Lab / Validation
→ v0.7 Corpus / Benchmark
```

The verified source package SHA-256 is:

`c37792f6359374b5915fb29d2c95c01dc3387c65315db7cacdb9e7cc123a0560`

The final ZIP was extracted into a clean directory and the full regression suite was run from that extracted artifact: **149 JS test files, 3 base Python tests, 62 MSL/M{Y}OGA/DotLinux Python tests, DOTVM C, EXIT 0**.

## New contracts

### Corpus Manifest
A corpus is versioned by explicit case identifiers, source references, consent scope and a content receipt. A corpus is not equivalent to “whatever happens to be in a folder today”.

### Cohort Registry
Inclusion/exclusion criteria and strata keys are frozen and auditable. Excluded cases remain visible in the receipt.

### Deterministic stratified split
Train/holdout allocation is replayable from a declared seed and declared strata. Holdout is never silently merged into training.

### Method Version Pin
A method is identified by:

`methodId + version + sourceLayer + lensId + configHash`.

A configuration change creates a new pin. Longitudinal history does not silently merge changed methods.

### Cross-round leakage audit
A holdout case exposed in an earlier round is not treated as a clean blind holdout in a later round.

### Synthetic twins
Synthetic/transformed twins are stress-test instruments and are **not independent evidence by default**. Their transformations remain explicit.

### Longitudinal benchmark
Repeated rounds preserve descriptive history for each exact method pin. Descriptive ratios are not calibrated probabilities and do not create a universal truth score.

### Hypothesis graveyard
A hypothesis can enter `REVIEW_FOR_RETIREMENT` under a declared multi-round policy. Retirement is not proof of falsehood and never deletes negative history. Revival requires a new version or genuinely new evidence.

## Core guards

`CORPUS_VERSION_PINNED`  
`METHOD_VERSION_PINNED`  
`METHOD_VERSIONS_NEVER_SILENTLY_MERGED`  
`HOLDOUT_EXPOSURE_INVALIDATES_CLEAN_BLIND_CLAIM`  
`SYNTHETIC_TWIN_NE_INDEPENDENT_EVIDENCE`  
`NO_CROSS_LAYER_AVERAGING`  
`NO_UNIVERSAL_TRUTH_SCORE`  
`HYPOTHESIS_RETIREMENT_NE_ERASURE`

## MSL bridge

M{Y}OGA remains a laboratory case, not a fact authority over MSL. The domain-neutral benchmark mechanisms are promoted to the MSL 0.9.2a1 research frontier while the 0.9.1a1 compatibility runtime remains unchanged.

The public manifesto is intentionally not amended by this runtime update.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
