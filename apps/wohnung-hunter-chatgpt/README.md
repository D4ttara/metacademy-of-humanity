# München Wohnung Hunter — permanent architecture

Wohnung Hunter uses a Google Apps Script bound to the private application-status Sheet as its durable Gmail + Sheets engine. It does **not** depend on Supabase, OAuth Playground, external Google refresh tokens, or a seven-day Google Testing token.

## Production source of truth

- Gmail account: `ievgenkarogod@gmail.com`.
- Google Sheet: `München Wohnung Hunter – Bewerbungen & Status`.
- Bound Apps Script: scans rental mail every 5 minutes and updates the Sheet directly while running as the user's Google account.
- ChatGPT connected Gmail/Drive tools remain available for ad-hoc review, drafting, sending approved replies, document handling, and verification.
- ChatGPT Automation can notify the user about actionable changes without being the ingestion engine.

## Workflow

```text
Rental portals / agents
        ↓
Gmail
        ↓
Google Apps Script (5-minute trigger)
        ↓
Google Sheet (source of truth)
        ├── Apps Script dashboard / quick status buttons
        └── ChatGPT reads Gmail + Sheet through connected tools
```

## Why this architecture

- no Supabase free-tier sleep;
- no Google OAuth Testing refresh-token expiry;
- no OAuth Playground;
- no external Gmail refresh token to maintain;
- Gmail and Sheets permissions are granted once to the bound Apps Script and managed by Google;
- message IDs are remembered so scans are idempotent;
- existing apartment rows are matched by Gmail thread, address, and title before a new row is created;
- generic saved-search alerts are filtered out unless they contain an application/action signal.

## Apps Script

The complete single-file installer/runtime is:

`apps-script/WohnungHunter.gs`

It includes:

- `setupWohnungHunter()` — creates the recurring 5-minute trigger;
- `scanRentalMail()` — scans Gmail and updates the Sheet;
- parser/status detection for Besichtigung, Unterlagen, Mietangebot, Absage, etc.;
- duplicate-message protection;
- Sheet menu `🏠 Wohnung Hunter`;
- dashboard sidebar with quick status buttons;
- `doGet()` so the same dashboard can optionally be deployed later as a private Apps Script web app.

The Sheet is extended non-destructively with technical columns P:R for last Gmail message ID, Gmail thread ID, and last subject. Existing A:O data remains intact.

## ChatGPT App / MCP

The MCP widget remains a UI layer. It must not authenticate directly to Gmail with a Testing refresh token. Any future server bridge should consume the durable Apps Script/Sheet state rather than becoming a second source of truth.

## Privacy

Do not commit applicant address, phone, identity-document data, SCHUFA, Jobcenter decisions, landlord correspondence, API keys, OAuth client secrets, authorization codes, access tokens, or refresh tokens to the repository.

Any action that sends email, uploads documents, confirms a viewing, or accepts a rental offer remains an explicit user-approved action.