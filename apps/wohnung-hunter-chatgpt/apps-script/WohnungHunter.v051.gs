/**
 * Wohnung Hunter v0.5.1 additive safety patch for WohnungHunter.gs v0.5.
 *
 * Keep the existing v0.5 file in the bound Apps Script project and add this
 * file as a SECOND .gs file. Run setupWohnungHunter051() once.
 *
 * v0.5.1 deliberately does not replace the proven Gmail parser. It wraps the
 * v0.5 scan and adds three conservative post-processing layers:
 *   1. stronger search-alert noise filtering,
 *   2. evidence-only aliasing of split events,
 *   3. terminal manual overrides so withdrawn/closed/rejected objects cannot
 *      be resurrected by an older viewing/documents/application mail.
 */
var WH051 = {
  version: '0.5.1',
  patchProperty: 'WH_PATCH_VERSION',
  scanHandler: 'scanRentalMail051',
  oldScanHandler: 'scanRentalMail'
};

function setupWohnungHunter051() {
  var result = withLock_(function() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Setup aus der gebundenen Wohnung-Hunter-Tabelle starten.');
    var stored = props_().getProperty('WH_SPREADSHEET_ID');
    if (stored && stored !== ss.getId()) throw new Error('Andere Tabelle gespeichert. Bitte die ursprüngliche Tabelle öffnen.');
    if (!stored) props_().setProperty('WH_SPREADSHEET_ID', ss.getId());

    // Create the replacement trigger first. Only after creation succeeds do we
    // remove the old v0.5 scan trigger and older v0.5.1 duplicates.
    var trigger = ScriptApp.newTrigger(WH051.scanHandler).timeBased().everyMinutes(5).create();
    ScriptApp.getProjectTriggers().forEach(function(t) {
      var handler = t.getHandlerFunction();
      if ((handler === WH051.oldScanHandler || handler === WH051.scanHandler) && t.getUniqueId() !== trigger.getUniqueId()) {
        ScriptApp.deleteTrigger(t);
      }
    });
    props_().setProperty(WH051.patchProperty, WH051.version);
    return { ready: true };
  });
  if (result.busy) return alert_('Hunter arbeitet gerade. v0.5.1 Setup gleich erneut starten.');
  var first = scanRentalMail051();
  alert_('Wohnung Hunter v0.5.1 aktiv. Automatisch alle 5 Minuten.\n' + resultText_(first) +
    '\nSafety-Normalizer: ' + patchSummary051_(first.patch));
}

function scanRentalMail051() {
  // Let the proven v0.5 engine ingest first. Its own lock is released before
  // the safety pass starts, so we never nest ScriptLock acquisition.
  var result = scanRentalMail();
  if (!result || result.busy || result.setupRequired) return result;
  var patch = withLock_(function() { return postProcess051_(); });
  result.patch = patch;
  return result;
}

function runWohnungHunter051Manual() {
  var result = withLock_(function() { return postProcess051_(); });
  alert_(result.busy ? 'Hunter arbeitet gerade.' : 'v0.5.1 Bereinigung: ' + patchSummary051_(result));
}

function repairRecentBatch051Manual() {
  var result = runBatch_('repair');
  if (!result.busy && !result.setupRequired) result.patch = withLock_(function() { return postProcess051_(); });
  alert_('Reparatur v0.5.1: ' + resultText_(result) + '\nSafety-Normalizer: ' + patchSummary051_(result.patch));
}

function showWohnungHunter051Status() {
  var active = ScriptApp.getProjectTriggers().filter(function(t) { return t.getHandlerFunction() === WH051.scanHandler; }).length;
  var patch = props_().getProperty(WH051.patchProperty) || 'nicht installiert';
  alert_('Wohnung Hunter Patch v' + patch + '\nTrigger v0.5.1: ' + active +
    '\nBasisparser: v' + (props_().getProperty('WH_VERSION') || '?'));
}

