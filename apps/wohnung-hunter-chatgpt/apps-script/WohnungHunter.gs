/**
 * Wohnung Hunter v0.5 — paste this WHOLE file into a bound Apps Script (V8).
 * Run setupWohnungHunter once. No web deployment, external library or HTML UI.
 * Gmail is read-only. Installation preserves v0.4 rows in WH_Backup_v04 before
 * rebuilding imported records. Manual data remains in that backup for review.
 */
var WH = {
  version: '0.5', sheetName: 'Wohnungen', scanMinutes: 5, repairBatchSize: 20,
  pageSize: 40, scanDays: 7, repairDays: 30, budgetMs: 240000,
  query: '{Wohnung Miete Mietanfrage Besichtigung ImmoScout Immowelt Immomio Dawonia Everreal Vermieter Makler Selbstauskunft Mietangebot Bewerbung Kontaktanfrage "your inquiry"} -in:spam -in:trash -in:drafts',
  headers: ['Objekt / Titel', 'Adresse / Ort', 'Portal / Anbieter', 'Kaltmiete €', 'Zimmer',
    'ÖPNV / Lage', 'Status', 'Letztes Update', 'Nächste Aktion', 'Dokumente', 'Kontakt',
    'Notizen', 'Score', 'm²', 'ID', 'Letzte Gmail-ID', 'Gmail Thread-ID', 'Letzter Betreff',
    'Prüfhinweis', 'Parser-Version'],
  eventSheet: 'WH_Events_v05', queueSheet: 'WH_Queue_v05', backupSheet: 'WH_Backup_v04',
  eventHeaders: ['Gmail-ID', 'Epoch ms', 'Canonical ID', 'Parsed event JSON'],
  queueHeaders: ['Lauf', 'Gmail-ID', 'Zustand', 'Versuche', 'Fehler'],
  actions: { applied: 'Auf Antwort warten', documents: 'Geforderte Angaben / Unterlagen vervollständigen',
    viewing: 'Besichtigung prüfen / bestätigen', offer: 'Mietangebot prüfen', rejected: 'Keine Aktion' }
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Wohnung Hunter')
    .addItem('Setup / Update auf v0.5', 'setupWohnungHunter')
    .addItem('Jetzt Gmail prüfen', 'scanRentalMailManual')
    .addItem('Reparatur: nächster 20er-Block', 'repairRecentBatchManual')
    .addItem('Reparatur neu beginnen', 'resetRepairCursorManual')
    .addItem('Offensichtlichen Mail-Müll entfernen', 'cleanupNoiseRowsManual')
    .addItem('Fehlgeschlagene Mails erneut versuchen', 'retryFailedMessagesManual')
    .addItem('Status anzeigen', 'showWohnungHunterStatus').addToUi();
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return { busy: true };
  try { return fn(); }
  finally { lock.releaseLock(); }
}

function props_() { return PropertiesService.getScriptProperties(); }

function setupWohnungHunter() {
  var result = withLock_(function() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Setup aus der gebundenen Wohnung-Hunter-Tabelle starten.');
    var stored = props_().getProperty('WH_SPREADSHEET_ID');
    if (stored && stored !== ss.getId()) throw new Error('Andere Tabelle gespeichert. Bitte die ursprüngliche Tabelle öffnen.');
    props_().setProperty('WH_SPREADSHEET_ID', ss.getId());
    var sheets = ensureSheets_();
    migrateLegacy_(sheets);
    // Create first: if creation fails, the previous trigger still exists.
    var trigger = ScriptApp.newTrigger('scanRentalMail').timeBased().everyMinutes(5).create();
    ScriptApp.getProjectTriggers().forEach(function(t) {
      if (t.getHandlerFunction() === 'scanRentalMail' && t.getUniqueId() !== trigger.getUniqueId()) ScriptApp.deleteTrigger(t);
    });
    props_().setProperty('WH_VERSION', WH.version);
    return { ready: true };
  });
  if (result.busy) return alert_('Hunter arbeitet gerade. Setup gleich erneut starten.');
  var first = scanRentalMail();
  alert_('v0.5 eingerichtet. Automatisch alle 5 Minuten. ' + resultText_(first) +
    '\nAlte importierte Zeilen liegen in WH_Backup_v04. Die Rekonstruktion läuft in 20er-Blöcken.');
}

function spreadsheet_() {
  var id = props_().getProperty('WH_SPREADSHEET_ID');
  if (!id) throw new Error('Einmal setupWohnungHunter ausführen.');
  return SpreadsheetApp.openById(id);
}

