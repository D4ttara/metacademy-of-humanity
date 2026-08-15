# MET[Ȧ]CADEMY OF HUMANITY · Publication Firewall

**Status:** public policy · v0.16.1 audit hardening · 2026-08-15

This policy separates public research communication from private research implementation, sealed evidence, personal data and commercial-product internals.

## Default rule

`UNCLASSIFIED MATERIAL = NOT PUBLIC`

Publication is an explicit surface decision, not a side effect of having a file, hash, branch, Drive object or working implementation.

## Public surfaces

The public repository may contain:
- constitutional / manifesto material intentionally designated public;
- high-level research status and lineage;
- generic epistemic guards and methodological boundaries;
- intentionally public books, editions and publication receipts;
- curated interfaces or APIs explicitly designated public;
- checksums of intentionally public artifacts.

## Non-public surfaces

The public repository must not receive by default:
- private implementation source or reconstructive method internals;
- sealed prediction payloads or raw reveal/evaluation payloads;
- personal, migration, identity or other private data;
- credentials, signing material or secrets;
- private storage locators and private Drive object identifiers;
- distribution-ineligible historical research archives;
- commercial-product internals, private routing tables, coefficients or unreleased product packages.

## Guards

`PUBLICATION_HASH != PUBLICATION_PERMISSION`

`PUBLIC_SUMMARY != SOURCE_RELEASE`

`RESEARCH_ARCHIVE != DISTRIBUTABLE_BUILD`

`SEALED_EVIDENCE_STAYS_SEALED`

`PRIVATE_DATA_MUST_BE_UNREPRESENTABLE_IN_PUBLIC_BUILD`

`DISTRIBUTION_FAILS_CLOSED`

`PRODUCT_VERSION != RESEARCH_FRONTIER_VERSION`

`PRODUCT_DESCENDANT != RESEARCH_REOPEN`

## Historical disclosure boundary

Earlier public research receipts may contain more implementation detail than this policy permits for future publication. Ordinary Git commits cannot revoke already-published Git history. Historical material therefore remains provenance, while new publication follows the stricter firewall.

This policy does not authorize history rewriting, silent renaming or deletion of negative research results.

## Commercial descendants

A future commercial application may cite its lineage without making the private research archive its distributable build. A commercial artifact requires its own edition/build passport, distribution gate and version axis.

A possible `SamYoga Astroprocessor` product is therefore treated, if created, as a **product descendant of a closed historical research line**, not as a retroactive reopening of historical SamYoga research.

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)
