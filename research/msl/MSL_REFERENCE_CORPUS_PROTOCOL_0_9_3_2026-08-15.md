# MSL · Reference Corpus Protocol 0.9.3 · 2026-08-15

**Compatibility runtime:** `0.9.1a1`  
**Benchmark frontier:** `0.9.2a1`  
**Reference-corpus frontier:** `0.9.3a1`  
**Laboratory source:** M{Y}OGA Reference Corpus / Round 0 v0.8

M{Y}OGA remains a laboratory case, not a truth authority over MSL. v0.8 forces a domain-neutral distinction between **having a source** and **having enough source quality for a requested resolution**.

## New MSL receipts

### SourceQualityGate

Records the source identity, source class, explicit assertions supported by that source, and the maximum declared resolution that source can justify.

### ReferenceCaseReceipt

Records case identity, case kind, birth/source quality class, high-resolution eligibility and source references without rewriting the underlying source.

### ResolutionEligibilityReceipt

Applies the invariant:

`REQUESTED_RESOLUTION <= SOURCE_SUPPORTED_RESOLUTION`.

If a method requires a higher resolution than the case sources support, the case is excluded from that method stratum rather than cosmetically upgraded.

### SyntheticControlReceipt

Synthetic cases remain useful for machinery, boundary and leakage tests, but:

`SYNTHETIC_CONTROL != INDEPENDENT_HISTORICAL_EVIDENCE`.

### CorpusIntegrityRoundReceipt

A corpus-integrity round can verify source references, hashes, case identities, quality gates and runtime parity. It cannot by itself validate the domain hypothesis for which the corpus may later be used.

`CORPUS_CONSTRUCTION != DOMAIN_VALIDATION`.

## Relationship to earlier MSL layers

The 0.9.3 frontier composes with existing:

- Source Passport / Semantic Capsule / Loss Receipt;
- Evidence Passport v2;
- immutable overlays;
- precision budgets;
- preregistration;
- blind/holdout validation;
- corpus manifests and method-version pins;
- cross-round leakage and hypothesis-retirement receipts.

The new layer adds a quality gate **before** a method receives a case.

## Compatibility

`imago_msl.__frontier_version__` remains `0.9.2a1` for existing consumers. The new additive field is `__reference_frontier_version__ = 0.9.3a1`.

This is deliberate lineage preservation, not a versioning accident.
