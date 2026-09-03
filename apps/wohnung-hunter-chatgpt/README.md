# München Wohnung Hunter — permanent architecture

Wohnung Hunter uses a Google Apps Script bound to the private application-status Sheet as its durable Gmail + Sheets engine. It does **not** depend on Supabase, OAuth Playground, external Google refresh tokens, or a seven-day Google Testing token.

## Production source of truth

- Gmail account: `ievgenkarogod@gmail.com`.
- Google Sheet: `München Wohnung Hunter – Bewerbungen & Status`.
- Bound Apps Script: scans rental mail every 5 minutes and updates the Sheet directly while running as the user's Google account.
- ChatGPT connected Gmail/Drive tools remain available for ad-hoc review, drafting, sending approved replies, document handling, and verification.
- ChatGPT Automation notifies about actionable changes but is not the ingestion engine.

## Workflow

```text
Rental portals / agents
        ↓
Gmail
        ↓
Google Apps Script (5-minute trigger)
        ↓
Google Sheet (source of truth)
        ├── Apps Script status/dashboard
        ├── ChatGPT verification + approvals
        └── future Portal Runner
                 ↓
        ImmoScout / Immowelt / Kleinanzeigen / Immomio / EverReal
```

## Parser v0.3

The Apps Script parser now deliberately distinguishes:

- application/contact confirmation → `Warten auf Prüfung`;
- missing fields / forms / SCHUFA / documents → `Aktiv – Zusatzangaben / Unterlagen`;
- actual viewing invitation with a concrete invitation/booking signal → `Besichtigung`;
- offer / contract / acceptance → `Mietangebot / Zusage`;
- rejection / already rented → `Abgelehnt`;
- ordinary landlord reply → `Neu / Antwort prüfen`.

This avoids the previous false positive where the applicant's own sentence such as “Über einen Besichtigungstermin würde ich mich freuen” was interpreted as an invitation.

The parser also prefers listing-specific data sections before provider/footer data, so addresses such as ImmoScout's Invalidenstraße 65 or Immowelt/AVIV's Ostendstraße 113 are not treated as apartment addresses. It extracts Scout-ID / Immowelt Online-ID where available and uses those IDs plus Gmail message/thread IDs for stronger deduplication.

After a parser upgrade use the Sheet menu:

`🏠 Wohnung Hunter → Letzte 7 Tage neu auswerten`

This reparses recent messages even if they were already seen and repairs existing Gmail-backed rows by message ID, Gmail thread ID, and portal object ID.

## Apps Script

The complete single-file installer/runtime is:

`apps-script/WohnungHunter.gs`

It includes:

- `setupWohnungHunter()` — stores the bound Sheet ID in Script Properties and creates the recurring 5-minute trigger;
- `scanRentalMail()` — scans Gmail and updates the Sheet;
- `reprocessRecentRentalMailManual()` — repairs/reclassifies the last seven days;
- parser/status detection for application confirmations, Zusatzangaben, Besichtigung, Mietangebot and Absage;
- duplicate-message protection and portal-ID matching;
- Sheet menu `🏠 Wohnung Hunter`;
- a deliberately simple one-file dashboard that is safe to paste into Apps Script;
- `doGet()` so it can optionally be deployed later as a private Apps Script web app.

The Sheet uses technical columns P:R for last Gmail message ID, Gmail thread ID, and last subject. Existing A:O data remains intact.

## Portal Runner — next layer

The next layer is a browser automation worker with separate adapters for:

- ImmoScout24;
- Immowelt;
- Kleinanzeigen;
- Immomio / EverReal / Dawonia.

It should reuse authenticated browser sessions and write results back to the central Sheet. It must not bypass CAPTCHA or 2FA. Those states become `Needs human`.

Recommended approval policy:

- `AUTO`: ordinary first-contact applications with already approved profile data;
- `ASK`: SCHUFA, passport/ID, Jobcenter decisions, financial documents, unusual questions;
- `NEVER AUTO`: rental contract, paid services, binding financial commitment, final acceptance of a rental offer.

The runner and server may authenticate to each other with a private shared secret/HMAC stored only in deployment secret storage. Portal APIs can be used opportunistically when officially available, but browser adapters are the baseline because private-user messaging APIs are inconsistent across portals.

## ChatGPT App / MCP

The MCP widget remains a UI and approval layer. It must not authenticate directly to Gmail with a Testing refresh token. The older external Google OAuth bootstrap document is retained only as a deprecation notice.

Any future server-side Sheet reader should use a narrowly scoped service account or a private Apps Script bridge. It must not become a second Gmail ingestion engine.

## Privacy

Do not commit applicant address, phone, identity-document data, SCHUFA, Jobcenter decisions, landlord correspondence, API keys, OAuth client secrets, authorization codes, access tokens, refresh tokens, browser cookies, or portal session storage to the repository.

Any action that uploads sensitive documents, confirms a viewing, accepts a rental offer, or creates a binding financial commitment remains user-approved.
