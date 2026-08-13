# Knowledge View · schema v0.1

Status: `ACTIVE_RESEARCH / PUBLIC_SAFE`  
Scope: a query/projection over `MOH_METAGRAPH` for concepts, sources, hypotheses, tests and provenance. It is not a second graph root or a claim that the graph contains reality.

Each JSONL node has `id`, `type`, `label`, `status`, `evidence_class`, `provenance` and `limits`. Each edge has `from`, `relation`, `to`, `status` and `reason`.

Allowed evidence classes are `VERIFIED_FACT`, `ENGINEERING_RESULT`, `WORKING_HYPOTHESIS`, `METAPHYSICAL_CLAIM`, `CULTURAL_IMAGE`, and `UNKNOWN`. `METAPHYSICAL_CLAIM` is never promoted to physical fact by graph position.

The view preserves contradiction with `CONTRADICTS` edges and uncertainty with explicit `OPEN`, `PARTIAL`, `NOT_SUPPORTED` and `NOT_YET_TESTED` statuses. Public nodes carry only public-safe provenance; private corpus material remains local and is represented only by an anonymous receipt class.
