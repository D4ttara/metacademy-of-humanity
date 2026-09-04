# Wohnung Hunter v0.5

The bound Google Apps Script reads Gmail and maintains the `Wohnungen` Sheet. The complete installer and runtime is `apps-script/WohnungHunter.gs`. It uses Apps Script V8 and built-in Google services only. It does not send email, follow links, upload application documents, or require a web deployment. The bound script has no Dashboard, sidebar, `doGet`, or HTML UI. HTML email parsing is retained because some Immomio messages contain no plain-text part.

## Install or update

Open the existing application's Google Sheet, then Extensions → Apps Script. Replace the entire previous Hunter script with `apps-script/WohnungHunter.gs`, save, and run `setupWohnungHunter` once. Allow the requested Gmail, Sheets and trigger permissions. Refresh the Sheet to load its menu. Do not leave a second copy of the previous Hunter code in another `.gs` tab. No Deploy step is needed.

Setup installs exactly one `scanRentalMail` trigger for the installing account using `everyMinutes(5)`, then runs the first block. Google schedules installable triggers; execution is subject to its service quotas and scheduling. Other users' triggers are outside the installing account's trigger visibility.

Use `Wohnung Hunter → Reparatur: nächster 20er-Block` for historical repair. Repeat until the dialog says `fertig`. The repair includes known source message IDs regardless of age and discovers rental mail from the last 30 days. `Reparatur neu beginnen` starts a new fixed-window discovery. `Offensichtlichen Mail-Müll entfernen` backs up the active sheet and removes rows identified by explicit noise subjects or senders, reporting the actual count. It never deletes Gmail messages.

## Identity and status

Canonical keys are `is24:<Scout-ID>`, `immowelt:<Online-ID>`, `everreal:<listing UUID from the apply path>`, and `immomio:<application ID>`. Case is normalized. IDs from unrelated URLs, privacy-policy UUIDs and Immomio expose IDs are not substituted for application IDs. Exactly one recognized canonical key is required to group messages. Conflicting keys or a missing ID produce a separate `gmail-message:<message ID>` record with a visible review instruction. Two messages cannot be joined by Gmail thread, subject, title, address, substring or score. This deliberately leaves some related messages separate when the source does not provide enough identity evidence.

Column G contains only `applied`, `documents`, `viewing`, `offer`, or `rejected`. German action instructions remain in column I. An ordinary reply retains the last known actionable state and asks the user to read the response. An isolated ordinary reply uses `applied` with an explicit review note; it does not assert that an offer or viewing exists. Events are replayed in timestamp order, independent of discovery or repair order. Older application confirmations cannot erase later document requests, invitations, offers or rejections. Later concrete non-application events can change the state.

Quoted applicant text, reply history, account upsells and footer text are excluded from status evidence where recognized. Conditional viewing language and optional booking boilerplate are not invitations. Search alerts, recommendations, registration, account-security notices, drafts and the installing user's own addresses/aliases are filtered. Cold rent is populated only from an explicit cold-rent label; a generic price or total rent is left unclassified. Missing fields remain empty or marked for review.

## Preservation and recovery

The first v0.5 setup copies the old Sheet into `WH_Backup_v04` before removing previously imported rows from the active Sheet. Source message IDs from the backup are queued for reconstruction. Rows without import provenance remain in place. Previously mixed addresses, rents, statuses and notes are not trusted as reconstruction input. Old user annotations remain in the backup for manual review rather than being assigned to a possibly wrong apartment. The setup does not repeatedly recreate or replace that backup.

The original columns A:R keep their positions. S adds `Prüfhinweis`; T records `Parser-Version`. During subsequent v0.5 updates, user-maintained transit, documents, notes and score cells (including formulas) are preserved. A manual row that conflicts with an exact canonical ID causes an explicit processing error instead of being overwritten.

`WH_Events_v05` is a hidden per-message event journal. `WH_Queue_v05` is a hidden durable queue. They contain private mail-derived data inside the bound spreadsheet; hiding is a usability feature, not an access boundary. Keep the spreadsheet's sharing appropriate to that data. The parser never stores private portal URL tokens in its evidence note and never requests email links.

Each run parses at most 20 messages, including noise and failures. Discovery enumerates up to 40 Gmail threads per page, separately from that message limit. The code uses fixed time windows, explicit message-date checks, durable message IDs, and a one-day overlap between completed automatic scans. Initial discovery covers seven days; after downtime it continues from its previous successful scan window. Gmail search is thread-paginated rather than a transactional mailbox snapshot; for a mailbox changing during a historical crawl, starting another repair pass is the recovery route. There is no fixed 80/150-thread result cap. A script lock serializes setup, scans, cleanup and repair.

Event and row writes are flushed before queue completion is recorded. Interrupted work can be replayed. Three failures place an item in `failed`; errors are counted in the status dialog and retained in the queue. `Fehlgeschlagene Mails erneut versuchen` routes failed items back into the automatic queue, including failures from an older repair run. Script properties hold only compact cursors and status, not the old oversized seen-message JSON.

Rollback: disable this script's scan trigger, keep the current v0.5 tabs for diagnosis, and restore the old data from `WH_Backup_v04` alongside the previous committed script if needed. Do not delete the backup until the reconstructed data and any manual annotations have been reviewed.

## Validation

Run `node apps/wohnung-hunter-chatgpt/apps-script/WohnungHunter.test.cjs` from the repository root. The harness compiles the entire `.gs` file, then exercises the parser and simulated Gmail/Sheets/Properties/trigger/lock behavior with synthetic fixtures. An optional `WH_PRIVATE_FIXTURES` path enables local checks of private email templates; those inputs must stay outside Git.

Local syntax and simulation tests do not prove that the installed Google trigger has run. Live acceptance consists of saving the full file in Apps Script, completing setup authorization, and observing a successful scheduled execution and the corresponding Sheet changes. This release was not deployed or activated by the repository edit.

Google references: [V8 runtime](https://developers.google.com/apps-script/guides/v8-runtime), [five-minute trigger API](https://developers.google.com/apps-script/reference/script/clock-trigger-builder#everyMinutes(Integer)), [Gmail service](https://developers.google.com/apps-script/reference/gmail/gmail-app), [locking](https://developers.google.com/apps-script/reference/lock/lock-service), [service quotas](https://developers.google.com/apps-script/guides/services/quotas).

The separate `src/` and `assets/` MCP prototype is legacy application code, not part of the single-file bound-script installation. Its Dashboard does not run or ship with the v0.5 installer. It must not be run as a second Gmail ingestion engine.
