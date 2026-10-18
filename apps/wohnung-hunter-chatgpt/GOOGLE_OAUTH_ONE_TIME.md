# DEPRECATED — external Google OAuth bootstrap

This flow is **not used by the production Wohnung Hunter**.

The production architecture is:

```text
ievgenkarogod@gmail.com
        ↓
Bound Google Apps Script
        ↓
München Wohnung Hunter Google Sheet
```

The Apps Script is authorized once inside Google and runs from the user's Google account. It does not require OAuth Playground, a client secret, or a consumer refresh token with a seven-day Testing lifetime.

Do not create or store `GOOGLE_CLIENT_SECRET` or `GOOGLE_REFRESH_TOKEN` for the production Hunter.

If the MCP/server later needs direct read access to the Sheet, use a narrowly scoped service account or a private Apps Script bridge. Gmail ingestion must remain single-source through Apps Script unless the architecture is intentionally changed.
