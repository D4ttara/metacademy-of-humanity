# MSL · M{Y}OGA integration · 2026-08-15

**MSL research snapshot:** `0.9.0a1`  
**M{Y}OGA executable layer:** `v0.5`  
**Relationship:** `LABORATORY CASE → DOMAIN-NEUTRAL MSL PROTOCOL`

M{Y}OGA does not become a truth authority over MSL. Its value here is that several epistemic mechanisms were forced into executable form and can therefore be lifted into MSL as reusable contracts.

## Promoted mechanisms

### Source layer is not lens

`source_layer` records where a claim or rule comes from. `lens_id` records how it is being read or projected now. A new lens does not silently rewrite source lineage.

### Immutable overlays

A later layer adds claims, relations, contradictions or supersession receipts. It does not mutate the lower-layer claim in place.

### Evidence Passport v2

Strong claims may carry:

`claim_id / source_layer / lens_id / evidence_class / source_ref / method_id / scope / uncertainty / status / contradictions / derived_from`.

### Precision budget

`ANSWER_PRECISION <= EVIDENCE_PRECISION`.

A request for greater precision than the evidence supports is explicitly capped rather than cosmetically fulfilled.

### Preregistration

A future hypothesis can be frozen before its target window, hashed, and later evaluated without rewriting the original statement or falsification criteria.

### Negative and holdout evidence

Misses, contradictions and unresolved outcomes remain in lineage. Holdout evidence remains separate from fitting/training evidence.

### Deterministic recurrence

Repeated appearance across deterministic projections is descriptive recurrence, not automatically independent evidence.

`DETERMINISTIC_TRANSFORM != NEW_INDEPENDENT_INFORMATION`.

## SamYoga predecessor migration

MSL stores the transition as a `MigrationRecord`: historical identifiers are preserved, the predecessor active identity is closed, compatibility namespaces remain replayable, and canonical active development moves to M{Y}OGA JYOTISH.

This migration follows MSL's wider rule that identity transitions preserve lineage instead of laundering history.

## Relation to MSL 3.0

This integration complements the existing MSL 3.0 pre-textbook architecture: Source Passport, Semantic Capsule, Loss Receipt, RelationFingerprint, Reality Classes, Anti-Laundering, Question Lifecycle and the MSL / Meta.Logic boundary remain intact.

The executable v0.5 bridge adds:

```text
QUESTION PASSPORT
→ PRECISION BUDGET
→ COMPETING + NULL HYPOTHESES
→ FALSIFICATION CONDITIONS
→ PREREGISTRATION HASH
→ TARGET WINDOW
→ OUTCOME
→ NEGATIVE / SUPPORT RECEIPTS
→ CALIBRATION LEDGER
→ NEXT QUESTION
```

MSL 3.0 remains an additive research reference until a separate stable-runtime commit is explicitly declared.