function patchSummary051_(r) {
  if (!r) return 'nicht ausgeführt';
  if (r.busy) return 'anderer Lauf aktiv';
  return (r.noise || 0) + ' Noise, ' + (r.aliased || 0) + ' Alias-Events, ' +
    (r.terminal || 0) + ' Terminal-Overrides';
}

function postProcess051_() {
  var sheets = ensureSheets_();
  var result = { noise: 0, aliased: 0, terminal: 0 };
  result.noise = suppressNoise051_(sheets);
  result.aliased = normalizeAliases051_(sheets);
  result.terminal = applyTerminalOverrides051_(sheets);
  SpreadsheetApp.flush();
  return result;
}

function patchNoiseReason051_(subject, from) {
  var existing = noiseReason_(subject, from);
  if (existing) return existing;
  var s = flat_(decodeEntities_(subject)).toLowerCase().replace(/^(?:(?:re|aw|fw|fwd):\s*)+/i, '');
  var email = emailAddress_(from);
  // Observed ohne-makler search-notification mail. It is not an application
  // transaction even when the mail body contains buttons such as Kontakt.
  if (/^benachrichtigung zu ihrer immobiliensuche\b/.test(s) && /@(?:anfragen\.)?ohne-makler\.net$/.test(email)) {
    return 'Suchbenachrichtigung / ohne-makler';
  }
  return '';
}

function suppressNoise051_(sheets) {
  var events = loadEvents_(sheets.events), affected = Object.create(null), changed = 0;
  Object.keys(events.byId).forEach(function(messageId) {
    var event = events.byId[messageId].event;
    var reason = patchNoiseReason051_(event.subject || '', event.from || '');
    if (!reason || !event.relevant) return;
    event.relevant = false;
    event.reason = reason;
    saveEvent_(sheets.events, events, event);
    affected[event.canonicalId] = true;
    changed++;
  });
  Object.keys(affected).forEach(function(id) { safeRender051_(sheets.main, events, id); });

  // Fallback for an engine row whose old event journal entry is missing.
  // Manual rows are never deleted by this patch.
  var mainRows = rows_(sheets.main, WH.headers.length), toDelete = [];
  mainRows.forEach(function(r, i) {
    if (String(r[19]) !== WH.version) return;
    if (patchNoiseReason051_(String(r[17] || r[0] || ''), String(r[10] || ''))) toDelete.push(i + 2);
  });
  toDelete.reverse().forEach(function(n) { sheets.main.deleteRow(n); changed++; });
  return changed;
}

function normalizeAliases051_(sheets) {
  var events = loadEvents_(sheets.events), changed = 0, affected = Object.create(null);
  var all = Object.keys(events.byId).map(function(k) { return events.byId[k].event; }).filter(function(e) { return e.relevant; });

  // 1) Portal-stable events can absorb an ID-less follow-up only when title,
  // portal and sender domain match exactly and point to one unique canonical ID.
  var stable = Object.create(null);
  all.forEach(function(e) {
    if (/^gmail-message:/.test(String(e.canonicalId || ''))) return;
    var key = stableEventKey051_(e);
    if (!key) return;
    stable[key] = stable[key] || Object.create(null);
    stable[key][e.canonicalId] = true;
  });
  all.forEach(function(e) {
    if (!/^gmail-message:/.test(String(e.canonicalId || ''))) return;
    var key = stableEventKey051_(e), ids = key && stable[key] ? Object.keys(stable[key]) : [];
    if (ids.length === 1) changed += rewriteEventKey051_(sheets, events, e, ids[0], affected);
  });

  // 2) Dawonia/Immomio mail templates often omit a stable application ID.
  // Exact address + rooms + sqm is a sufficiently strong object signature.
  // Only signatures with at least two relevant events are consolidated.
  var groups = Object.create(null);
  all.forEach(function(e) {
    var sig = dawoniaSignature051_(e);
    if (!sig) return;
    groups[sig] = groups[sig] || [];
    groups[sig].push(e);
  });
  Object.keys(groups).forEach(function(sig) {
    var group = groups[sig];
    if (group.length < 2) return;
    var id = 'sig:dawonia:' + sig;
    group.forEach(function(e) {
      if (e.canonicalId !== id) changed += rewriteEventKey051_(sheets, events, e, id, affected);
    });
  });

  Object.keys(affected).forEach(function(id) { safeRender051_(sheets.main, events, id); });
  return changed;
}

