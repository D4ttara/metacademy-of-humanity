# M{Y}OGA JYOTISH · Blind Round v0.11

**Status:** VERIFIED NEGATIVE ROUND · MACHINE-BLIND · RESEARCHER-NOT-BLIND · NO GENERAL EFFICACY CLAIM

v0.10 froze the first non-null M{Y}OGA classifier and deterministic non-astrological null before a new case was selected. v0.11 executes the first preregistered machine-blind round without changing those rules.

## Case and source boundary

Round 1B uses Princess Anne. The birth packet is source-closed from an official exact civil birth time/place source, a separately sourced geographic reference with declared uncertainty, historical Europe/London timezone rules, and canonical Swiss Ephemeris/Lahiri calculation.

The machine path received event dates while event descriptions/domains were withheld until reveal. During source discovery the researcher had already seen semantic biographical information, therefore this round is **not** represented as strict researcher-blind.

`MACHINE BLIND != RESEARCHER BLIND`

## Frozen contestants

Primary:

`MYOGA_VIMSHOTTARI_DOMAIN_CONVERGENCE_V010`

Null:

`NULL_DATE_HASH_DOMAIN_BASELINE_V010`

Method-freeze SHA-256:

`307780dc21d009e1f5a05757472e943caf1422710dac800bc368eba6436ca8fc`

The visible event source precision is day-level. The frozen instant API therefore uses an explicit projection receipt:

`DATE_ONLY_TO_UTC_NOON_V011`

The primary predictions were also checked at 00:00, 12:00 and 23:59:59; their predicted domain sets remained stable for all four events. This sensitivity diagnostic does not create extra source precision.

## Result

Primary M{Y}OGA:

- HIT: **1**
- CONTRADICTION: **3**
- UNRESOLVED: **0**
- frozen verdict: **`NOT_SUPPORTED`**

Frozen null baseline:

- HIT: **1**
- CONTRADICTION: **3**
- UNRESOLVED: **0**
- frozen verdict: **`NOT_SUPPORTED`**

Comparison:

`TIE_ON_HIT_COUNT__NO_DESCRIPTIVE_PRIMARY_ADVANTAGE`

The primary prediction-set sizes were `[1, 5, 2, 4]`, mean `3.0` domains out of six. This is a post-evaluation specificity diagnostic and does not rewrite the frozen verdict.

`HIT != SPECIFICITY`

## What this result means

This round does **not** establish that Jyotiṣa or M{Y}OGA in general is false. It does establish that this exact frozen classifier, on this exact four-event round, did not outperform the frozen null and failed its own descriptive support rule.

The negative result remains in lineage unchanged. A future method version may learn from it, but may not rewrite v0.11.

Final verified source package SHA-256:

`9002c7a410a653ba939ee3ee2f3c240d232d33dd882168a6ec563a3ee5652af8`

Packaged clean-reextract verification:

`163 JS + 3 base Python + 83 MSL/M{Y}OGA/DotLinux Python + DOTVM C`, final `EXIT 0`.

## Guards

`FREEZE PRECEDES CASE`  
`NEGATIVE RESULT STAYS`  
`MACHINE BLIND != RESEARCHER BLIND`  
`SOURCE PRECISION != PROJECTED INSTANT`  
`HIT != SPECIFICITY`  
`ROUND RESULT != GENERAL THEORY VERDICT`

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
