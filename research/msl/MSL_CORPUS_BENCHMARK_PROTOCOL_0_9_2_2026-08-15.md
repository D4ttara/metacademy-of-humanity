# MSL · Corpus / Benchmark Protocol · research frontier 0.9.2a1

**Date:** 2026-08-15  
**Compatibility runtime:** `0.9.1a1`  
**Research frontier:** `0.9.2a1`  
**Laboratory source:** M{Y}OGA Corpus / Benchmark Engine v0.7

M{Y}OGA does not become a truth authority over MSL. It supplied an executable domain in which several general validation problems became unavoidable. Those mechanisms are promoted here as domain-neutral MSL contracts.

## 1. Corpus Manifest

A research corpus must have a versioned identity, explicit case identifiers, source references and consent/publicity scope where applicable.

`CORPUS VERSION != CURRENT FOLDER CONTENTS`.

## 2. Method Version Pin

A reproducible method identity includes method id, method version, source layer, lens id and configuration hash.

`METHOD ID WITHOUT VERSION/CONFIG != REPRODUCIBLE METHOD`.

Changing configuration creates a new pin. Longitudinal reports do not silently merge different pins.

## 3. Cross-round leakage

Holdout status is historical, not merely local to a file. If hidden/revealed information for a case was already exposed in a prior round, later evaluation cannot call it a clean blind holdout without an explicit contamination receipt.

`HOLDOUT_EXPOSURE_INVALIDATES_CLEAN_BLIND_CLAIM`.

## 4. Synthetic twins

Synthetic, counterfactual or transformed twins can test sensitivity and invariance. They do not become independent evidence merely because they have a new identifier.

`SYNTHETIC_TWIN != INDEPENDENT_EVIDENCE BY DEFAULT`.

## 5. Longitudinal benchmark

A benchmark may accumulate descriptive outcomes across repeated rounds, but exact method pins remain separate.

`METHOD_VERSIONS_NEVER_SILENTLY_MERGED`  
`NO_CROSS_LAYER_AVERAGING`  
`DESCRIPTIVE_SUPPORT_RATIO != CALIBRATED_PROBABILITY`  
`LONGITUDINAL_ASSOCIATION != CAUSAL_PROOF`

## 6. Hypothesis retirement

Repeated negative evidence can trigger an explicit governance state such as `REVIEW_FOR_RETIREMENT` under a declared policy. The receipt preserves round ids, outcomes and method pin.

Retirement is not metaphysical proof of falsehood. It means the current formulation should not remain an unmarked active default.

`HYPOTHESIS_RETIREMENT != ERASURE`  
`REVIVAL_REQUIRES_NEW_VERSION_OR_NEW_EVIDENCE`

## 7. Relationship to earlier MSL layers

This protocol extends, rather than replaces:

- Source Passport / Evidence Passport v2;
- Semantic Capsule and Loss Receipt;
- `SOURCE_LAYER != LENS`;
- immutable overlays;
- precision budgets;
- preregistration;
- negative evidence;
- `TRAIN != HOLDOUT`;
- blind-case sealing;
- matched-case contracts;
- counterexample receipts;
- method comparison receipts.

The resulting validation path is:

```text
SOURCE / CLAIM
→ QUESTION
→ PREREGISTRATION
→ CASE PARTITION
→ BLIND REVEAL
→ CORPUS + COHORT VERSION
→ METHOD PIN
→ BENCHMARK ROUND
→ LEAKAGE AUDIT
→ LONGITUDINAL RECEIPT
→ RETAIN / REVISE / RETIRE WITH LINEAGE
```

No step creates a universal scalar Truth Score.