function ensureSheets_() {
  var ss = spreadsheet_();
  function ensure(name, headers, hidden) {
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sheet.getMaxColumns() < headers.length) sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
    var existing = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
    for (var i = 0; i < headers.length; i++) {
      if (existing[i] && existing[i] !== headers[i]) throw new Error('Unerwartete Spalte in ' + name + ': ' + existing[i]);
    }
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    if (hidden) sheet.hideSheet();
    return sheet;
  }
  var main = ensure(WH.sheetName, WH.headers, false);
  return { ss: ss, main: main, events: ensure(WH.eventSheet, WH.eventHeaders, true),
    queue: ensure(WH.queueSheet, WH.queueHeaders, true) };
}

function rows_(sheet, width) {
  return sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, width).getValues() : [];
}

function putRows_(sheet, start, data) {
  if (!data.length) return;
  var end = start + data.length - 1;
  if (sheet.getMaxRows() < end) sheet.insertRowsAfter(sheet.getMaxRows(), end - sheet.getMaxRows());
  sheet.getRange(start, 1, data.length, data[0].length).setValues(data);
}

function migrateLegacy_(sheets) {
  if (props_().getProperty('WH_MIGRATED_V05') === 'yes') return;
  var backup = sheets.ss.getSheetByName(WH.backupSheet);
  if (!backup && sheets.main.getLastRow() > 1) {
    backup = sheets.main.copyTo(sheets.ss).setName(WH.backupSheet);
    SpreadsheetApp.flush();
  }
  // Recoverable after interruption: always seed from the immutable backup.
  if (backup) {
    var old = rows_(backup, WH.headers.length);
    var queue = rows_(sheets.queue, WH.queueHeaders.length);
    enqueue_(sheets.queue, queue, 'scan', old.map(function(r) { return String(r[15] || ''); }).filter(Boolean));
    SpreadsheetApp.flush();
    var current = rows_(sheets.main, WH.headers.length);
    for (var i = current.length - 1; i >= 0; i--) {
      if (String(current[i][19]) !== WH.version && (current[i][15] || current[i][16] || /^gmail:/.test(String(current[i][14])))) {
        sheets.main.deleteRow(i + 2);
      }
    }
  }
  SpreadsheetApp.flush();
  props_().setProperty('WH_MIGRATED_V05', 'yes');
}

function alert_(message) { SpreadsheetApp.getUi().alert(message); }

function resultText_(r) {
  if (r.busy) return 'Ein anderer Lauf ist noch aktiv.';
  if (r.setupRequired) return 'Bitte Setup / Update auf v0.5 starten.';
  return r.processed + ' Mails geprüft, ' + r.updated + ' verarbeitet, ' + r.noise + ' ausgefiltert, ' +
    r.pending + ' ausstehend, ' + r.failed + ' Fehler' + (r.done ? ' (fertig).' : '. Fortsetzung im nächsten Block.');
}

function scanRentalMailManual() { alert_(resultText_(scanRentalMail())); }
function scanRentalMail() { return runBatch_('scan'); }
function repairRecentBatchManual() { alert_('Reparatur: ' + resultText_(runBatch_('repair'))); }

function resetRepairCursorManual() {
  var result = withLock_(function() {
    props_().deleteProperty('WH_REPAIR_V05');
    return { reset: true };
  });
  alert_(result.busy ? 'Hunter arbeitet gerade.' : 'Neue Reparatur vorbereitet. Nächsten 20er-Block starten.');
}

function newCrawl_(mode) {
  var before = Math.floor(Date.now() / 1000);
  var since = Number(props_().getProperty('WH_SCAN_THROUGH_V05') || 0);
  return { token: mode === 'scan' ? 'scan' : 'repair:' + Date.now(),
    after: mode === 'scan' && since ? since - 86400 : before - (mode === 'repair' ? WH.repairDays : WH.scanDays) * 86400,
    before: before, offset: 0, discovered: false };
}

function enqueue_(sheet, queue, token, ids) {
  var known = Object.create(null), add = [];
  queue.forEach(function(r) { known[r[0] + ':' + r[1]] = true; });
  ids.forEach(function(id) {
    if (id && !known[token + ':' + id]) {
      known[token + ':' + id] = true;
      add.push([token, id, 'pending', 0, '']);
    }
  });
  putRows_(sheet, queue.length + 2, add);
  Array.prototype.push.apply(queue, add);
}

function discover_(sheets, queue, crawl) {
  var threads = GmailApp.search(WH.query + ' after:' + crawl.after + ' before:' + crawl.before, crawl.offset, WH.pageSize);
  var ids = [];
  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(m) {
      var time = m.getDate().getTime() / 1000;
      // Gmail search returns threads, including messages outside the query window.
      if (!m.isDraft() && time >= crawl.after && time < crawl.before) ids.push(m.getId());
    });
  });
  enqueue_(sheets.queue, queue, crawl.token, ids);
  SpreadsheetApp.flush();
  crawl.offset += threads.length;
  crawl.discovered = threads.length < WH.pageSize;
}

