const WH = {
  spreadsheetId: '1cMiencBZAGPk59yvo4OYIQDEu9j28uOQtGZDAwTV2lE',
  sheetName: 'Wohnungen',
  scanMinutes: 5,
  query: '(Wohnung OR Miete OR Besichtigung OR ImmoScout OR Immowelt OR Immomio OR Dawonia OR Everreal OR Vermieter OR Makler OR Selbstauskunft OR Mietangebot) -in:spam -in:trash newer_than:3d',
  headers: [
    'Objekt / Titel', 'Adresse / Ort', 'Portal / Anbieter', 'Kaltmiete €', 'Zimmer',
    'ÖPNV / Lage', 'Status', 'Letztes Update', 'Nächste Aktion', 'Dokumente', 'Kontakt',
    'Notizen', 'Score', 'm²', 'ID', 'Letzte Gmail-ID', 'Gmail Thread-ID', 'Letzter Betreff'
  ],
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏠 Wohnung Hunter')
    .addItem('Setup / Trigger aktivieren', 'setupWohnungHunter')
    .addItem('Jetzt Gmail prüfen', 'scanRentalMailManual')
    .addItem('Dashboard öffnen', 'showWohnungHunterDashboard')
    .addSeparator()
    .addItem('Status anzeigen', 'showWohnungHunterStatus')
    .addToUi();
}

function setupWohnungHunter() {
  ensureSheet_();
  removeTriggers_('scanRentalMail');
  ScriptApp.newTrigger('scanRentalMail').timeBased().everyMinutes(WH.scanMinutes).create();
  PropertiesService.getScriptProperties().setProperty('WH_SETUP_AT', new Date().toISOString());
  scanRentalMail();
  SpreadsheetApp.getUi().alert('Wohnung Hunter läuft jetzt automatisch alle ' + WH.scanMinutes + ' Minuten.');
}

function showWohnungHunterStatus() {
  const props = PropertiesService.getScriptProperties();
  const triggers = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'scanRentalMail');
  SpreadsheetApp.getUi().alert(
    'Wohnung Hunter\n\n' +
    'Trigger: ' + (triggers.length ? 'AKTIV ✅' : 'NICHT AKTIV ❌') + '\n' +
    'Letzter Scan: ' + (props.getProperty('WH_LAST_SCAN') || 'noch nie') + '\n' +
    'Letzte neue Mails: ' + (props.getProperty('WH_LAST_NEW_COUNT') || '0')
  );
}

function scanRentalMailManual() {
  const result = scanRentalMail();
  SpreadsheetApp.getUi().alert('Scan fertig: ' + result.scanned + ' geprüft, ' + result.updated + ' aktualisiert, ' + result.actionable + ' mit Aktion.');
}

function scanRentalMail() {
  ensureSheet_();
  const props = PropertiesService.getScriptProperties();
  const seen = loadSeen_();
  const threads = GmailApp.search(WH.query, 0, 80);
  const messages = [];

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      const id = message.getId();
      if (seen[id]) return;
      const item = normalizeMessage_(thread, message);
      if (!isRelevantRentalMail_(item)) {
        seen[id] = Date.now();
        return;
      }
      messages.push(item);
    });
  });

  messages.sort((a, b) => a.date.getTime() - b.date.getTime());

  let updated = 0;
  let actionable = 0;
  messages.forEach(item => {
    const parsed = parseRentalMessage_(item);
    const row = matchExistingRow_(parsed, item);
    upsertRentalRow_(row, parsed, item);
    if (['documents', 'viewing', 'offer'].includes(parsed.status)) actionable++;
    seen[item.messageId] = Date.now();
    updated++;
  });

  saveSeen_(seen);
  props.setProperty('WH_LAST_SCAN', new Date().toISOString());
  props.setProperty('WH_LAST_NEW_COUNT', String(updated));
  SpreadsheetApp.flush();
  return { scanned: messages.length, updated, actionable };
}

function normalizeMessage_(thread, message) {
  return {
    messageId: message.getId(),
    threadId: thread.getId(),
    from: message.getFrom() || '',
    to: message.getTo() || '',
    subject: message.getSubject() || '',
    body: message.getPlainBody() || '',
    date: message.getDate() || new Date(),
  };
}

