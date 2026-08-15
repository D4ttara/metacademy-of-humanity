# M{Y}OGA v0.16 · Governance Round B / Adjudication Aperture

**Status:** `SECOND POST-GOVERNANCE-FREEZE ELIGIBLE BATCH / ADJUDICATION APERTURE OPEN / VERSION-SCOPED GOVERNANCE DECISIONS / NO EFFICACY CLAIM`

v0.16 does not tune v0.12 methods and does not modify the v0.14 governance policy. It adds the second admissible post-policy-freeze batch and allows the already frozen governance rule to execute for the first time.

## Frozen ancestors
- v0.12 revision freeze: `2badfc6b8215e2892509942e6d8358633d98972ffb3837633100290b66c7f978`
- v0.14 governance policy: `c2300fb561a9da2910c6784484a3c8372f9357efbb305e79382b6e85af44eb92`
- v0.15 parent package: `19eee827e8609174882021e98d871c55e2f5977a135ddf36d2ed9d3bcb6e5f83`

`POLICY PRECEDES ADJUDICATIVE EVIDENCE`

## Source gate and rejected candidate

The first Round B candidate set included Caroline Kennedy. Her case failed the declared ±10 km coordinate-envelope output-stability gate before a prediction seal could be created: the frozen classifier output changed inside the source uncertainty envelope for `CK_JFK_DEATH`. The case was therefore rejected from Round B and contributes **zero governance evidence**.

`SOURCE SENSITIVITY REJECTION != METHOD FAILURE`

`DO NOT NARROW SOURCE UNCERTAINTY AFTER SEEING INSTABILITY`

The sealed Round B corpus is:
- Neil Armstrong;
- John Glenn;
- Jimmy Carter.

Birth times are record-class AA witnesses. Armstrong and Glenn use the source-declared fixed `EST h5w`; Carter uses source-declared `CST h6w`. Generic modern timezone rules do not override those source offsets.

## Round B source-closed opportunities

Neil Armstrong:
- 1962-09-17 NASA Group 2 introduction → `CAREER_STATUS_PUBLIC`;
- 1966-03-16 Gemini VIII → `CAREER_STATUS_PUBLIC`;
- 1969-07-20 Apollo 11 lunar landing/first step → `CAREER_STATUS_PUBLIC`.

John Glenn:
- 1959-04-09 Mercury Seven introduction → `CAREER_STATUS_PUBLIC`;
- 1962-02-20 Friendship 7 → `CAREER_STATUS_PUBLIC`;
- 1998-10-29 STS-95 → `CAREER_STATUS_PUBLIC`.

Jimmy Carter:
- 1946-06-05 U.S. Naval Academy graduation → `EDUCATION_KNOWLEDGE`;
- 1946-07-07 marriage to Rosalynn Smith → `PARTNERSHIP_SPOUSE`;
- 1971-01-12 became Georgia governor → `CAREER_STATUS_PUBLIC`;
- 1977-01-20 presidential inauguration → `CAREER_STATUS_PUBLIC`.

The machine path receives dates but not the domain labels until reveal. Source archaeology exposed event semantics to the researcher, so `RESEARCHER_BLIND = FALSE`; `MACHINE_DOMAIN_BLIND = TRUE` for the sealed batch.

## Stage hashes
- visible batch: `aa613eb6e28a2f82f7daf5d7a7308868c0053a7494148b407715ea3747a578ef`
- prediction seal: `505a8d461428f58361dce1248c4fd25710685aec82607053fbd62d8f6c90f933`
- reveal/result: `c96ceaafc005d72672b0f2c01ea6348f60ed927cf03c03380d60f7df071aadec`
- MSL adjudication receipt: `74cc4a100cb6d1b26b8c4b6ab6f2d811c8cc370c955c1f2c1cfa0de76d60cc9a`

## Round B componentwise result

| Method | HIT | CONTRADICTION | UNRESOLVED | Coverage |
|---|---:|---:|---:|---:|
| v0.10 parent | 3 | 7 | 0 | 1.00 |
| STRICT-A v0.12 | 0 | 0 | 10 | 0.00 |
| PD-B v0.12 | 1 | 2 | 7 | 0.30 |
| DATE-ONLY NULL v0.12 | 1 | 9 | 0 | 1.00 |

The parent remains a legacy comparator and is not a governance candidate.

## Cross-batch governance adjudication

Round A + Round B now satisfy the frozen policy:
- **2 / 2** eligible batches;
- **20 / 20** opportunities;
- **6** distinct cases;
- **6 / 6** frozen domains represented.

### STRICT-A
Aggregate: **1 HIT / 2 CONTRADICTIONS / 17 UNRESOLVED**, coverage **0.15**.

Frozen policy result:
`LOW_COVERAGE_REVIEW`

Decision SHA-256:
`156685f6c66a17207f2ef0ae464792d0c9a0d11013a3e31fb931a653adac8282`

This is not proof the method is false. It says the current version abstains too often to function as an active default under the declared minimum coverage gate.

### PD-B
Aggregate: **2 HIT / 7 CONTRADICTIONS / 11 UNRESOLVED**, coverage **0.45**.
Null aggregate: **1 HIT / 19 CONTRADICTIONS / 0 UNRESOLVED**.

Frozen policy result:
`RETAIN_ACTIVE`

Decision SHA-256:
`d353306b4b256beb71c4611b37cbaef95af1772ae8eb4d372abccfe437b1444f`

`RETAIN_ACTIVE != TRUTH`

The status means only that this version remains an active research candidate under the already frozen v0.14 governance rule. It is not stable canon and not an efficacy proof.

## Guards
`ADJUDICATION APERTURE OPEN != EFFICACY PROOF`
`GOVERNANCE STATUS IS VERSION-SCOPED`
`LOW COVERAGE REVIEW != METHOD FALSEHOOD`
`RETAIN ACTIVE != TRUTH`
`LEGACY COMPARATOR != GOVERNANCE CANDIDATE`
`NO POST-REVEAL METHOD MUTATION`

Final verified source package SHA-256:
`ab5209e220f8868213380d9a00eb9c920f426c0d49182301fb9fd2da37d5d1cb`

Packaged clean-reextract verification:
`185 JS + 3 base Python + 99 MSL/M{Y}OGA/DotLinux Python + DOTVM C`, final `EXIT 0`.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
