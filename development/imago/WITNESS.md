# IMAGO Witness

**Status:** `CONCEPT`

IMAGO Witness is a proposed browser-side evidence and provenance tool from **MET[Ȧ]CADEMY OF HUMANITY · Experimental Compute**.

Its first job is not to control the browser. Its first job is to make browser evidence portable, inspectable and harder to accidentally rewrite one turn later.

## User value without IMAGO

Standalone mode should remain useful on its own.

A user can deliberately capture a bounded evidence package from the current page:

- URL and title;
- timestamp;
- selected text or chosen visible region;
- optional DOM fragment and hash;
- visible source/search indicators when detectable;
- screenshot hash and optional screenshot;
- sanitized request metadata when explicitly enabled;
- local notes / event marker;
- export as `receipt.json` and human-readable Markdown.

The output is an observation record, not a declaration that the page is true.

This is useful for AI conversation debugging, reproducible bug reports, research notes, browser experiments, source trails and before/after comparisons.

## Additional value when paired with IMAGO

An optional local pairing layer may add:

- task identity;
- artifact identity;
- provenance chain;
- workspace association;
- planner/executor/verifier role metadata;
- comparison with prior observations;
- attachment to a durable task;
- signed or independently verified receipts;
- governed handoff into local workflows.

The browser extension must not inherit the authority of the private runtime. Pairing is a narrow contract, not a root-access tunnel.

## Proposed shape

```text
Browser
  ↓
IMAGO Witness (MV3)
  ├── local standalone receipt
  └── optional pairing protocol
          ↓
      mock bridge        private IMAGO bridge
          ↓                    ↓
      test/DIY use       richer task + provenance system
```

## Public repository candidate

A future standalone repository can publish:

```text
extension/
schema/
protocol/
mock-bridge/
examples/
tests/
docs/
```

while the privileged IMAGO runtime remains separate.

Working repository name: `imago-witness` or `imago-browser-witness`.

The older working label `MoH Browser Witness` remains useful provenance, but `IMAGO Witness` is semantically cleaner if MoH is treated as the umbrella field rather than the executable runtime.

## Privacy doctrine

Browser content is user data. The design should therefore default to:

- explicit user action to capture;
- minimum Chrome permissions;
- `activeTab` before broad host permissions where possible;
- local-first storage;
- no cookies, passwords or auth headers in receipts;
- no silent history collection;
- no background scraping for unrelated purposes;
- separate opt-in for any network metadata;
- clear deletion/export controls;
- no advertising use of captured browsing data.

A public extension should publish an accurate privacy policy even when sensitive data stays local.

## Evidence doctrine

```text
CAPTURED != TRUE
SOURCE VISIBLE != SOURCE READ
SEARCH BADGE != VERIFIED SEARCH RESULT
HASH MATCH != SEMANTIC TRUTH
RECEIPT != TRUTH
```

Witness records what was observable. Verification belongs to another organ.

## First bounded milestone

`Witness M0` should do only this:

1. capture URL/title/time;
2. capture user-selected text;
3. save a deterministic JSON receipt;
4. calculate hashes locally;
5. export Markdown;
6. expose a mock pairing endpoint;
7. include zero privileged MoH code.

Only after M0 is boring and reliable should we add source-card detection, screenshots, sanitized network observation or IMAGO pairing.

## Licensing direction

For the public implementation, `MPL-2.0` is a candidate because modifications to covered source files remain open while separate backend components do not automatically inherit the same license.

The final license should be chosen before the first public code release, together with trademark/branding terms and a contributor policy.

---

**MET[Ȧ]CADEMY OF HUMANITY · IMAGO Witness**  
Public tool concept. No claim of production maturity.