function isRelevantRentalMail_(m) {
  const text = (m.subject + ' ' + m.from + ' ' + m.body).toLowerCase();
  const positive = /(wohnung|miete|mietanfrage|besichtigung|selbstauskunft|schufa|immoscout|immowelt|immomio|dawonia|everreal|vermieter|makler|mietangebot|mietvertrag|unterlagen|bewerbung)/.test(text);
  if (!positive) return false;

  const applicationSignal = /(ihre anfrage|deine anfrage|bewerbung|besichtigung|selbstauskunft|unterlagen|dokument|mietangebot|mietvertrag|abgelehnt|absage|anderweitig vergeben|wird geprüft|anfrage abschließen|termin)/.test(text);
  const genericAlert = /(suchauftrag|neues angebot|alternative[s]? angebot|neue treffer|neue immobilien|empfehlungen für dich)/.test(text);
  return applicationSignal || !genericAlert;
}

function parseRentalMessage_(m) {
  const text = (m.subject + '\n' + m.body).replace(/\s+/g, ' ').trim();
  const lower = text.toLowerCase();
  let status = 'new';
  let nextAction = 'Nachricht prüfen';

  if (/anderweitig vergeben|leider.{0,80}absage|nicht berücksichtigen|nicht in die engere auswahl|abgelehnt|absage/.test(lower)) {
    status = 'rejected'; nextAction = 'Keine Aktion';
  } else if (/mietangebot|mietvertrag|zusage|angebot zur anmietung|wir freuen uns.{0,80}vermieten/.test(lower)) {
    status = 'offer'; nextAction = 'Mietangebot prüfen und Jobcenter-Zusicherung klären';
  } else if (/besichtigungstermin|besichtigung|termin vereinbaren|einladen.{0,80}besichtigung/.test(lower)) {
    status = 'viewing'; nextAction = 'Besichtigungstermin bestätigen';
  } else if (/selbstauskunft|schufa|einkommensnachweis|gehaltsnachweis|unterlagen|dokumente|anfrage abschließen|fragebogen/.test(lower)) {
    status = 'documents'; nextAction = 'Geforderte Angaben/Dokumente vervollständigen';
  } else if (/bewerbungseingang|anfrage erhalten|vielen dank für ihre anfrage|vielen dank für deine anfrage|wird geprüft|prüfung ihrer anfrage/.test(lower)) {
    status = 'applied'; nextAction = 'Auf Antwort warten';
  }

  return {
    status,
    nextAction,
    title: cleanTitle_(m.subject),
    address: extractAddress_(text),
    portal: portalFrom_(text, m.from),
    kaltmiete: extractEuro_(text),
    rooms: extractRooms_(text),
    sqm: extractSqm_(text),
    note: ('Von: ' + m.from + ' | ' + text).slice(0, 900),
  };
}

function cleanTitle_(subject) {
  return String(subject || '')
    .replace(/^Neue Nachricht:\s*/i, '')
    .replace(/^Vielen Dank für (?:Ihre|deine) Anfrage[: ]*/i, '')
    .replace(/^Bewerbungseingang erfolgreich[: ]*/i, '')
    .replace(/^Ihre Mietanfrage für\s*/i, '')
    .trim() || 'Wohnungsanfrage';
}

function portalFrom_(text, from) {
  const t = (text + ' ' + from).toLowerCase();
  if (t.includes('immobilienscout') || t.includes('immoscout')) return 'ImmoScout24';
  if (t.includes('immowelt')) return 'Immowelt';
  if (t.includes('immomio')) return 'Immomio';
  if (t.includes('dawonia')) return 'Dawonia';
  if (t.includes('everreal')) return 'Everreal';
  return 'E-Mail';
}

function extractEuro_(text) {
  const m = text.match(/(?:kaltmiete|nettokaltmiete|miete)\D{0,18}(\d{3,4}(?:[.,]\d{1,2})?)\s*€/i) ||
            text.match(/(\d{3,4}(?:[.,]\d{1,2})?)\s*€\s*(?:kaltmiete|nettokaltmiete)/i);
  return m ? Number(m[1].replace(/\./g, '').replace(',', '.')) : '';
}

