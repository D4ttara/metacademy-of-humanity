# IMAGO Naming Migration

**Status:** `PROPOSED · ALIAS-FIRST`

The wider project name **MoH / Humanity** is an umbrella. The technical organism is **IMAGO**. Existing live runtime identifiers that already work are therefore treated as historical compatibility names until integration is proven.

## Rule

```text
SEMANTIC RENAME FIRST
COMPATIBILITY ALIAS SECOND
PHYSICAL CUTOVER LAST
```

Do not rename a healthy tunnel, plugin identity, filesystem root or durable-state key merely to make a diagram prettier.

## Proposed mapping

| Historical / current | Preferred semantic name | Migration rule |
| --- | --- | --- |
| `MoH FULL` | `IMAGO Spine` / `IMAGO Runtime` | documentation alias now; runtime rename after M1 |
| `MoH FULL LOCAL` | `IMAGO Local` | public alias first; preserve current tool compatibility |
| `moh-full-local` plugin/app | IMAGO local frontdoor | keep existing identity through migration; do not fork a duplicate plugin |
| `moh-nightly` | `IMAGO Nightly` | new display alias allowed; preserve live tunnel identity until cutover |
| `MoH-VERIFY` | `IMAGO Verify` | worker alias, then versioned rename |
| `MoH Browser Witness` | `IMAGO Witness` | use new name for new public component |
| `MOH_*` env/config keys | `IMAGO_*` | dual-read old+new for at least one stable cycle |
| `C:\MoH\...` | implementation root / legacy root | do not mass-move before state migration tooling exists |

## Compatibility policy

A future release may emit the new names while accepting the old names:

```text
read IMAGO_* first
fallback to MOH_*
warn only when migration is safe
```

For durable state, identifiers must be migrated with explicit schema/version receipts. A string replacement is not a state migration.

## Cutover gate

Physical renaming is allowed only after IMAGO Integration Gate M1 and a dedicated migration canary verify:

- plugin/frontdoor connectivity;
- tunnel identity and reconnect behavior;
- durable task lookup;
- receipt lookup;
- browser/session binding;
- workspace and lease recovery;
- rollback to the previous naming layer.

If old and new names cannot coexist for a transition release, the rename is too expensive to perform casually.

## Branding

Public research umbrella:

`MET[Ȧ]CADEMY OF HUMANITY / MoH`

Technical organism:

`IMAGO`

Public standalone tool example:

`IMAGO Witness · from MET[Ȧ]CADEMY OF HUMANITY`

Commercial/private runtime branding can later use `IMAGO` product tiers without changing the meaning of the broader MoH corpus.

---

Names are interfaces once somebody depends on them. Treat them accordingly.