function stableEventKey051_(e) {
  var title = normalizeText051_(e.title || '');
  var portal = normalizeText051_(e.portal || '');
  var domain = senderDomain051_(e.from || '');
  if (title.length < 12 || !portal || !domain) return '';
  return portal + '|' + domain + '|' + title;
}

function senderDomain051_(from) {
  var email = emailAddress_(from);
  var at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(at + 1) : '';
}

function normalizeText051_(value) {
  return flat_(decodeEntities_(value)).toLowerCase()
    .replace(/[„“”"'`´]/g, '')
    .replace(/[^a-z0-9äöüß]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function normalizeAddress051_(value) {
  var s = normalizeText051_(value).replace(/\bstrasse\b/g, 'straße');
  if (!/\b\d{5}\b/.test(s)) return '';
  if (/adresse aus e mail prüfen/.test(s)) return '';
  return s;
}

function dawoniaSignature051_(e) {
  if (!/dawonia|immomio/i.test(String(e.portal || ''))) return '';
  var address = normalizeAddress051_(e.address || '');
  if (!address || e.rooms === '' || e.rooms == null || e.sqm === '' || e.sqm == null) return '';
  return address.replace(/\s+/g, '-') + ':' + String(e.rooms).replace(',', '.') + ':' + String(e.sqm).replace(',', '.');
}

function rewriteEventKey051_(sheets, events, event, newId, affected) {
  var oldId = String(event.canonicalId || '');
  if (!oldId || oldId === newId) return 0;
  event.previousKeys = (event.previousKeys || []).slice();
  if (event.previousKeys.indexOf(oldId) < 0) event.previousKeys.push(oldId);
  event.canonicalId = newId;
  saveEvent_(sheets.events, events, event);
  affected[oldId] = true;
  affected[newId] = true;
  return 1;
}

function safeRender051_(sheet, events, id) {
  if (!id) return;
  try { renderKey_(sheet, events, id); }
  catch (e) {
    // v0.5 intentionally refuses to overwrite a manual row with the exact ID.
    // The safety patch follows the same rule and leaves that row untouched.
  }
}

function applyTerminalOverrides051_(sheets) {
  var current = rows_(sheets.main, WH.headers.length);
  var backupSheet = sheets.ss.getSheetByName(WH.backupSheet);
  var backup = backupSheet ? rows_(backupSheet, WH.headers.length) : [];
  var source = backup.concat(current.filter(function(r) { return String(r[19]) !== WH.version; }));
  var exact = Object.create(null), withdrawnNumbers = Object.create(null);

  source.forEach(function(r) {
    var kind = terminalKind051_(r);
    if (!kind) return;
    var id = String(r[14] || '');
    if (id) exact[id] = strongerTerminal051_(exact[id], kind);
    if (kind === 'withdrawn') rowObjectNumbers051_(r).forEach(function(n) { withdrawnNumbers[n] = true; });
  });

  // Expand a withdrawal object number through all historical aliases. This is
  // what links e.g. Objekt 10765 to its Immowelt Online-ID and its viewing mail
  // without deduping by Gmail thread.
  var withdrawnIds = Object.create(null), withdrawnTitles = Object.create(null), withdrawnAddresses = Object.create(null);
  Object.keys(withdrawnNumbers).forEach(function(number) {
    source.forEach(function(r) {
      if (rowObjectNumbers051_(r).indexOf(number) < 0) return;
      var id = String(r[14] || '');
      if (id) withdrawnIds[id] = true;
      var title = normalizeText051_(r[0] || '');
      if (title.length >= 12 && !genericTitle051_(title)) withdrawnTitles[title] = true;
      var address = normalizeAddress051_(r[1] || '');
      if (address) withdrawnAddresses[address] = true;
    });
  });

  var changed = 0;
  current.forEach(function(r, i) {
    if (String(r[19]) !== WH.version) return;
    var id = String(r[14] || ''), kind = exact[id] || '';
    var nums = rowObjectNumbers051_(r);
    if (!kind && nums.some(function(n) { return withdrawnNumbers[n]; })) kind = 'withdrawn';
    var title = normalizeText051_(r[0] || ''), address = normalizeAddress051_(r[1] || '');
    if (!kind && withdrawnIds[id]) kind = 'withdrawn';
    if (!kind && title && withdrawnTitles[title]) kind = 'withdrawn';
    if (!kind && address && withdrawnAddresses[address]) kind = 'withdrawn';
    if (!kind) return;

    var rowNumber = i + 2;
    var desiredStatus = kind;
    var oldStatus = String(r[6] || '').toLowerCase();
    if (oldStatus !== desiredStatus) {
      sheets.main.getRange(rowNumber, 7).setValue ? sheets.main.getRange(rowNumber, 7).setValue(desiredStatus) : sheets.main.getRange(rowNumber, 7, 1, 1).setValues([[desiredStatus]]);
      changed++;
    }
    // I = Nächste Aktion. F/J/L/M are intentionally never touched.
    var action = 'Keine Aktion';
    if (String(r[8] || '') !== action) {
      sheets.main.getRange(rowNumber, 9).setValue ? sheets.main.getRange(rowNumber, 9).setValue(action) : sheets.main.getRange(rowNumber, 9, 1, 1).setValues([[action]]);
    }
    var review = String(r[18] || '');
    var marker = kind === 'withdrawn' ? 'Manuell zurückgezogen; v0.5.1 schützt vor Wiedereröffnung' :
      kind === 'rejected' ? 'Terminal: abgelehnt; v0.5.1 schützt vor Wiedereröffnung' :
      'Terminal: geschlossen; v0.5.1 schützt vor Wiedereröffnung';
    if (review.indexOf(marker) < 0) {
      review = review ? review + '; ' + marker : marker;
      sheets.main.getRange(rowNumber, 19).setValue ? sheets.main.getRange(rowNumber, 19).setValue(review) : sheets.main.getRange(rowNumber, 19, 1, 1).setValues([[review]]);
    }
  });
  return changed;
}

function terminalKind051_(r) {
  var status = normalizeText051_(r[6] || '');
  var action = normalizeText051_(r[8] || '');
  var title = normalizeText051_(r[0] || '');
  var notes = normalizeText051_(r[11] || '');
  var subject = normalizeText051_(r[17] || '');
  var text = [status, action, title, notes, subject].join(' ');
  if (/rücknahme|ruecknahme|zurückzieh|zurueckzieh|zurückgezogen|zurueckgezogen|withdrawn|anfrage zurück|anfrage zuruck|auf eine besichtigung verzichten/.test(text)) return 'withdrawn';
  if (/abgelehnt|rejected|absage|anderweitig vergeben|objekt nicht mehr verfügbar|objekt nicht mehr verfugbar/.test(text)) return 'rejected';
  if (/\bgeschlossen\b|\bclosed\b/.test(status + ' ' + action)) return 'closed';
  return '';
}

function strongerTerminal051_(a, b) {
  var rank = { closed: 1, rejected: 2, withdrawn: 3 };
  if (!a) return b;
  return rank[b] > rank[a] ? b : a;
}

function rowObjectNumbers051_(r) {
  var text = decodeEntities_([r[0], r[1], r[11], r[14], r[17]].join('\n'));
  var found = Object.create(null), re = /(?:objekt|immobile|immobilie|makler[ -]?nr\.?|propertyid)[^0-9]{0,24}(\d{4,12})/gi, m;
  while ((m = re.exec(text)) !== null) found[m[1]] = true;
  return Object.keys(found);
}

function genericTitle051_(title) {
  return /^(?:bewerbungseingang erfolgreich|thank you for your inquiry|vielen dank für deine anfrage|vielen dank für ihre anfrage|neue nachricht)/.test(title);
}