function ownAddresses_() {
  return [Session.getEffectiveUser().getEmail()].concat(GmailApp.getAliases()).map(ownAddressKey_).filter(Boolean);
}

function runBatch_(mode) {
  return withLock_(function() {
    if (props_().getProperty('WH_VERSION') !== WH.version) return { setupRequired: true };
    var start = Date.now(), sheets = ensureSheets_(), queue = rows_(sheets.queue, WH.queueHeaders.length);
    var key = mode === 'repair' ? 'WH_REPAIR_V05' : 'WH_SCAN_V05';
    var stored = props_().getProperty(key);
    var crawl = stored ? JSON.parse(stored) : newCrawl_(mode);
    if (!stored && mode === 'repair') {
      // Repair the exact source messages already known, even when older than 30 days.
      var known = rows_(sheets.events, WH.eventHeaders.length).map(function(r) { return String(r[0]); });
      var backup = sheets.ss.getSheetByName(WH.backupSheet);
      if (backup) known = known.concat(rows_(backup, WH.headers.length).map(function(r) { return String(r[15] || ''); }));
      enqueue_(sheets.queue, queue, crawl.token, known.filter(Boolean));
    }
    props_().setProperty(key, JSON.stringify(crawl));
    if (!crawl.discovered && queue.filter(function(r) { return r[0] === crawl.token && r[2] === 'pending'; }).length < 200) {
      discover_(sheets, queue, crawl);
      props_().setProperty(key, JSON.stringify(crawl));
    }
    var events = loadEvents_(sheets.events), own = ownAddresses_();
    var result = { processed: 0, updated: 0, noise: 0, failed: 0, pending: 0, done: false };
    for (var i = 0; i < queue.length && result.processed < WH.repairBatchSize; i++) {
      var row = queue[i];
      if (row[0] !== crawl.token || row[2] !== 'pending') continue;
      if (Date.now() - start > WH.budgetMs) break;
      result.processed++;
      try {
        var message = GmailApp.getMessageById(String(row[1]));
        if (!message) throw new Error('Gmail-Nachricht nicht verfügbar');
        var item = normalizeMessage_(message, own);
        var event = parseRentalMessage_(item);
        var old = events.byId[item.messageId];
        // Keep old projection keys in the journal until retries can remove them.
        // A failure after writing the event must not strand a stale apartment row.
        event.previousKeys = old ? (old.event.previousKeys || []).slice() : [];
        if (old && old.event.canonicalId !== event.canonicalId && event.previousKeys.indexOf(old.event.canonicalId) < 0) {
          event.previousKeys.push(old.event.canonicalId);
        }
        if (event.relevant) {
          saveEvent_(sheets.events, events, event);
          event.previousKeys.forEach(function(id) { renderKey_(sheets.main, events, id); });
          renderKey_(sheets.main, events, event.canonicalId);
          result.updated++;
        } else {
          if (old) {
            saveEvent_(sheets.events, events, event);
            renderKey_(sheets.main, events, old.event.canonicalId);
          }
          result.noise++;
        }
        // Data and event log must be durable before the completion marker.
        SpreadsheetApp.flush();
        row[2] = 'done'; row[4] = '';
      } catch (e) {
        row[3] = Number(row[3]) + 1;
        row[2] = row[3] >= 3 ? 'failed' : 'pending';
        row[4] = safeCell_(String(e.message || e).slice(0, 400));
      }
      putRows_(sheets.queue, i + 2, [row]);
    }
    queue.forEach(function(r) {
      if (r[0] !== crawl.token) return;
      if (r[2] === 'pending') result.pending++;
      if (r[2] === 'failed') result.failed++;
    });
    result.done = crawl.discovered && result.pending === 0 && result.failed === 0;
    SpreadsheetApp.flush();
    if (mode === 'scan' && crawl.discovered && result.pending === 0) {
      props_().setProperty('WH_SCAN_THROUGH_V05', String(crawl.before));
      props_().deleteProperty(key);
    }
    props_().setProperty('WH_LAST_' + mode.toUpperCase() + '_V05', JSON.stringify({ at: new Date().toISOString(), result: result }));
    return result;
  });
}