function extractSqm_(text) {
  const m = text.match(/(\d{2,3}(?:[.,]\d+)?)\s*m(?:²|2)/i);
  return m ? Number(m[1].replace(',', '.')) : '';
}

function extractRooms_(text) {
  const m = text.match(/(\d(?:[.,]\d)?)\s*[- ]?zimmer/i);
  return m ? Number(m[1].replace(',', '.')) : '';
}

function extractAddress_(text) {
  const street = text.match(/\b([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\- ]{2,35}(?:straße|str\.|weg|allee|ring|platz|gasse)\s+\d+[a-zA-Z]?)\b/);
  const city = text.match(/\b(80\d{3}|81\d{3}|82\d{3}|85\d{3})\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß\- ]{2,35})/);
  if (street && city) return street[1].trim() + ', ' + city[1] + ' ' + city[2].trim();
  if (street) return street[1].trim();
  if (city) return city[1] + ' ' + city[2].trim();
  return '';
}

function matchExistingRow_(parsed, message) {
  const sheet = getSheet_();
  const last = Math.max(sheet.getLastRow(), 1);
  if (last < 2) return -1;
  const rows = sheet.getRange(2, 1, last - 1, WH.headers.length).getDisplayValues();
  const subject = (message.subject || '').toLowerCase();
  const address = (parsed.address || '').toLowerCase();

  let best = { row: -1, score: 0 };
  rows.forEach((r, i) => {
    let score = 0;
    const title = (r[0] || '').toLowerCase();
    const rowAddress = (r[1] || '').toLowerCase();
    const threadId = r[16] || '';

    if (threadId && threadId === message.threadId) score += 100;
    if (address && rowAddress && (address.includes(rowAddress) || rowAddress.includes(address))) score += 60;
    if (title.length > 8 && subject.includes(title.slice(0, Math.min(title.length, 45)))) score += 35;

    const postcodeA = address.match(/\b\d{5}\b/);
    const postcodeB = rowAddress.match(/\b\d{5}\b/);
    if (postcodeA && postcodeB && postcodeA[0] === postcodeB[0]) score += 10;

    if (score > best.score) best = { row: i + 2, score };
  });
  return best.score >= 35 ? best.row : -1;
}

function upsertRentalRow_(rowNumber, parsed, m) {
  const sheet = getSheet_();
  const now = Utilities.formatDate(m.date, Session.getScriptTimeZone() || 'Europe/Berlin', 'yyyy-MM-dd HH:mm');

  if (rowNumber < 2) {
    const id = 'gmail:' + m.threadId;
    const row = [
      parsed.title, parsed.address || 'Adresse aus E-Mail prüfen', parsed.portal, parsed.kaltmiete, parsed.rooms,
      'zu prüfen', humanStatus_(parsed.status), now, parsed.nextAction, 'offen', extractContact_(m.from),
      parsed.note + ' | Gmail: https://mail.google.com/mail/u/0/#all/' + m.threadId,
      '', parsed.sqm, id, m.messageId, m.threadId, m.subject
    ];
    sheet.appendRow(row);
    return;
  }

  const current = sheet.getRange(rowNumber, 1, 1, WH.headers.length).getValues()[0];
  current[0] = current[0] || parsed.title;
  if ((!current[1] || /prüfen/i.test(current[1])) && parsed.address) current[1] = parsed.address;
  current[2] = current[2] || parsed.portal;
  current[3] = current[3] || parsed.kaltmiete;
  current[4] = current[4] || parsed.rooms;
  current[6] = humanStatus_(parsed.status);
  current[7] = now;
  current[8] = parsed.nextAction;
  current[10] = current[10] || extractContact_(m.from);
  current[11] = parsed.note + ' | Gmail: https://mail.google.com/mail/u/0/#all/' + m.threadId;
  current[13] = current[13] || parsed.sqm;
  current[14] = current[14] || ('sheet:' + Utilities.getUuid());
  current[15] = m.messageId;
  current[16] = m.threadId;
  current[17] = m.subject;
  sheet.getRange(rowNumber, 1, 1, WH.headers.length).setValues([current]);
}

