# München Wohnung Hunter — ChatGPT App

Private-use ChatGPT/MCP App prototype for apartment hunting in and around Munich.

## What this v0 does

- Renders an inline Wohnung Hunter dashboard in ChatGPT.
- Stores apartment records in an in-memory demo store.
- Supports `new`, `applied`, `documents`, `viewing`, `offer`, `rejected`, and `closed` states.
- Lets the widget change status via buttons.
- Keeps personal applicant data out of the public repository.

## Tools

- `wohnung_dashboard` — read-only dashboard + widget.
- `wohnung_upsert` — add or replace an apartment record.
- `wohnung_set_status` — update status / next action / note.

## Local run

```bash
cd apps/wohnung-hunter-chatgpt
npm install
npm run dev
```

MCP endpoint: `http://localhost:8787/mcp`
Health endpoint: `http://localhost:8787/health`

For ChatGPT testing, expose the MCP endpoint through HTTPS (for example a dev tunnel), then add that HTTPS `/mcp` URL as the app's MCP server.

## Production path

The in-memory map is intentionally temporary. Replace it with a persistence adapter. Preferred private setup:

1. Google Sheet `München Wohnung Hunter – Bewerbungen & Status` remains the operator-facing log.
2. A small backend syncs apartment records to a private database (e.g. Supabase with RLS) or uses Google Sheets API via OAuth.
3. Gmail ingestion stays outside the public client: new landlord/agent mail is parsed, classified, then calls `wohnung_upsert`/`wohnung_set_status`.
4. The widget never receives applicant secrets, identity documents, SCHUFA, Jobcenter PDFs, or OAuth tokens.
5. Any action that sends a message or document should require a separate explicit mutating tool and user confirmation.

## Privacy rule

Do not commit addresses, phone numbers, identity-document data, benefit decisions, SCHUFA files, API keys, OAuth tokens, or landlord correspondence into this repository. Keep them in authenticated storage only.

## Architecture

This follows the MCP Apps pattern used by the official OpenAI examples: an MCP server registers tools plus a `ui://` resource; tools return `structuredContent`; ChatGPT renders the widget and the widget can call MCP tools back through the host bridge.
