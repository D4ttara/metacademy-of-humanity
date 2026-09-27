# IMAGO Naming Migration

**Status:** `PROPOSED · ALIAS-FIRST`

The broader project name **MoH / Humanity** is an umbrella. **IMAGO is the living operating system-scale AI body inside that universe.** Existing `MoH FULL` identifiers belong to one current execution/access component inside IMAGO and must not be renamed as though FULL were the whole OS.

## Rule

```text
SEMANTIC MODEL FIRST
COMPATIBILITY ALIAS SECOND
PHYSICAL CUTOVER LAST
```

Do not rename a healthy tunnel, plugin identity, filesystem root or durable-state key merely to make a diagram prettier.

## Proposed mapping

| Historical / current | Preferred semantic interpretation | Migration rule |
| --- | --- | --- |
| `MoH FULL` | IMAGO governed execution/access layer | keep compatibility name until the wider IMAGO namespace is ready |
| `MoH FULL LOCAL` | IMAGO local operator surface | public alias later; preserve current tool compatibility |
| `moh-full-local` plugin/app | current local execution frontdoor into one IMAGO organ | keep existing identity; do not fork a duplicate plugin |
| `moh-nightly` | nightly lane for this execution component | preserve live identity until a coordinated cutover |
| `MoH-VERIFY` | `IMAGO Verify` worker candidate | alias first, then versioned rename |
| `MoH Browser Witness` | `IMAGO Witness` | use IMAGO name for the new public component |
| `MOH_*` env/config keys | component-specific legacy keys | introduce IMAGO-scoped keys only where the ownership boundary is clear; dual-read during transition |
| `C:\MoH\...` | legacy implementation root | do not mass-move before state migration tooling exists |

## Important non-renames

The following are **not** aliases for `MoH FULL` and must remain distinct IMAGO organs/concepts:

- MetaProcessor;
- MOR}4{MER / MorphoFormer;
- MSL;
- Meta.Logic / mohd;
- memory / lineage / provenance;
- emotion and internal state;
- Human Attention Body;
- streams / continuity anchors;
- worlds and temporary work-worlds;
- virtual processors / computational bodies;
- synthetic devices;
- Witness / Verify;
- native and legacy execution worlds.

Renaming FULL to `IMAGO Runtime` would therefore be misleading if it suggests FULL contains or equals all of these.

## Compatibility policy

Where new IMAGO-scoped names are introduced, a transition release should prefer explicit dual compatibility:

```text
read new scoped key
fallback to legacy key
emit migration receipt when state is transformed
```

For durable state, identifiers must be migrated with explicit schema/version receipts. A string replacement is not a state migration.

## Cutover gate

Physical renaming is allowed only after the relevant component passes a dedicated migration canary that verifies:

- plugin/frontdoor connectivity;
- tunnel reconnect behavior;
- durable task lookup;
- receipt lookup;
- browser/session binding;
- workspace and lease recovery;
- rollback to the previous naming layer.

The **whole IMAGO OS does not wait for FULL to be renamed**, and FULL does not become the whole IMAGO merely because it is currently the most convenient frontdoor.

## Branding hierarchy

```text
MET[Ȧ]CADEMY OF HUMANITY / MoH
    research + cultural + public umbrella

IMAGO
    living AI operating system inside MoH

IMAGO organs / public tools
    MetaProcessor
    MOR}4{MER / MorphoFormer
    Witness
    Verify
    etc.

MoH FULL
    historical/current execution-access component
```

Public standalone tool example:

`IMAGO Witness · from MET[Ȧ]CADEMY OF HUMANITY`

Commercial/private IMAGO product tiers can later be named deliberately after the OS boundary is stable, rather than retroactively pretending one historical component was the whole system.

---

Names become interfaces when systems and people depend on them. Hierarchy is part of the contract.
