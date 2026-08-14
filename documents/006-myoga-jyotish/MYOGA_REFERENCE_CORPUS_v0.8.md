# M{Y}OGA JYOTISH · Reference Corpus / Round 0 v0.8

**Date:** 2026-08-15  
**Status:** `VERIFIED EXECUTABLE RESEARCH FRONTIER`  
**Parent:** v0.7 Corpus / Benchmark Engine  
**MSL reference-corpus frontier:** `0.9.3a1`

v0.8 adds a source-passported reference corpus to the existing benchmark machinery. It does **not** add an astrological efficacy verdict.

## Seed corpus

The v0.8 seed contains:

- 4 `PUBLIC_HISTORICAL` cases;
- 6 `SYNTHETIC_CONTROL` cases;
- 11 Source Passports.

Public seed cases are Elizabeth II, Charles III, Albert Einstein and Marie Curie. Exact assertion-to-source mapping is stored with the executable corpus artifact on the project Drive.

## Source-quality boundary

`OFFICIAL_INSTITUTIONAL_EXACT_TIME` means that an exact civil birth time is published by the named official institution. It does **not** mean a civil birth certificate has been independently inspected by M{Y}OGA.

`DATE_ONLY_OFFICIAL` never becomes exact-time data by interpretation.

High-resolution eligibility requires:

```text
EXACT TIME SOURCE
+ GEO COORDINATES
+ HISTORICAL TIMEZONE RESOLUTION
```

The Royal Family publishes 02:40 on 21 April 1926 in London for Elizabeth II and 21:14 on 14 November 1948 at Buckingham Palace for Charles III. Those two cases therefore have an exact-time source flag, but v0.8 deliberately blocks house/ascendant/D60-sensitive public benchmarking until geography and historical-timezone provenance are separately closed.

Einstein and Curie enter the seed at `DATE_ONLY_OFFICIAL` from NobelPrize.org institutional records and are blocked from exact-time claims.

Synthetic controls may exercise high-resolution machinery because their coordinates/timezones are declared synthetic inputs. They are never counted as independent historical evidence.

## Round 0

Round 0 validates:

- source references;
- corpus/case hashes;
- birth-data quality gates;
- synthetic-control labelling;
- JS/Python parity;
- reproducible package execution.

Round 0 claim boundary:

`CORPUS_AND_PROTOCOL_INTEGRITY_ONLY__NO_ASTROLOGICAL_EFFICACY_CLAIM`.

Therefore:

`CORPUS CONSTRUCTION != DOMAIN VALIDATION`  
`REQUESTED RESOLUTION <= SOURCE-SUPPORTED RESOLUTION`  
`SYNTHETIC CONTROL != INDEPENDENT HISTORICAL EVIDENCE`

## Verified executable receipt

Final source ZIP SHA-256:

`c8bd89e93bbfe2989e6c0899791ca51f401833cdc0d545b553ac673ce010c49a`

Corpus hash:

`a776c2a03385e2b634e83d285f912ba4c71301ea0d13f4386fb10d3e95f1515c`

Round 0 hash:

`c2048574ea455b60eedffd93f36801267099ab7b458a9c4b7cb2b814a3985999`

Packaged regression from a clean re-extract: **152 JS + 3 base Python + 69 MSL/M{Y}OGA/DotLinux Python + DOTVM C, EXIT 0**.

## Namespace migration cleanup

v0.8 also completes a missed implementation detail from the SamYoga → M{Y}OGA migration: canonical Python benchmark implementation now lives under `myoga.benchmark_engine`; `samyoga.benchmark_engine` is a historical compatibility shim only.

The public Manifesto / Document 006 is intentionally unchanged by this runtime update.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
