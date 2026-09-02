# München Wohnung Hunter — production architecture

Wohnung Hunter is now intentionally built around ChatGPT's connected Gmail + Google Drive tools and ChatGPT Automations. The external Google OAuth/Supabase path is **not** the production dependency.

## Production source of truth

- Gmail account: rental correspondence is read through the user's connected Gmail in ChatGPT.
- Google Sheet: `München Wohnung Hunter – Bewerbungen & Status` is the durable application/status database.
- ChatGPT Automation: checks rental mail hourly, matches messages to apartments, updates the Sheet, and only surfaces actionable changes.
- The separate listing-finder automation continues to search for strong Munich listings.

This architecture has no Supabase inactivity sleep, no Google OAuth Testing refresh-token expiry, and no external refresh token that the user must periodically renew.

## Current production workflow

```text
Rental portals / agents
        ↓
connected Gmail
        ↓
ChatGPT Wohnung Hunter automation
        ↓
Google Sheet (source of truth)
        ↓
ChatGPT dashboard / actions
```

The user can ask `Hunter`, `що по квартирах?`, `перевір відповіді`, etc. ChatGPT reads the same Sheet and Gmail directly. No copy/paste of application data is required.

## MCP widget

The MCP code in this directory remains an **optional UI prototype**, not the authentication/data-ingestion layer. It must not require Supabase or a seven-day Google Testing refresh token for production operation.

Future widget deployment should consume a durable bridge only after there is a connector-native or long-lived authenticated server integration. Until then, Gmail ingestion and Sheet persistence stay inside ChatGPT's connected-tool environment.

## Privacy

Do not commit applicant address, phone, identity-document data, SCHUFA, Jobcenter decisions, landlord correspondence, API keys, OAuth client secrets, authorization codes, access tokens, or refresh tokens to the repository.

Any action that sends email, uploads documents, confirms a viewing, or accepts a rental offer must remain an explicit user-approved action.
