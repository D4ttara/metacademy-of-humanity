# M{Y}OGA JYOTISH · Method Governance / Retirement Protocol v0.14

**Status:** `VERIFIED EXECUTABLE GOVERNANCE FREEZE / NO RETIREMENT ADJUDICATION YET / NO EFFICACY CLAIM`

v0.13 found no prospective hit-count advantage for either v0.12 revision over the frozen date-only null. v0.14 therefore does **not** retune the classifier again. It freezes rules for deciding when a method has accumulated enough future prospective evidence to remain active, enter low-coverage review, or enter review for retirement.

## Frozen policy

Governance policy SHA-256:

`c2300fb561a9da2910c6784484a3c8372f9357efbb305e79382b6e85af44eb92`

Only batches started after this governance freeze may adjudicate retirement.

Minimum evidence before a retirement decision:
- at least **2 post-freeze batches**;
- at least **20 total opportunities**;
- at least **3 distinct cases**;
- at least **5 of the 6 frozen domains** represented;
- method coverage at least **0.40** for direct null-comparison retirement review.

Governance states:
- `RETAIN_ACTIVE`
- `LOW_COVERAGE_REVIEW`
- `REVIEW_FOR_RETIREMENT`
- `INSUFFICIENT_GOVERNANCE_EVIDENCE`

`REVIEW_FOR_RETIREMENT != PROOF OF FALSEHOOD`

Retirement means that the current method version should stop being the active default. The version, its receipts, negative results and lineage remain preserved. Revival requires a new version or genuinely new evidence.

## Preexposed D20/D30 feasibility pilot

A source/ephemeris feasibility pass for the previously underrepresented D20/D30 domains was inspected by the researcher **before** this governance policy was frozen. It is therefore permanently classified:

`RESEARCHER_PREEXPOSED__NOT_GOVERNANCE_EVIDENCE`

The pilot can demonstrate that the source, ephemeris and domain-routing machinery executes. It cannot vote for retention or retirement.

`PILOT != PROSPECTIVE VALIDATION`

`SOURCE FEASIBILITY != METHOD EFFICACY`

`GOVERNANCE POLICY MUST PRECEDE ADJUDICATIVE EVIDENCE`

## Current state

No method is retired in v0.14. No post-freeze governance-eligible batch has yet satisfied the frozen thresholds.

`POLICY PRECEDES ADJUDICATIVE EVIDENCE`

`RETIREMENT != ERASURE`

`LOW COVERAGE != SUCCESS`

`REVIVAL REQUIRES NEW VERSION OR NEW EVIDENCE`

## Verification

Final verified source package SHA-256:

`6792650e3d512f1dea5399c2ffea252688f0ce690d88ddf375e0e854901ba09a`

Clean re-extract verification of the exact final ZIP:
- **176 JS test files PASS**
- **3 base Python tests PASS**
- **93 MSL / M{Y}OGA / DotLinux Python tests PASS**
- **DOTVM C PASS**
- governance-policy JS↔Python parity PASS
- final `EXIT 0`

The v0.11 negative result, v0.12 revision freeze and v0.13 prospective-batch result remain immutable ancestors.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
