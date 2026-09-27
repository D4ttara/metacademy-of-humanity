# ChatGPT Project stream/routing failure, 2026-09-26

**Status:** controlled A/B observation  
**Surface:** ChatGPT Web, Projects  
**Scope:** cloud/project layer, not local MCP runtime  

## Short version

One ChatGPT Project became effectively radioactive to existing conversations:

```text
same conversation inside Project A → network error / stuck stream
move same conversation to Project B → works
Project A → still broken for other conversations
```

Nothing about the conversation content had to change. The Project boundary did.

That is a much more useful clue than “have you tried restarting the MCP server?”

## Reproduction shape

Inside the failing Project, even a trivial no-tool prompt reproduced the failure.

Observed request/recovery sequence:

```text
POST /backend-api/f/conversation/prepare → 200
POST /backend-api/f/conversation         → 200 after ~55s
stream                                   → ERR_HTTP2_PROTOCOL_ERROR
/backend-api/f/conversation/resume       → 200
later /resume                            → 404
/stream_status                           → IS_STREAMING repeatedly
UI                                       → network error
```

Important negative evidence:

- the trivial prompt did not invoke the local MoH/MCP runtime;
- the MCP backend therefore had nothing to fail on that turn;
- local runtime/tunnel health remained independent of the web-stream failure.

So rebuilding or restarting the local tool stack would have been ritual sacrifice, not diagnosis.

## Strongest A/B isolation

An existing affected conversation was moved out of the failing ChatGPT Project and into a different Project.

Result:

```text
same conversation + different Project → usable immediately
original Project                       → other chats still fail
```

This strongly points toward **Project-level state, indexing, routing, context assembly or stream/session binding** rather than corruption of the conversation itself.

It does not prove which internal subsystem is responsible. We do not have server telemetry and will not invent it because the browser already supplied enough comedy.

## Orphaned stream detail

A previously stuck turn in the failing Project later reported:

```json
{"status":"COMPLETE"}
```

That did **not** restore the Project to health.

So “the old stream eventually says COMPLETE” is not evidence that the enclosing Project state has recovered.

## Diagnostic boundary

The useful operational rule is:

```text
trivial no-tool prompt fails before MCP invocation
+ local MCP/tunnel healthy
+ same conversation works after moving Projects
= do not mutate the healthy local runtime
```

This prevents a cloud routing/indexing bug from turning into an unnecessary local recovery incident.

## Related public threads

OpenAI Apps SDK example issue on developer-MCP capability/state loss:

https://github.com/openai/openai-apps-sdk-examples/issues/230

DownloadConversation lifecycle investigation with captured ChatGPT Web stream/recovery evidence:

https://github.com/Ma-XX-oN/DownloadConversation/issues/157

These are related evidence lanes, not proof that all failures share one root cause.

## What would help from the platform

A supported Project-level recovery primitive would be much more useful than user superstition. For example:

- reindex/rebuild Project context without deleting chats/files;
- reset Project stream/session bindings;
- expose Project health/state diagnostics;
- return a deterministic Project-layer error instead of a generic network error when the transport request itself reached HTTP 200.

The desired invariant:

```text
MOVING A CHAT BETWEEN PROJECTS SHOULD NOT BE THE ONLY AVAILABLE HEALTH CHECK.
```

## Research context

This note is part of **MET[Ȧ]CADEMY OF HUMANITY** work on Human↔AI systems, provenance, observable state and the difference between “a component exists” and “the system can still route to it.”

https://d4ttara.github.io/metacademy-of-humanity/