function retryFailedMessagesManual() {
  var result = withLock_(function() {
    var sheet = ensureSheets_().queue, rows = rows_(sheet, WH.queueHeaders.length), count = 0;
    var ids = [];
    rows.forEach(function(r, i) {
      if (r[2] === 'failed') {
        ids.push(String(r[1])); r[2] = r[0] === 'scan' ? 'pending' : 'retry-queued';
        r[3] = 0; r[4] = ''; putRows_(sheet, i + 2, [r]); count++;
      }
    });
    // A reset repair token is no longer active. Always route retries to the
    // automatic scan queue, including IDs whose earlier scan already succeeded.
    rows.forEach(function(r, i) {
      if (r[0] === 'scan' && ids.indexOf(String(r[1])) >= 0) { r[2] = 'pending'; r[3] = 0; putRows_(sheet, i + 2, [r]); }
    });
    enqueue_(sheet, rows, 'scan', ids);
    return { count: count };
  });
  alert_(result.busy ? 'Hunter arbeitet gerade.' : result.count + ' Mails für erneuten Versuch freigegeben.');
}

function showWohnungHunterStatus() {
  var active = ScriptApp.getProjectTriggers().filter(function(t) { return t.getHandlerFunction() === 'scanRentalMail'; }).length;
  var failed = rows_(ensureSheets_().queue, WH.queueHeaders.length).filter(function(r) { return r[2] === 'failed'; }).length;
  var value = props_().getProperty('WH_LAST_SCAN_V05');
  var last = value ? JSON.parse(value) : null;
  alert_('Wohnung Hunter v' + (props_().getProperty('WH_VERSION') || '?') + '\nTrigger: ' + active +
    '\nLetzter Scan: ' + (last ? last.at + '\n' + resultText_(last.result) : 'noch nie') +
    '\nFehler insgesamt: ' + failed + ' (Details in WH_Queue_v05).');
}

function emailAddress_(value) {
  var m = String(value || '').toLowerCase().match(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+/);
  return m ? m[0] : '';
}

function normalizeMessage_(message, own) {
  return { messageId: message.getId(), threadId: message.getThread().getId(), from: message.getFrom() || '',
    subject: message.getSubject() || '', body: message.getPlainBody() || '', html: message.getBody() || '',
    date: message.getDate(), outgoing: own.indexOf(ownAddressKey_(message.getFrom())) >= 0, draft: message.isDraft() };
}

function ownAddressKey_(value) {
  var email = emailAddress_(value);
  if (/@(?:gmail|googlemail)\.com$/.test(email)) return email.split('@')[0].split('+')[0].replace(/\./g, '') + '@gmail.com';
  return email;
}

function decodeEntities_(text) {
  var named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', auml: 'ä', ouml: 'ö', uuml: 'ü',
    Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', euro: '€', sup2: '²', ndash: '–', mdash: '—' };
  return String(text || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, function(all, key) {
    if (key.charAt(0) !== '#') return Object.prototype.hasOwnProperty.call(named, key) ? named[key] : all;
    var number = key.charAt(1).toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
    return number > 0 && number <= 65535 ? String.fromCharCode(number) : all;
  });
}

