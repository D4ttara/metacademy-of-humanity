# München Wohnung Hunter — ChatGPT App

Private-use ChatGPT/MCP App for apartment hunting in and around Munich.

## What v0.2 does

- Renders an inline Wohnung Hunter dashboard in ChatGPT.
- Reads/writes the existing Google Sheet `München Wohnung Hunter – Bewerbungen & Status` when private Google OAuth is configured.
- Falls back to an in-memory store if Google is not configured.
- Can scan recent rental-related Gmail messages, classify them as `applied`, `documents`, `viewing`, `offer`, `rejected`, etc., and persist the resulting update.
- Lets the widget change application status via buttons.
- Keeps personal applicant data and OAuth secrets out of the public repository.

## Tools

- `wohnung_dashboard` — dashboard + widget.
- `wohnung_sync_gmail` — scan recent rental Gmail and store detected updates.
- `wohnung_upsert` — add/update an apartment record.
- `wohnung_set_status` — update status / next action / note.

## Local run

```bash
cd apps/wohnung-hunter-chatgpt
cp .env.example .env
npm install
npm run dev
```

MCP endpoint: `http://localhost:8787/mcp`
Health endpoint: `http://localhost:8787/health`

For ChatGPT testing, expose `/mcp` through HTTPS and add that HTTPS MCP URL to the private app/connector.

## Google setup

The app uses a normal Google OAuth refresh token with Gmail + Sheets scopes. Put the credentials only in deployment environment variables, never in GitHub:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
GOOGLE_SHEETS_SHEET_NAME=Wohnungen
```

Recommended scopes for the private account:

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/spreadsheets`

The existing operator sheet schema is preserved. The app uses columns A:O and adds `Score`, `m²`, and `ID` after the original columns so older rows remain readable.

## Gmail ingestion

Default query:

```text
(Wohnung OR Miete OR Besichtigung OR ImmoScout OR Immowelt OR Immomio OR Dawonia OR Everreal OR Vermieter OR Makler) -in:spam -in:trash
```

The parser is deliberately conservative. It recognizes common German phrases for rejection, requested documents, viewing invitations, application receipts, and rental offers. It does not send messages or documents automatically.

## Safety / privacy

Do not commit applicant address, phone number, identity-document data, benefit decisions, SCHUFA files, API keys, OAuth tokens, or landlord correspondence into this repository. The widget receives only apartment/application metadata needed for the dashboard.

Any future action that actually sends an email, uploads documents, confirms a viewing, or accepts a rental offer must be implemented as a separate mutating tool with explicit user approval.

## Architecture

This follows the current MCP Apps pattern: the MCP server registers tools plus a `ui://` resource, data tools return `structuredContent`, ChatGPT renders the widget, and the widget can call MCP tools back through the host bridge.