function extractContact_(from) {
  return String(from || '').replace(/<[^>]+>/g, '').trim();
}

function humanStatus_(status) {
  return ({
    new: 'Neu',
    applied: 'Warten auf Prüfung',
    documents: 'Aktiv – Unterlagen angefordert',
    viewing: 'Besichtigung',
    offer: 'Mietangebot / Zusage',
    rejected: 'Abgelehnt',
    closed: 'Geschlossen'
  })[status] || 'Neu';
}

function normalizeStatus_(value) {
  const t = String(value || '').toLowerCase();
  if (/abgelehnt/.test(t)) return 'rejected';
  if (/zurückgezogen|geschlossen/.test(t)) return 'closed';
  if (/mietangebot|zusage|vertrag/.test(t)) return 'offer';
  if (/besichtigung/.test(t)) return 'viewing';
  if (/unterlagen|zusatzangaben|dokument/.test(t)) return 'documents';
  if (/warten|aktiv|prüfung|eingereicht/.test(t)) return 'applied';
  return 'new';
}

function getDashboardData() {
  ensureSheet_();
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return { apartments: [], counts: {}, generatedAt: new Date().toISOString() };
  const rows = sheet.getRange(2, 1, last - 1, WH.headers.length).getDisplayValues();
  const apartments = rows.filter(r => r[0]).map(r => ({
    id: r[14] || '', title: r[0], address: r[1], portal: r[2], kaltmiete: r[3], rooms: r[4],
    transit: r[5], status: normalizeStatus_(r[6]), statusLabel: r[6], updatedAt: r[7], nextAction: r[8],
    documents: r[9], contact: r[10], note: r[11], score: r[12], sqm: r[13], threadId: r[16], subject: r[17]
  })).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  const counts = {};
  apartments.forEach(a => counts[a.status] = (counts[a.status] || 0) + 1);
  return { apartments, counts, generatedAt: new Date().toISOString() };
}

function setApartmentStatus(id, status) {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) throw new Error('Keine Wohnungen gespeichert.');
  const ids = sheet.getRange(2, 15, last - 1, 1).getDisplayValues().flat();
  const idx = ids.indexOf(id);
  if (idx < 0) throw new Error('Wohnung nicht gefunden: ' + id);
  const row = idx + 2;
  const next = ({
    new: 'Nachricht prüfen', applied: 'Auf Antwort warten', documents: 'Unterlagen vervollständigen',
    viewing: 'Besichtigung bestätigen', offer: 'Mietangebot prüfen / Jobcenter-Zusicherung',
    rejected: 'Keine Aktion', closed: 'Keine Aktion'
  })[status] || '';
  sheet.getRange(row, 7).setValue(humanStatus_(status));
  sheet.getRange(row, 8).setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Berlin', 'yyyy-MM-dd HH:mm'));
  sheet.getRange(row, 9).setValue(next);
  return getDashboardData();
}

function showWohnungHunterDashboard() {
  const html = HtmlService.createHtmlOutput(INDEX_HTML_).setTitle('Wohnung Hunter').setWidth(440);
  SpreadsheetApp.getUi().showSidebar(html);
}

function doGet() {
  return HtmlService.createHtmlOutput(INDEX_HTML_).setTitle('Wohnung Hunter');
}

function ensureSheet_() {
  const ss = SpreadsheetApp.openById(WH.spreadsheetId);
  let sheet = ss.getSheetByName(WH.sheetName);
  if (!sheet) sheet = ss.insertSheet(WH.sheetName);
  const existing = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), WH.headers.length)).getDisplayValues()[0] : [];
  WH.headers.forEach((h, i) => {
    if (existing[i] !== h) sheet.getRange(1, i + 1).setValue(h);
  });
  sheet.setFrozenRows(1);
  return sheet;
}

function getSheet_() {
  return ensureSheet_();
}