function htmlToText_(html) {
  return decodeEntities_(String(html || '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '$2 [$1]')
    .replace(/<(?:br|\/p|\/div|\/tr|\/h[1-6])\b[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' '));
}

function currentText_(text) {
  return decodeEntities_(text).replace(/\r/g, '').split(/\n\s*(?:On .{0,180}wrote:|Am .{0,180}schrieb.{0,100}:|-{2,}\s*(?:Original Message|Ursprüngliche Nachricht|Weitergeleitete Nachricht)|Von: .{0,150}\n(?:Gesendet|Datum):)/i)[0]
    .split(/\n\s*(?:#{1,3}\s*)?(?:Deine Info|Deine Angaben|Ihre Angaben an den Anbieter|Angaben an den Anbieter|Ihre Nachricht:|Deine Nachricht:|Ihre Kontaktdaten|Your message:)/i)[0];
}

function flat_(text) { return String(text || '').replace(/\s+/g, ' ').trim(); }

function noiseReason_(subject, from) {
  var s = decodeEntities_(subject).toLowerCase().replace(/^(?:(?:re|aw|fw|fwd):\s*)+/i, '');
  if (/^(?:\d+\s+)?(?:(?:neue?s?|alternatives?)\s+)?angebote?\s*:|neue suche gespeichert|neue ergebnisse sofort|14.tage.überblick|ähnliche immobilien|empfehlungen für dich|suchauftrag|suchalarm|newsletter|so kommst du schneller|immobilien.alert/.test(s)) return 'Suchalarm / Werbung';
  if (/registrierung erfolgreich|e.mail.adresse bestätigen|passwort zurücksetzen|password reset|verify your email|bestätige deine.*mail|sicherheitswarnung|security alert|you shared some google account data/.test(s)) return 'Konto / Sicherheit';
  if (/^(?:myscout@|angebot@suchen\.|suche@info\.)/.test(emailAddress_(from)) || /@(?:accounts\.)?google\.com$/.test(emailAddress_(from))) return 'Werbung / Konto';
  return '';
}

function portalFrom_(text, from) {
  var t = String(from || '') + ' ' + text;
  if (/immomio/i.test(t)) return /dawonia/i.test(t) ? 'Dawonia / Immomio' : 'Immomio';
  if (/everreal/i.test(t)) return 'Everreal';
  if (/immobilienscout|immoscout|Scout-ID/i.test(t)) return 'ImmoScout24';
  if (/immowelt|Online-ID/i.test(t)) return 'Immowelt';
  return 'E-Mail';
}

function identity_(text, portal) {
  var t = decodeEntities_(text), found = Object.create(null), m;
  // Decode tracking wrappers locally. Never request any email URL.
  for (var n = 0; n < 3; n++) t = t.replace(/(?:%[0-9a-f]{2})+/gi, function(v) { try { return decodeURIComponent(v); } catch (e) { return v; } });
  function collect(re, prefix) {
    var match;
    while ((match = re.exec(t)) !== null) found[prefix + match[1].toLowerCase()] = true;
  }
  collect(/\bScout[ -]?ID\s*[:#]?\s*(\d{7,12})\b/gi, 'is24:');
  collect(/https?:\/\/(?:[a-z0-9-]+\.)*(?:immobilienscout24\.de|immoscout24\.de)\/(?:expose\/)?(\d{7,12})(?=[\/?#\s\])"']|$)/gi, 'is24:');
  if (/ImmoScout/.test(portal)) collect(/\(Objekt\s+(\d{7,12})\)/gi, 'is24:');
  collect(/\bOnline[ -]?ID\s*:?\s*\[?([a-z0-9-]{5,40})\b/gi, 'immowelt:');
  collect(/https?:\/\/(?:[a-z0-9-]+\.)*immowelt\.de\/expose\/([a-z0-9-]{5,40})(?=[\/?#\s\])"']|$)/gi, 'immowelt:');
  collect(/https?:\/\/(?:[a-z0-9-]+\.)*everreal\.(?:co|com|de)\/[^\s\]"']*?apply\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?=\/applications(?:\/|\b))/gi, 'everreal:');
  if (/Immomio/.test(portal)) {
    collect(/\bapplication[ _-]?id["'\s:=]+["']?(\d{6,15}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?=[^a-z0-9-]|$)/gi, 'immomio:');
    collect(/https?:\/\/(?:[a-z0-9-]+\.)*immomio\.(?:com|de)\/[^\s\]"']*?applications?\/(\d{6,15}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?=[\/?#\s\])"']|$)/gi, 'immomio:');
  }
  var keys = Object.keys(found);
  return { id: keys.length === 1 ? keys[0] : '', ambiguous: keys.length > 1, candidates: keys };
}

function detectStatus_(subject, body) {
  var text = flat_(decodeEntities_(subject) + '\n' + body).toLowerCase();
  // Ignore links and contingent/negative sentences, not the complete message:
  // a later, concrete invitation must still be recognized.
  text = text.replace(/https?:\/\/\S+/g, '');
  if (/objekt nicht mehr verfügbar|wohnung.{0,30}(?:bereits|anderweitig) (?:vermietet|vergeben)|anderweitig vergeben|für einen anderen mietinteressenten entschieden|nicht in die engere auswahl|(?:bewerbung|anfrage).{0,35}abgelehnt|leider.{0,100}(?:nicht berücksichtigen|nicht ausgewählt)|(?:^|\s)absage\b/.test(text)) return { status: 'rejected', explicit: true };
  var active = text.split(/(?<=[.!?])\s+|\n/).filter(function(sentence) {
    return !/\b(?:wenn|sobald|bevor|falls|gegebenenfalls|eventuell)\b|würde.{0,70}(?:freuen|besichtigen)|keine zusage|kein mietangebot|noch kein.{0,20}(?:termin|angebot)|nicht.{0,25}(?:eingeladen|bestätigt)|keine.{0,20}unterlagen/.test(sentence);
  }).join(' ');
  if (/^(?:ihr |dein )?mietangebot\b/i.test(String(subject).trim()) || /(?:mietangebot|mietvertrag).{0,70}(?:anbei|erhalten|prüfen|unterschreib|unterzeichn)|(?:anbei|senden|übersenden|hier ist).{0,70}(?:mietangebot|mietvertrag)|(?:^|\s)zusage\s*(?:für|zur|:)|angebot zur anmietung|wir.{0,40}(?:bieten|vermieten).{0,50}(?:ihnen|dir).{0,50}wohnung|rental offer|lease.{0,40}(?:sign|attached)/.test(active)) return { status: 'offer', explicit: true };
  if (/jetzt besichtigung.{0,60}(?:vereinbaren|buchen)|besichtigungstermin\s+(?:buchen|bestätigen|auswählen)|(?:einladung|eingeladen).{0,65}besichtigung|zur besichtigung eingeladen|wir laden sie.{0,65}besichtigung|besichtigung.{0,50}(?:findet|am \d|bestätigt)|viewing.{0,30}(?:invitation|confirmed)|invited.{0,30}viewing/.test(active)) return { status: 'viewing', explicit: true };
  // Document requests can occur inside a prerequisite sentence beginning with 'bevor'.
  if (/weitere (?:angaben|informationen).{0,20}(?:benötigt|über sie)|(?:bitte|müssen|benötigen|brauchen)[^.!?]{0,120}(?:selbstauskunft|schufa|unterlagen|dokumente|angaben)|(?:benötigen|brauchen)[^.!?]{0,70}informationen|(?:unterlagen|dokumente|selbstauskunft).{0,40}(?:hochladen|einreichen|ausfüllen)|angaben vervollständigen|vervollständigen sie ihre (?:immobilien)?anfrage|anfrage abschließen|fehlenden angaben|complete your (?:application|inquiry)|please.{0,40}upload/.test(text) && !/keine (?:weiteren )?(?:unterlagen|dokumente).{0,20}(?:benötigt|erforderlich)/.test(text)) return { status: 'documents', explicit: true };
  if (/anfrage.{0,40}(?:erhalten|versendet|verschickt|übermittelt|eingereicht|prüfen)|kontaktaufnahme wurde erfolgreich|bewerbungseingang|bewerbung liegt|vielen dank für (?:ihre|deine) anfrage|thank you for your inquiry|review your inquiry|anfrage zu folgendem immobilienangebot gestellt/.test(text)) return { status: 'applied', explicit: true };
  return { status: 'applied', explicit: false };
}

function listingSection_(body) {
  var b = currentText_(body).replace(/\*\*/g, '').replace(/\r/g, '');
  var marker = b.search(/(?:Daten zur Immobilie|Informationen zur Immobilie|Objektbezeichnung|Objektdaten)/i);
  if (marker >= 0) b = b.slice(marker);
  else {
    // Scout replies put a contact block BEFORE the listing. Skip that block.
    var headings = /(?:^|\n)##\s+([^\n]+)/g, m, start = -1;
    while ((m = headings.exec(b)) !== null) if (!/Kontaktdaten|Nachricht/i.test(m[1])) start = m.index;
    if (start >= 0) b = b.slice(start);
  }
  return b.split(/\n\s*(?:#{1,3}\s*)?(?:Kontaktdaten(?: des Anbieters)?|Anbieter\s*-|Firma:|Deine Info|Deine Angaben|Ihre Kontaktdaten)|Immobilien Scout GmbH|AVIV Germany GmbH|Unsere Datenschutzbestimmungen|You can find our privacy policy|Mit freundlichen Grüßen|Viele Grüße/i)[0];
}

function number_(value) {
  var s = String(value).replace(/\s/g, '');
  if (/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(s) || s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
  return /^\d+(?:\.\d+)?$/.test(s) ? Number(s) : '';
}

function measurement_(text, re, min, max) {
  var m = re.exec(text);
  if (!m) return '';
  var n = number_(m[1]);
  return n !== '' && n >= min && n <= max ? n : '';
}

function listing_(subject, body) {
  var section = listingSection_(body), title = '', address = '', m;
  m = section.match(/Objektbezeichnung\s*-*\s*\n+\s*([^\n]+)/i) || section.match(/(?:Interesse am Objekt|interest in our listing)\s*["„]([^"“]+)["“]/i) || section.match(/(?:^|\n)##\s+([^\n]+)/);
  if (!m) m = section.match(/(?:Daten zur Immobilie|Informationen zur Immobilie)\s*\n+\s*\[?([^\]\n]{5,180})/i);
  if (m) title = flat_(m[1]);
  if (!title) { m = subject.match(/(?:Objekt nicht mehr verfügbar\s*<|Ihre Anfrage zu\s+)(.+?)(?:>|$)/i); if (m) title = flat_(m[1]); }
  m = section.match(/(?:Objektadresse|Adresse)\s*:\s*\n?\s*([^\n]{3,130})(?:\n\s*(\d{5}\s+[^\n]{2,65}))?/i);
  if (m) address = flat_(m[1] + (m[2] ? ', ' + m[2] : ''));
  if (!address) {
    m = section.match(/(?:^|\n)\s*([A-ZÄÖÜ][\wÄÖÜäöüß. -]{2,60}(?:straße|strasse|str\.|weg|allee|ring|platz|gasse)\s+\d+[a-z]?\s*,\s*\d{5}\s+[^\n]{2,60})/i);
    if (m) address = flat_(m[1]);
  }
  if (/Invalidenstra(?:ß|ss)e 65|Ostendstra(?:ß|ss)e 113|Eugen-Sänger-Ring 13|Hansastr\. 27f|Otto-Wagner-Str\. 30|Tal 32/i.test(address)) address = '';
  return { title: title, address: address,
    // A generic Preis or Gesamtmiete is not evidence of cold rent.
    kaltmiete: measurement_(section, /(?:Netto)?Kaltmiete\s*:?\s*\n?\s*([\d.,]+)\s*(?:€|Euro|EUR)/i, 1, 100000),
    rooms: firstValue_(measurement_(section, /(?:^|[\s*])Zimmer\s*:?\s*\*?\s*([\d.,]+)(?=\s|$)/i, 0.5, 20),
      measurement_(section, /(?:^|[^\d.,])([1-9]\d?(?:[.,]\d+)?)\s*-?\s*(?:Zimmer\b|Zi\.)/i, 0.5, 20)),
    sqm: firstValue_(measurement_(section, /(?:Wohnfläche|Größe)\s*:?\s*\n?\s*([\d.,]+)\s*m(?:²|2)/i, 5, 2000),
      measurement_(section, /(?:^|[^\d.,])([\d.,]+)\s*m(?:²|2)(?=\s|[\],.]|$)/i, 5, 2000)) };
}

function firstValue_(a, b) { return a !== '' && a != null ? a : b; }

function parseRentalMessage_(m) {
  var body = currentText_(m.body || htmlToText_(m.html));
  // Preserve links from HTML-only buttons, excluding quoted history.
  var html = String(m.html || '').split(/<blockquote\b|<div\b[^>]*class=["'][^"']*gmail_quote/i)[0];
  var links = (html.match(/href\s*=\s*["'][^"']+["']/gi) || []).join('\n');
  var subject = decodeEntities_(m.subject || '');
  var portal = portalFrom_(body + '\n' + links, m.from);
  var identity = identity_(subject + '\n' + body + '\n' + links, portal);
  var signalText = currentText_(body).split(/\n\s*(?:#{1,3}\s*)?(?:Daten zur Immobilie|Informationen zur Immobilie|Kontaktdaten|Objektbezeichnung|Objektdaten)/i)[0];
  // Account/profile upsells and the applicant's own copied application are not requests.
  signalText = signalText.replace(/^.*(?:Jetzt Profil vervollständigen|Erhalte weitere ähnliche Angebote).*$/gim, '')
    .split(/Bitte nicht auf diese E-Mail antworten|Mit freundlichen Grüßen|Viele Grüße|Unsere Datenschutzbestimmungen|You can find our privacy policy/i)[0];
  var status = detectStatus_(subject, signalText);
  var noise = noiseReason_(subject, m.from);
  var rental = /wohnung|miet|immobili|besichtigung|vermieter|makler|immomio|everreal|immowelt|immoscout|listing/i.test(subject + ' ' + body + ' ' + m.from);
  var transaction = status.explicit || /neue nachricht|hat (?:ihnen|dir) geantwortet|nachricht geschickt|ihre anfrage|deine anfrage|your inquiry/i.test(subject + ' ' + signalText);
  var relevant = !m.outgoing && !m.draft && !noise && rental && transaction;
  var data = identity.ambiguous ? { title: '', address: '', kaltmiete: '', rooms: '', sqm: '' } : listing_(subject, body);
  var id = identity.id || 'gmail-message:' + m.messageId;
  return { messageId: m.messageId, threadId: m.threadId, date: new Date(m.date).getTime(), from: m.from,
    subject: subject.slice(0, 300), relevant: relevant, canonicalId: id, portal: portal,
    status: status.status, explicit: status.explicit, title: data.title, address: data.address,
    kaltmiete: data.kaltmiete, rooms: data.rooms, sqm: data.sqm,
    review: identity.ambiguous ? 'Mehrere Objekt-IDs: einzeln prüfen; keine Zusammenführung' : identity.id ? '' : 'Keine eindeutige Portal-ID: Nachricht separat prüfen',
    reason: noise || (m.outgoing ? 'Eigene Nachricht' : ''), note: flat_(signalText).replace(/https?:\/\/\S+/g, '[Link in Gmail]').slice(0, 700) };
}

function loadEvents_(sheet) {
  var index = { byId: Object.create(null), size: 0 };
  rows_(sheet, WH.eventHeaders.length).forEach(function(r, i) {
    if (!r[0]) return;
    // Corrupted log must be visible, never silently discarded.
    index.byId[String(r[0])] = { row: i + 2, event: JSON.parse(String(r[3])) };
    index.size = i + 1;
  });
  return index;
}

function saveEvent_(sheet, index, event) {
  var existing = index.byId[event.messageId];
  var row = existing ? existing.row : ++index.size + 1;
  putRows_(sheet, row, [[event.messageId, event.date, event.canonicalId, JSON.stringify(event)]]);
  index.byId[event.messageId] = { row: row, event: event };
}

function aggregate_(events, id) {
  var list = Object.keys(events.byId).map(function(k) { return events.byId[k].event; }).filter(function(e) { return e.relevant && e.canonicalId === id; });
  list.sort(function(a, b) { return a.date - b.date || a.messageId.localeCompare(b.messageId); });
  if (!list.length) return null;
  var result = { canonicalId: id, status: 'applied', title: '', address: '', kaltmiete: '', rooms: '', sqm: '' };
  list.forEach(function(e) {
    ['title', 'address', 'kaltmiete', 'rooms', 'sqm'].forEach(function(k) { if (e[k] !== '' && e[k] != null) result[k] = e[k]; });
    // Old confirmations and generic replies cannot erase an actionable state.
    if (e.explicit && (e.status !== 'applied' || result.status === 'applied')) result.status = e.status;
    result.last = e;
  });
  return result;
}

function safeCell_(value) {
  return typeof value === 'string' && /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
}

function renderKey_(sheet, events, id) {
  var data = aggregate_(events, id), rows = rows_(sheet, WH.headers.length), managed = [], manual = false;
  rows.forEach(function(r, i) {
    if (String(r[14]) !== id) return;
    if (String(r[19]) === WH.version) managed.push(i + 2); else manual = true;
  });
  if (manual) throw new Error('Manueller Datensatz mit gleicher ID: ' + id + '. Bitte im Blatt prüfen.');
  if (!data) {
    managed.reverse().forEach(function(row) { sheet.deleteRow(row); });
    return;
  }
  var e = data.last, current = managed.length ? rows[managed[0] - 2] : [];
  var review = e.review;
  if (!e.explicit) review = (review ? review + '; ' : '') + 'Antwort des Anbieters prüfen';
  var row = [data.title || e.subject || 'Wohnungsanfrage', data.address || 'Adresse aus E-Mail prüfen', e.portal,
    data.kaltmiete, data.rooms, current[5] || 'zu prüfen', data.status, new Date(e.date),
    !e.explicit ? 'Antwort des Anbieters prüfen' : WH.actions[data.status], current[9] || 'offen', e.from,
    current[11] || '', current[12] == null ? '' : current[12], data.sqm, id, e.messageId, e.threadId, e.subject, review, WH.version];
  // Generated evidence is a cell note; the user's Notizen column remains theirs.
  var target = managed.length ? managed[0] : sheet.getLastRow() + 1;
  var output = row.map(safeCell_);
  if (managed.length) {
    var formulas = sheet.getRange(target, 1, 1, WH.headers.length).getFormulas()[0];
    [5, 9, 11, 12].forEach(function(i) { if (formulas[i]) output[i] = formulas[i]; });
  }
  putRows_(sheet, target, [output]);
  sheet.getRange(target, 8).setNumberFormat('yyyy-mm-dd hh:mm');
  sheet.getRange(target, 19).setNote(e.note + '\nGmail: https://mail.google.com/mail/u/0/#all/' + e.messageId);
  // Repair also removes duplicate engine rows, only with exactly the same ID.
  managed.slice(1).reverse().forEach(function(n) { sheet.deleteRow(n); });
}

function cleanupNoiseRowsManual() {
  var result = withLock_(cleanupNoiseRows_);
  alert_(result.busy ? 'Hunter arbeitet gerade.' : 'Bereinigung: ' + result.removed + ' Zeilen entfernt. Kopie: ' + result.backup);
}

function cleanupNoiseRows_() {
  var sheets = ensureSheets_(), rows = rows_(sheets.main, WH.headers.length), candidates = [];
  rows.forEach(function(r, i) {
    // Never delete because an ad phrase appeared somewhere in a genuine reply.
    if (noiseReason_(String(r[17] || r[0]), String(r[10] || ''))) candidates.push(i + 2);
  });
  if (!candidates.length) return { removed: 0, backup: 'nicht erforderlich' };
  var name = 'WH_Cleanup_' + Date.now();
  sheets.main.copyTo(sheets.ss).setName(name);
  SpreadsheetApp.flush();
  var events = loadEvents_(sheets.events);
  candidates.slice().reverse().forEach(function(n) {
    var row = rows[n - 2], old = events.byId[String(row[15])];
    if (old) { old.event.relevant = false; saveEvent_(sheets.events, events, old.event); }
    sheets.main.deleteRow(n);
  });
  SpreadsheetApp.flush();
  return { removed: candidates.length, backup: name };
}
