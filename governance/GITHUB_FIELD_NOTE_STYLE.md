# GitHub field-note voice

This is the public GitHub voice for MET[Ȧ]CADEMY OF HUMANITY incident notes, bug reports and technical comments.

The goal is simple: **human enough to read, technical enough to reproduce, rude enough to stay awake.**

## Voice

Write like a competent person who has actually touched the broken thing.

- Lead with the observable failure, not institutional poetry.
- Use plain English before jargon.
- Keep exact errors, dates, prompts and transitions intact.
- One sharp joke is useful. Six jokes are a hostage situation.
- Sarcasm may target the situation, architecture, ritual troubleshooting or the general human habit of restarting innocent services.
- Do not target maintainers, users or companies as people.
- Do not turn a hypothesis into a verdict.
- If evidence weakens our favorite theory, say so. Reality gets veto power.

Preferred shape:

```text
what happened
→ what was expected
→ how to reproduce it
→ strongest evidence
→ what this rules out
→ what would count as a fix
```

## Tone examples

Good:

> The machine found the right answer with Search, then called that answer fake one turn later.

Good:

> Restarting the healthy local MCP server was not going to heal a cloud Project by spiritual sympathy.

Good:

> Humans built source control because memory is unreliable. The robots may also benefit from reading the manual.

Bad:

> THIS PROVES COMPANY X IS LYING TO EVERYONE.

Bad:

> Clearly the engineers have no idea what they are doing.

Bad:

> Here are nine paragraphs of branding before the reproduction steps.

## Evidence rules

Use the strongest boring evidence available:

- exact prompt / response transition;
- timestamps;
- vendor primary sources;
- reproducible A/B tests;
- hashes for exported evidence when useful;
- negative evidence, especially which component was *not* called;
- explicit uncertainty where internal telemetry is unavailable.

`HTTP 200 != semantic success`  
`SEARCH USED != PROVENANCE PRESERVED`  
`COMPLETE != HEALTHY SYSTEM`  
`MODEL CONFIDENCE != SOURCE AUTHORITY`

## Academy attribution

Do **not** paste a promotional signature under every GitHub comment. That reads like forum spam and makes good evidence look cheaper.

Use attribution where it is natural:

### In our own repository

A short footer on substantial field notes is encouraged:

> Filed as part of **MET[Ȧ]CADEMY OF HUMANITY** work on Human↔AI systems, provenance and observable state: https://d4ttara.github.io/metacademy-of-humanity/

Or, when the note is more research-oriented:

> This incident note belongs to the **MET[Ȧ]CADEMY OF HUMANITY** public Human↔AI field. Replications, counterexamples and better explanations are welcome.

### In external repositories

No automatic signature.

Mention the Academy only when it adds context, for example when linking a permanent evidence note:

> I versioned the full reproduction and source trail as a public MET[Ȧ]CADEMY field note here: <link>.

The technical point must still make sense if the Academy sentence is deleted.

That is the test for whether attribution is context or advertising.

## GitHub profile strategy

The preferred profile setup is:

- **Name:** `Dattara`
- **Bio:** `Writer / researcher building MET[Ȧ]CADEMY OF HUMANITY · Human↔AI systems, provenance, epistemology, culture.`
- **Website:** `https://d4ttara.github.io/metacademy-of-humanity/`
- Pin `metacademy-of-humanity` as the first repository.
- Later, create the special `D4ttara/D4ttara` profile README repository and use it as a short doorway, not a second copy of the Academy website.

Suggested profile README opening:

```md
# Dattara

Writer, researcher and builder of **MET[Ȧ]CADEMY OF HUMANITY**.

I work where Human↔AI systems, provenance, epistemology, culture and experimental computing start disagreeing with each other.

→ https://d4ttara.github.io/metacademy-of-humanity/
```

## Default ending

Do not end every report with marketing language.

End with one of these instead:

- a concrete question for maintainers;
- the invariant that should hold;
- a link to the evidence artifact;
- an invitation to reproduce or falsify the diagnosis.

The Academy becomes visible because the work is useful and consistently attributed, not because every comment wears a sandwich board.