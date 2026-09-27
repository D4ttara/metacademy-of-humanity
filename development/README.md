# Experimental Development

**MET[Ȧ]CADEMY OF HUMANITY** is not only a place where systems are discussed. Some research questions are better answered by building the smallest thing that can fail in public.

This directory is the public development boundary for experimental tools, protocol sketches, adapters, reproducibility harnesses and reference implementations that grow out of MET[Ȧ]CADEMY research.

## The rule

```text
PUBLIC INTERFACE != PRIVATE CORE
OPEN TOOL != OPEN EVERYTHING
RESEARCH PROTOTYPE != PRODUCT CLAIM
```

We publish enough for other people to inspect, reproduce, criticize, extend or use a tool without pretending that every internal runtime, credential path, deployment detail or commercial component belongs in the same repository.

## What belongs here

Good candidates include:

- small standalone tools that remain useful without the private MoH runtime;
- protocol and receipt schemas;
- browser-side evidence and provenance tooling;
- reproducibility harnesses for Human↔AI failure research;
- bounded adapters that can optionally pair with MoH;
- reference implementations where interoperability matters more than secrecy.

## What does not automatically belong here

Publishing an interface does **not** imply publishing:

- the full MoH FULL runtime;
- owner-bound execution internals;
- private connectors, credentials or deployment topology;
- security-sensitive orchestration logic;
- commercial services built on top of the public interface.

If a public component needs a privileged local companion, that companion should expose the narrowest useful contract. A browser extension should not receive root access because somebody got excited during architecture hour.

## Status vocabulary

Every public development item should say what it is:

- `CONCEPT` — useful enough to write down, not implemented;
- `PROTOTYPE` — works in a bounded environment;
- `RESEARCH CANDIDATE` — reproducible and worth outside testing;
- `STABLE PUBLIC TOOL` — supported public interface with versioned behavior.

A status label is evidence hygiene, not decorative typography.

## Standalone first, MoH-aware second

Where practical, public tools should have two layers:

```text
standalone mode
    → useful by itself

optional MoH pairing
    → richer task identity, provenance, coordination and governed local effects
```

That keeps public tools genuinely reusable while allowing the private MoH stack to provide the heavier machinery.

## Commercial boundary

Open publication and commercial development are not opposites. A public component can create trust, adoption and an interoperability surface while higher-value runtime, team, hosted, connector, governance and support layers remain commercial.

The Academy should publish what benefits from being inspectable. It should not publish a moat merely because GitHub has a green button.

---

**MET[Ȧ]CADEMY OF HUMANITY · Experimental Compute / Development**  
Public field: https://d4ttara.github.io/metacademy-of-humanity/
