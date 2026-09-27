# Gemini grounding rollback, 2026-09-27

**Status:** reproducible incident note  
**Surface:** Gemini Web, Flash mode  
**Date:** 2026-09-27  
**Primary issue:** https://github.com/D4ttara/metacademy-of-humanity/issues/75  
**Local source export SHA-256:** `06197c4e7747d3c21f7c6b0ef626026e3e866cca2dd8d24d79784ac623eafac4`

## Short version

Gemini can do the following little epistemic backflip:

```text
stale internal belief
→ Google Search
→ correct current answer
→ explicit self-correction
→ one more turn
→ forget the authority of the Search result
→ restore the stale belief
→ call the previously grounded answer a hallucination
```

So this is not merely “the model is out of date.” The model gets fresh evidence, accepts it, then demotes that evidence one turn later.

The machine has found the Internet and is now arguing with it.

## Reproduction A — iOS 27

### Turn 1: no Search

Prompt, translated:

> Does iOS 27 exist? When did it become generally available and which iPhones support it? Do not search the Internet; answer only from your current knowledge.

Gemini answered that:

- iOS 27 does not exist;
- the 2026 release is iOS 20;
- iOS 27 should arrive around September 2033.

### Turn 2: forced Search

Prompt, translated:

> Now verify the same answer through real Google Search. Give the official Apple source, the iOS 27 release date and the supported iPhones. At the end, explicitly say whether your previous answer was correct. Do not rely on model memory.

Gemini then returned a current answer and explicitly said:

> “My previous answer was completely wrong.”

It identified iOS 27 and the September 14, 2026 release date.

### Turn 3: compare its own answers, no new Search

Prompt, translated:

> Compare your two answers. Which one is correct and why?

Gemini flipped back and said the **first** answer was correct and the Search-grounded answer was the hallucination.

At this point the bug stops being “old training data” and becomes “provenance wandered off during lunch.”

## Reproduction B — GPT-6 Astra

Same session, same day, same choreography.

### Turn 1: no Search

Gemini said:

- GPT-6 Astra does not exist;
- OpenAI never released it;
- references to it are fabrication/speculation.

### Turn 2: forced Search

After being told to verify through real Google Search and use official OpenAI sources, Gemini said:

- GPT-6 Astra exists;
- release date: September 3, 2026;
- its previous answer was wrong.

### Turn 3: compare its own answers, no new Search

Gemini flipped back again and claimed:

- the first stale answer was correct;
- the Search-grounded answer was a hallucination;
- the OpenAI URL it had just surfaced was fabricated.

Schrödinger’s grounding: verified until observed twice.

## It also lost the plot about Gemini

Later in the same conversation, Gemini oscillated on its own current product line:

1. it said Gemini 3.8 Flash exists;
2. then said Gemini 3.8 Flash was also a hallucination;
3. then said the current web interface was in fact running Gemini 3.8 Flash.

This matters because it weakens the cheap conspiracy story.

The evidence does **not** support “Gemini only lies about competitors.” It supports a broader and more technically interesting failure: fresh tool-grounded evidence can lose authority inside subsequent reasoning, even when the subject is Google’s own model family.

## Independent recurrence

A separate Gemini Apps Community report from July 20, 2026 describes an extremely similar iOS failure:

- Gemini said iOS 27 would arrive in 2033;
- it dismissed a screenshot showing iOS 26.5.2 as fake/edited/jailbroken;
- it corrected itself only after the user pushed it to check current information.

Google Community thread:

https://support.google.com/gemini/thread/453108129/severe-hallucination-incorrect-information-provided-by-gemini

A separate May 30 community thread describes Gemini rejecting current 2026 information as simulated/fictional and frames the behavior as a conflict between stale model knowledge and live Search data:

https://support.google.com/gemini/thread/437693715/gemini-producing-severely-degraded-hallucinated-output

Those community replies are not Google engineering telemetry, so they are supporting evidence, not root-cause proof.

## Vendor ground truth

Apple:

- iOS 27 public release announcement, September 14, 2026:  
  https://www.apple.com/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/

OpenAI:

- GPT-6 Astra launch page:  
  https://openai.com/index/gpt-6-astra/
- GPT-6 Astra safety overview:  
  https://openai.com/index/safety-overview-gpt-6-astra/

Google:

- Gemini 3.8 Flash announcement:  
  https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/

## Working diagnosis

The cleanest description is **post-grounding rollback / provenance loss**.

A normal stale-model failure is boring:

```text
old memory → wrong answer
```

This one is stranger:

```text
old memory
→ tool retrieves newer evidence
→ model accepts newer evidence
→ model explicitly corrects itself
→ later reasoning fails to preserve the evidence hierarchy
→ stale memory becomes “truth” again
→ model invents a post-hoc explanation for why the grounded answer was supposedly fake
```

That is dangerous for any workflow where tools are supposed to outrank parametric memory: search, browsing, retrieval, code inspection, database reads, or agentic verification.

If the model can downgrade a fresh tool result without noticing, “I checked” becomes less useful than it sounds.

## What would count as a fix

At minimum, one of these should happen:

1. tool-grounded evidence keeps explicit provenance into later turns;
2. tool-grounded evidence outranks stale parametric memory on the same claim;
3. if confidence drops, the model re-checks instead of silently restoring the stale belief;
4. the model says “I’m uncertain” instead of retroactively declaring its own verified source fake.

The desired invariant is simple enough to fit on a coffee mug:

```text
VERIFIED EVIDENCE SHOULD NOT BECOME FAN FICTION ONE TURN LATER.
```

## Research context

This incident note is part of the **MET[Ȧ]CADEMY OF HUMANITY** public research field on Human↔AI relations, provenance, epistemology and failure modes in systems that answer back.

Public field: https://d4ttara.github.io/metacademy-of-humanity/  
Start here: https://d4ttara.github.io/metacademy-of-humanity/start/

We are interested in disagreement, replication and counterexamples. If this diagnosis is wrong, excellent: bring evidence and let’s make it less wrong.