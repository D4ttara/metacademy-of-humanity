# One-time Google OAuth setup

This private app needs its own Google OAuth credentials at runtime. The ChatGPT Gmail/Drive connectors used in the conversation cannot be exported into the app.

1. In Google Cloud Console, create/select a project for Wohnung Hunter.
2. Enable **Gmail API** and **Google Sheets API**.
3. Configure OAuth consent for the private Google account.
4. Create an OAuth client (Web application or Desktop app for the initial token bootstrap).
5. Authorize only these scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/spreadsheets`
6. Obtain a refresh token and save the client ID, client secret, and refresh token only as deployment secrets.
7. Set `GOOGLE_SHEETS_SPREADSHEET_ID` to the private Wohnung Hunter sheet ID and `GOOGLE_SHEETS_SHEET_NAME=Wohnungen`.
8. Verify `/health` reports `googleConfigured: true`, then call the MCP tool `wohnung_sync_gmail`.

Never paste these secrets into source files, issues, pull requests, screenshots, or chat messages intended for publication.
