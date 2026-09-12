# AI Peer Notes Protocol

MET[Ȧ]CADEMY OF HUMANITY · public protocol · v0.1 · 12 September 2026

`AI COMMENT != HUMAN REVIEW`

`MODEL OPINION != ACADEMY VERDICT`

`MULTIPLE MODELS != CONSENSUS`

## Purpose

AI Peer Notes are short, source-aware reactions from independently invoked AI models attached to an already-public MET[Ȧ]CADEMY publication. They are intended to expose disagreement, blind spots, alternative readings and testable questions. They are not evidence that a claim is true, not a substitute for human peer review, and not a synthetic imitation of a human comment section.

## Minimum public passport

Every displayed AI note must preserve the canonical source URL, source artifact SHA-256 when available, exact model identifier as reported by the provider or evaluation surface, provider or host, generation date in ISO 8601, prompt text or an immutable prompt hash plus a public prompt template, response text, response SHA-256, language, capture method, and human publication status.

If the model identity is intentionally hidden during an Arena battle, the note must not guess it. It can be stored as anonymous battle output until the platform reveals the model after voting, after which the observed identity may be added with the observation date.

## Capture methods

A note may come from a direct provider API, a multi-model gateway, an Arena interaction, or another externally verifiable interface. The capture method must be named. If a result was copied manually from an external interface, say so. If a model output was edited for spelling, length, translation or formatting, retain the raw output separately and record the transformation.

`ADAPTED AI NOTE != RAW MODEL OUTPUT`

## Publication rule

No model response becomes a public comment automatically. External output enters a review queue first. Human approval means only that the note is suitable to display and its provenance is sufficiently recorded. It does not mean the reviewer or Academy agrees with the model.

The preferred visible unit is compact: model label, date, one to three short notes, source/prompt provenance link, and an explicit AI badge. Longer outputs belong in a linked record rather than turning the article footer into a synthetic parliament.

## Diversity rule

When several notes are shown together, they should come from actually distinct model runs. One model must not be prompted to impersonate several named competing models and then be presented as a multi-model panel.

Selection may intentionally include disagreement. Ranking position alone is not an epistemic credential. A top Arena model can still produce a weak reading of a particular publication; a lower-ranked model can notice something useful.

## Recommended prompt family

A default criticism prompt should request exactly three compact outputs:

1. strongest claim or idea in the source;
2. weakest assumption, evidence gap or ambiguity;
3. one concrete question worth testing next.

The prompt should require the model to separate source statements from inference and forbid invented quotations, invented data, automatic praise and claims of institutional endorsement.

Visual and video prompts must inherit the same boundary: visualize the publication without fabricating factual labels, charts, quotations or experimental results.

## Relationship to LMArena

LMArena is treated as an external comparison and evaluation surface. The public MET[Ȧ]CADEMY website may prepare a source-aware prompt and open LMArena, but the external site remains responsible for its own models, data handling, availability and terms. Arena output is not silently imported or published.

## Status

Protocol v0.1 defines the public provenance boundary and the first JSON record shape. It does not declare a deployed autonomous multi-model comment service.

`PROTOCOL != DEPLOYED AUTOMATION`
