# IMAGO

**Status:** `CONCEPT → INTEGRATION CANDIDATE`

IMAGO is the technical organism inside the broader **MoH / Humanity** field. MoH is the umbrella: books, research, MET[Ȧ]CADEMY, culture, semantic systems, experiments and tools. IMAGO is the machine-side body that turns intent into bounded action, observation, verification and memory.

The current live implementation still contains historical names such as `MoH FULL`. Those names are not renamed in-place here. This document defines the cleaner semantic map first; runtime migration should happen only after contracts are frozen and verified.

## Boundary

```text
MoH / Humanity
├── books / cultural works / research fields
├── MET[Ȧ]CADEMY OF HUMANITY
├── Meta.Logic / semantic work / public research
└── IMAGO
    └── technical organism
```

`MoH != one runtime`

`IMAGO != the whole MoH universe`

That distinction matters because the project already contains many independent `... of Humanity` lines. A technical executable should not monopolize the umbrella name merely because it was the first component to acquire a tunnel.

## Organ map

The present architecture can be read as the following IMAGO organs:

```text
INTENT / IKAR
      ↓
MetaProcessor / Arena
  chooses representation, route, body and sufficient cost
      ↓
Tasks / coordination
  task identity · leases · workspaces · concurrency
      ↓
Body Registry
  interchangeable planner / executor / verifier bodies
      ↓
mohd / Meta.Logic
  authority · policy · durable job state
      ↓
CONTROL
  bounded effects
      ↓
ACCESS / Witness
  observation · read-back · external evidence
      ↓
VERIFY
  independent checking
      ↓
RECEIPT / provenance / memory
      ↓
RETURN / REOPEN / ROLLBACK
      ↓
MOR}4{MER
  body growth only after reuse, minimal repair and verified need
```

A body is not automatically an authority. A transport is not automatically a body. A model family can have several adapters without becoming several different bodies.

## Current implementation mapping

The following mapping is descriptive, not a rename operation:

| Current / historical name | IMAGO interpretation |
| --- | --- |
| `MoH FULL` | IMAGO runtime/spine candidate |
| `FULL LOCAL` | local operator surface |
| `Arena` | routing / experiment / policy plane |
| `MetaProcessor` | representation, route and body selection |
| `Body Registry` | interchangeable model/execution bodies |
| `MCP Tasks` | durable task lifecycle projection |
| `A2A MoH-VERIFY` | first read-only worker/projection canary |
| `mohd / Meta.Logic` | authority + durable control plane |
| `CONTROL` | bounded effect executor |
| `ACCESS` | observation/read plane |
| `Browser Witness` | browser-side evidence/provenance organ |
| `MOR}4{MER` | controlled body growth / morphogenesis |

The names may change later. The contracts should change less often than the names.

## Variable bodies

IMAGO is designed to avoid treating one model as the whole organism.

A task may use different bodies for different roles:

```text
planner  → body A
executor → body B
verifier → body C
```

Examples can include OpenAI/ChatGPT, Gemini through browser or Antigravity adapters, Claude, DeepSeek, deterministic local verification, and future local models. The registry owns declared capability and availability; the task contract owns intent and authority; output becomes evidence, not truth by declaration.

## Reassembly gate

Do not merge every experiment into a superorganism just because all the pieces have names.

IMAGO reaches **Integration Gate M1** when these are simultaneously demonstrated:

1. stable multi-client coordination without losing existing capabilities;
2. durable task lifecycle with explicit identity and terminal states;
3. variable-body routing with adapters separated from body identity;
4. at least one cross-body planner/executor/verifier canary;
5. independent read-only verification returning an artifact and receipt;
6. browser evidence can be captured independently of the main runtime;
7. standalone browser witness can optionally pair through a narrow bridge;
8. effect authority remains separate from model output;
9. read-back verification and rollback remain explicit;
10. contracts, provenance and failure states survive a restart.

At M1, naming and namespace migration can be done deliberately. Before M1, aliases are cheaper than a ceremonial mass rename.

## Public/private boundary

The public surface may include:

- interface and receipt schemas;
- Witness extension;
- pairing protocol;
- mock bridge;
- reproducibility harnesses;
- bounded reference adapters;
- public operator passports where safe.

The private/commercial surface may include:

- full runtime orchestration;
- privileged local execution;
- secure tunnel internals;
- credentials and private connectors;
- authority implementation;
- commercial routing/automation;
- hosted/team synchronization;
- private memory and deployment topology.

`PUBLIC PROTOCOL != PUBLIC ROOT ACCESS`

## Why the distinction exists

MoH is allowed to be enormous. IMAGO is not allowed to pretend that enormity is a single executable.

The useful unit is an organ with a contract, a failure mode and a receipt. The organism comes later.

---

**MET[Ȧ]CADEMY OF HUMANITY · Experimental Compute / IMAGO**