function removeTriggers_(handler) {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === handler) ScriptApp.deleteTrigger(t);
  });
}

function loadSeen_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('WH_SEEN') || '{}'); }
  catch (e) { return {}; }
}

function saveSeen_(seen) {
  const entries = Object.entries(seen).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 800);
  PropertiesService.getScriptProperties().setProperty('WH_SEEN', JSON.stringify(Object.fromEntries(entries)));
}

const INDEX_HTML_ = `<!doctype html>
<html><head><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;margin:0;background:#f6f7fb;color:#111827}header{padding:16px 16px 10px;position:sticky;top:0;background:#f6f7fb;z-index:2}.title{font-size:22px;font-weight:800}.sub{font-size:12px;color:#6b7280;margin-top:3px}.bar{display:flex;gap:8px;margin-top:12px}.btn{border:0;border-radius:11px;padding:9px 11px;background:#111827;color:white;font-weight:700}.btn.secondary{background:#e5e7eb;color:#111827}.grid{padding:0 12px 18px}.card{background:white;border-radius:16px;padding:13px;margin:9px 0;box-shadow:0 1px 4px #00000012}.top{display:flex;justify-content:space-between;gap:8px}.name{font-weight:800;font-size:15px}.score{font-weight:800}.meta,.note{font-size:12px;color:#6b7280;margin-top:5px}.action{font-size:13px;margin-top:8px;font-weight:700}.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.chip{border:0;border-radius:999px;padding:7px 9px;font-size:11px;font-weight:700;background:#eef2ff;color:#312e81}.chip.bad{background:#fee2e2;color:#991b1b}.chip.good{background:#dcfce7;color:#166534}.empty{padding:40px 18px;color:#6b7280;text-align:center}
</style></head><body>
<header><div class="title">🏠 Wohnung Hunter</div><div class="sub" id="stamp">lädt…</div><div class="bar"><button class="btn" onclick="scan()">Gmail prüfen</button><button class="btn secondary" onclick="load()">Aktualisieren</button></div></header><main class="grid" id="grid"></main>
<script>
function esc(s){return String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
function load(){google.script.run.withSuccessHandler(render).withFailureHandler(err=>alert(err.message||err)).getDashboardData()}
function scan(){document.getElementById('stamp').textContent='Gmail wird geprüft…';google.script.run.withSuccessHandler(()=>load()).withFailureHandler(err=>alert(err.message||err)).scanRentalMail()}
function setStatus(id,status){google.script.run.withSuccessHandler(render).withFailureHandler(err=>alert(err.message||err)).setApartmentStatus(id,status)}
function render(data){document.getElementById('stamp').textContent='Stand: '+new Date(data.generatedAt).toLocaleString();const g=document.getElementById('grid');if(!data.apartments.length){g.innerHTML='<div class="empty">Noch keine Wohnungen.</div>';return}g.innerHTML=data.apartments.map(a=>'<section class="card"><div class="top"><div class="name">'+esc(a.title)+'</div><div class="score">'+(a.score?esc(a.score)+'/100':'')+'</div></div><div class="meta">'+esc(a.address)+' · '+esc(a.portal)+(a.kaltmiete?' · '+esc(a.kaltmiete)+' €':'')+(a.sqm?' · '+esc(a.sqm)+' m²':'')+'</div><div class="meta">'+esc(a.statusLabel)+' · '+esc(a.updatedAt)+'</div><div class="action">→ '+esc(a.nextAction||'')+'</div><div class="note">'+esc((a.note||'').slice(0,220))+'</div><div class="chips"><button class="chip" onclick="setStatus(\''+esc(a.id)+'\',\'documents\')">📎 Dokumente</button><button class="chip" onclick="setStatus(\''+esc(a.id)+'\',\'viewing\')">📅 Besichtigung</button><button class="chip good" onclick="setStatus(\''+esc(a.id)+'\',\'offer\')">✅ Mietangebot</button><button class="chip bad" onclick="setStatus(\''+esc(a.id)+'\',\'rejected\')">✕ Absage</button></div></section>').join('')}
load();
</script></body></html>`;