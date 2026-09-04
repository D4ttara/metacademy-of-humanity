const WH = {
  sheetName: 'Wohnungen',
  scanMinutes: 5,
  query: '(Wohnung OR Miete OR Mietanfrage OR Besichtigung OR ImmoScout OR Immowelt OR Immomio OR Dawonia OR Everreal OR Vermieter OR Makler OR Selbstauskunft OR Mietangebot OR Bewerbung OR Kontaktanfrage) -in:spam -in:trash newer_than:7d',
  headers: [
    'Objekt / Titel', 'Adresse / Ort', 'Portal / Anbieter', 'Kaltmiete €', 'Zimmer',
    'ÖPNV / Lage', 'Status', 'Letztes Update', 'Nächste Aktion', 'Dokumente', 'Kontakt',
    'Notizen', 'Score', 'm²', 'ID', 'Letzte Gmail-ID', 'Gmail Thread-ID', 'Letzter Betreff'
  ],
  repairBatchSize: 20
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏠 Wohnung Hunter')
    .addItem('Setup / Trigger aktivieren', 'setupWohnungHunter')
    .addItem('Jetzt Gmail prüfen', 'scanRentalMailManual')
    .addSeparator()
    .addItem('Reparatur: nächster 20er-Block', 'repairRecentBatchManual')
    .addItem('Reparatur-Cursor zurücksetzen', 'resetRepairCursorManual')
    .addItem('Offensichtlichen Mail-Müll entfernen', 'cleanupNoiseRowsManual')
    .addSeparator()
    .addItem('Dashboard öffnen', 'showWohnungHunterDashboard')
    .addItem('Status anzeigen', 'showWohnungHunterStatus')
    .addToUi();
}

function setupWohnungHunter() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Setup bitte aus der gebundenen Wohnung-Hunter-Tabelle starten.');
  PropertiesService.getScriptProperties().setProperty('WH_SPREADSHEET_ID', ss.getId());
  ensureSheet_();
  removeTriggers_('scanRentalMail');
  ScriptApp.newTrigger('scanRentalMail').timeBased().everyMinutes(WH.scanMinutes).create();
  PropertiesService.getScriptProperties().setProperty('WH_SETUP_AT', new Date().toISOString());
  scanRentalMail();
  SpreadsheetApp.getUi().alert('Wohnung Hunter läuft automatisch alle ' + WH.scanMinutes + ' Minuten.');
}

function showWohnungHunterStatus() {
  const props = PropertiesService.getScriptProperties();
  const triggers = ScriptApp.getProjectTriggers().filter(function(t) {
    return t.getHandlerFunction() === 'scanRentalMail';
  });
  SpreadsheetApp.getUi().alert(
    'Wohnung Hunter\n\n' +
    'Trigger: ' + (triggers.length ? 'AKTIV ✅' : 'NICHT AKTIV ❌') + '\n' +
    'Letzter Scan: ' + (props.getProperty('WH_LAST_SCAN') || 'noch nie') + '\n' +
    'Letzte neue Mails: ' + (props.getProperty('WH_LAST_NEW_COUNT') || '0') + '\n' +
    'Repair-Cursor: ' + (props.getProperty('WH_REPAIR_CURSOR') || '0')
  );
}

function scanRentalMailManual() {
  const result = scanRentalMail();
  SpreadsheetApp.getUi().alert('Scan fertig: ' + result.scanned + ' relevante neue Mails, ' + result.updated + ' Zeilen aktualisiert, ' + result.actionable + ' mit Aktion.');
}

function scanRentalMail() {
  return scanRentalMail_({ ignoreSeen: false, maxThreads: 80 });
}

function scanRentalMail_(options) {
  ensureSheet_();
  const opts = options || {};
  const props = PropertiesService.getScriptProperties();
  const seen = loadSeen_();
  const messages = collectRelevantMessages_(opts.maxThreads || 80, seen, Boolean(opts.ignoreSeen));
  let updated = 0;
  let actionable = 0;

  messages.forEach(function(item) {
    const parsed = parseRentalMessage_(item);
    const row = matchExistingRow_(parsed, item);
    upsertRentalRow_(row, parsed, item);
    if (['documents', 'viewing', 'offer'].indexOf(parsed.status) >= 0) actionable++;
    seen[item.messageId] = Date.now();
    updated++;
  });

  saveSeen_(seen);
  props.setProperty('WH_LAST_SCAN', new Date().toISOString());
  props.setProperty('WH_LAST_NEW_COUNT', String(updated));
  SpreadsheetApp.flush();
  return { scanned: messages.length, updated: updated, actionable: actionable };
}

function collectRelevantMessages_(maxThreads, seen, ignoreSeen) {
  const threads = GmailApp.search(WH.query, 0, maxThreads || 80);
  const messages = [];

  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(message) {
      const id = message.getId();
      if (!ignoreSeen && seen[id]) return;
      const item = normalizeMessage_(thread, message);
      if (!isRelevantRentalMail_(item)) {
        if (!ignoreSeen) seen[id] = Date.now();
        return;
      }
      messages.push(item);
    });
  });

  messages.sort(function(a, b) { return a.date.getTime() - b.date.getTime(); });
  return messages;
}

function repairRecentBatchManual() {
  ensureSheet_();
  const props = PropertiesService.getScriptProperties();
  const seen = loadSeen_();
  const all = collectRelevantMessages_(160, seen, true);
  let cursor = Number(props.getProperty('WH_REPAIR_CURSOR') || '0');
  if (!isFinite(cursor) || cursor < 0 || cursor >= all.length) cursor = 0;

  const batch = all.slice(cursor, cursor + WH.repairBatchSize);
  let updated = 0;
  batch.forEach(function(item) {
    const parsed = parseRentalMessage_(item);
    const row = matchExistingRow_(parsed, item);
    upsertRentalRow_(row, parsed, item);
    seen[item.messageId] = Date.now();
    updated++;
  });
  saveSeen_(seen);

  const next = cursor + batch.length;
  const finished = next >= all.length;
  props.setProperty('WH_REPAIR_CURSOR', finished ? '0' : String(next));
  props.setProperty('WH_LAST_SCAN', new Date().toISOString());
  SpreadsheetApp.flush();

  SpreadsheetApp.getUi().alert(
    'Repair fertig: ' + updated + ' Mails verarbeitet.\n' +
    (finished ? 'Alle ' + all.length + ' relevanten Mails sind durch. Cursor wieder 0.' : 'Fortschritt: ' + next + ' / ' + all.length + '. Menü erneut klicken für den nächsten Block.')
  );
}

function resetRepairCursorManual() {
  PropertiesService.getScriptProperties().setProperty('WH_REPAIR_CURSOR', '0');
  SpreadsheetApp.getUi().alert('Repair-Cursor auf 0 gesetzt.');
}

function normalizeMessage_(thread, message) {
  return {
    messageId: message.getId(),
    threadId: thread.getId(),
    from: message.getFrom() || '',
    to: message.getTo() || '',
    subject: message.getSubject() || '',
    body: message.getPlainBody() || '',
    date: message.getDate() || new Date()
  };
}

function isRelevantRentalMail_(m) {
  const from = String(m.from || '').toLowerCase();
  const subject = String(m.subject || '').toLowerCase();
  const body = String(m.body || '').toLowerCase();
  const all = subject + ' ' + from + ' ' + body;

  if (from.indexOf('ievgenkarogod@gmail.com') >= 0) return false;
  if (isNoiseMail_(subject, from, body)) return false;

  const rentalContext = /(wohnung|miete|mietanfrage|besichtigung|selbstauskunft|schufa|immoscout|immowelt|immomio|dawonia|everreal|vermieter|makler|mietangebot|mietvertrag|bewerbung|kontaktanfrage|exposé|expose)/.test(all);
  if (!rentalContext) return false;

  const applicationSignal = /(ihre anfrage|deine anfrage|kontaktanfrage|bewerbung|besichtigung|selbstauskunft|unterlagen|dokument|mietangebot|mietvertrag|abgelehnt|absage|anderweitig vergeben|objekt nicht mehr verfügbar|anfrage abschließen|angaben vervollständigen|weitere angaben|aktion erforderlich|neue nachricht|hat ihnen geantwortet|hat dir geantwortet|kontaktaufnahme wurde erfolgreich|anbieter hat .*anfrage erhalten|inquiry)/.test(all);
  return applicationSignal;
}

function isNoiseMail_(subject, from, body) {
  const s = String(subject || '').toLowerCase();
  const f = String(from || '').toLowerCase();
  const b = String(body || '').toLowerCase();

  if (/neue suche gespeichert|14-tage-überblick|neue ergebnisse sofort aufs smartphone|alternative angebote?: gezeichneter suchbereich|alternatives angebot: gezeichneter suchbereich|neues angebot: gezeichneter suchbereich|neue angebote für dich|empfehlungen für dich/.test(s)) return true;
  if (/wie du ähnliche immobilien .* finden kannst/.test(s)) return true;
  if (/you shared some google account data/.test(s)) return true;
  if (/e-mail-adresse bestätigen|email-adresse bestätigen|registrierung erfolgreich/.test(s) && /immomio|dawonia/.test(f + ' ' + b)) return true;
  if (/all-in-one immobilien app|push-benachrichtigungen|du hast deine suche erfolgreich gespeichert/.test(b)) return true;
  return false;
}

function parseRentalMessage_(m) {
  const raw = String(m.subject || '') + '\n' + String(m.body || '');
  const flat = raw.replace(/\s+/g, ' ').trim();
  const detected = detectStatus_(m.subject, m.body);
  const portal = portalFrom_(flat, m.from);
  const objectId = extractObjectId_(raw, portal);
  const title = extractListingTitle_(m.subject, m.body, portal);

  return {
    status: detected.status,
    nextAction: detected.nextAction,
    title: title || cleanTitle_(m.subject),
    address: extractAddress_(m.body, title, portal),
    portal: portal,
    kaltmiete: extractEuro_(m.body, portal),
    rooms: extractRooms_(m.body, portal),
    sqm: extractSqm_(m.body, portal),
    objectId: objectId,
    canonicalId: objectId ? portalId_(portal, objectId) : '',
    note: ('Von: ' + m.from + ' | ' + flat).slice(0, 1100)
  };
}

function detectStatus_(subject, body) {
  const s = String(subject || '').toLowerCase();
  const b = String(body || '').toLowerCase();
  const all = s + ' ' + b;

  if (/objekt nicht mehr verfügbar|anderen mietinteressenten entschieden|anderweitig vergeben|objekt.{0,80}vergeben|leider.{0,140}(absage|nicht berücksichtigen|nicht ausgewählt)|nicht in die engere auswahl|abgelehnt|absage/.test(all)) {
    return { status: 'rejected', nextAction: 'Keine Aktion' };
  }

  if (/mietangebot|mietvertrag|zusage|angebot zur anmietung|wir freuen uns.{0,120}(ihnen|dir).{0,80}vermieten/.test(all)) {
    return { status: 'offer', nextAction: 'Mietangebot prüfen und Jobcenter-Zusicherung klären' };
  }

  if (/\[aktion erforderlich\]|aktion erforderlich|weitere angaben benötigt|weitere informationen über sie|angaben vervollständigen|anfrage abschließen|formular ausfüllen|selbstauskunft ausfüllen|schufa.{0,80}(hochladen|einreichen|senden)|unterlagen.{0,80}(hochladen|einreichen|senden)|dokumente.{0,80}(hochladen|einreichen|senden)|fragebogen ausfüllen/.test(all)) {
    return { status: 'documents', nextAction: 'Geforderte Angaben/Dokumente vervollständigen' };
  }

  const viewingInvite = /möglichkeit.{0,100}besichtigungstermin.{0,40}buchen|besichtigungstermin.{0,50}(buchen|auswählen|bestätigen)|zur besichtigung eingeladen|einladung.{0,80}besichtigung|termin zur besichtigung.{0,50}(buchen|auswählen|bestätigen)|besichtigung.{0,50}(buchen|auswählen|bestätigen)/.test(all);
  if (viewingInvite) {
    return { status: 'viewing', nextAction: 'Besichtigungstermin prüfen / bestätigen' };
  }

  const applicationConfirmation = /kontaktaufnahme wurde erfolgreich verschickt|kontaktanfrage wurde erfolgreich versendet|anbieter hat deine anfrage erhalten|anbieter hat ihre anfrage erhalten|vielen dank für (?:ihre|deine) anfrage|bewerbungseingang|anfrage erhalten|anfrage erfolgreich (?:versendet|übermittelt|eingereicht)|thank you for your inquiry|we will review your inquiry|we will review your application/.test(all);
  if (applicationConfirmation) {
    return { status: 'applied', nextAction: 'Auf Antwort warten' };
  }

  if (/neue nachricht|hat ihnen geantwortet|hat dir geantwortet|nachricht von/.test(s + ' ' + b.slice(0, 700))) {
    return { status: 'new', nextAction: 'Antwort des Anbieters prüfen' };
  }

  return { status: 'new', nextAction: 'Nachricht prüfen' };
}

function portalFrom_(text, from) {
  const t = (String(text || '') + ' ' + String(from || '')).toLowerCase();
  if (t.indexOf('dawonia') >= 0 && t.indexOf('immomio') >= 0) return 'Dawonia / Immomio';
  if (t.indexOf('immomio') >= 0) return 'Immomio';
  if (t.indexOf('everreal') >= 0) return 'Everreal';
  if (t.indexOf('immobilienscout') >= 0 || t.indexOf('immoscout') >= 0) return 'ImmoScout24';
  if (t.indexOf('immowelt') >= 0) return 'Immowelt';
  if (t.indexOf('dawonia') >= 0) return 'Dawonia';
  return 'E-Mail';
}

function portalId_(portal, objectId) {
  const p = String(portal || '').toLowerCase();
  if (p.indexOf('immoscout') >= 0) return 'is24:' + objectId;
  if (p.indexOf('immowelt') >= 0) return 'immowelt:' + objectId;
  if (p.indexOf('immomio') >= 0 || p.indexOf('dawonia') >= 0) return 'immomio:' + objectId;
  if (p.indexOf('everreal') >= 0) return 'everreal:' + objectId;
  return 'portal:' + objectId;
}

function extractObjectId_(text, portal) {
  const t = String(text || '');
  let m;

  if (/immoscout/i.test(portal)) {
    m = t.match(/Scout-ID\s*:?\s*(\d{7,12})/i) || t.match(/\/expose\/(\d{7,12})/i) || t.match(/\(Objekt\s+(\d{7,12})\)/i);
    return m ? m[1] : '';
  }

  if (/immowelt/i.test(portal)) {
    m = t.match(/Online-ID\s*:?\s*\[?([a-z0-9-]{5,20})\]?/i) || t.match(/\/expose\/([a-z0-9-]{5,20})/i);
    return m ? m[1] : '';
  }

  if (/everreal/i.test(portal)) {
    m = t.match(/\/apply\/([0-9a-f-]{20,})\/applications\//i);
    return m ? m[1] : '';
  }

  if (/immomio|dawonia/i.test(portal)) {
    m = t.match(/applicationId["':\s]+(\d{6,15})/i) || t.match(/applicationid%22%3a(\d{6,15})/i);
    return m ? m[1] : '';
  }

  return '';
}

function extractListingTitle_(subject, body, portal) {
  const s = String(subject || '').trim();
  const b = String(body || '');
  let m;

  if (/immoscout/i.test(portal)) {
    m = b.match(/Daten zur Immobilie[\s\S]{0,500}?\n\s*([^\n]{5,180})\n\s*Scout-ID/i) || b.match(/Informationen zur Immobilie[\s\S]{0,500}?\n\s*([^\n]{5,180})\n\s*Scout-ID/i);
    if (m) return cleanInline_(m[1]);
    m = b.match(/Die Immobilie\s*\n+\s*([^\n]{5,180})\s*\n+\s*Adresse:/i);
    if (m) return cleanInline_(m[1]);
    m = b.match(/Interesse an dem Objekt[^„"]*[„"]([^”"]{5,180})[”"]/i);
    if (m) return cleanInline_(m[1]);
  }

  if (/immowelt/i.test(portal)) {
    m = b.match(/wird sich mit dir in verbindung setzen:\s*\n+\s*\[([^\]\n]{5,180})\]\(/i);
    if (m) return cleanInline_(m[1]);
    m = b.match(/Objektbezeichnung\s*-+\s*\n+\s*([^\n]{5,180})/i);
    if (m) return cleanInline_(m[1]);
  }

  if (/everreal/i.test(portal)) {
    m = b.match(/Interesse am Objekt\s+["“]([^"”]{5,180})["”]/i) || b.match(/interest in our listing\s+["“]([^"”]{5,180})["”]/i);
    if (m) return cleanInline_(m[1]);
  }

  if (/immomio|dawonia/i.test(portal)) {
    m = s.match(/Ihre Anfrage zu\s+(.+?)(?:!|$)/i) || s.match(/Objekt nicht mehr verfügbar\s*<(.+?)>/i);
    if (m) return cleanInline_(m[1]);
    m = b.match(/\n([^\n]{4,140})\n[^\n]*(?:Gesamtmiete|Zimmer|Größe):/i);
    if (m) return cleanInline_(m[1]);
  }

  return cleanTitle_(s);
}

function cleanTitle_(subject) {
  return String(subject || '')
    .replace(/^Neue Nachricht:\s*/i, '')
    .replace(/^Vielen Dank für (?:Ihre|deine) Anfrage[: ]*/i, '')
    .replace(/^Bewerbungseingang erfolgreich[: ]*/i, '')
    .replace(/^Ihre Mietanfrage für\s*/i, '')
    .replace(/^Deine Kontaktanfrage wurde erfolgreich versendet$/i, 'Wohnungsanfrage')
    .replace(/^Ihre persönliche Vorstellung beim Anbieter$/i, 'Wohnungsanfrage')
    .trim() || 'Wohnungsanfrage';
}

function cleanInline_(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function listingSection_(body, portal) {
  const b = String(body || '');
  if (/immoscout/i.test(portal)) {
    const start = b.search(/Daten zur Immobilie|Informationen zur Immobilie|Die Immobilie/i);
    if (start >= 0) return b.slice(start, start + 2200);
    return b.slice(0, 2200);
  }
  if (/immowelt/i.test(portal)) {
    const start = b.search(/Der Anbieter hat deine Anfrage erhalten|Angefragte Immobilie|Objektbezeichnung/i);
    const piece = start >= 0 ? b.slice(start) : b;
    return piece.split(/\nFirma:\s*\n|\nAngaben an den Anbieter:|\nDeine Angaben|Ähnliche Angebote für dich/i)[0];
  }
  return b.slice(0, 3500);
}

function extractAddress_(body, title, portal) {
  const b = String(body || '');
  const section = listingSection_(b, portal);
  let m;

  if (/immoscout/i.test(portal)) {
    m = section.match(/Adresse:\s*\n*\s*([^\n,]{2,100})\s*,\s*\n*\s*(\d{5})\s+([^\n]{2,80})/i);
    if (m) return cleanInline_(m[1]) + ', ' + m[2] + ' ' + cleanInline_(m[3]);
    m = section.match(/Adresse:\s*\n*\s*(\d{5})\s+([^,\n]{2,80}),?\s*\n*\s*([^\n]{2,100}(?:str\.|straße|strasse|weg|allee|ring|platz|gasse)\s+\d+[a-zA-Z]?)/i);
    if (m) return cleanInline_(m[3]) + ', ' + m[1] + ' ' + cleanInline_(m[2]);
    m = section.match(/Adresse:\s*([^\n]{2,140})/i);
    if (m && !/vollständige adresse/i.test(m[1])) {
      const oneLine = cleanInline_(m[1]);
      if (/\d{5}/.test(oneLine)) return oneLine;
    }
  }

  if (/immowelt/i.test(portal)) {
    m = section.match(/\n(\d{5})\s+([A-ZÄÖÜ][^\n]{1,70})\s*\n+\s*([A-ZÄÖÜ][^\n]{1,100}(?:str\.|straße|strasse|weg|allee|ring|platz|gasse)\s+\d+[a-zA-Z]?)\s*\n/i);
    if (m) return cleanInline_(m[3]) + ', ' + m[1] + ' ' + cleanInline_(m[2]);
    m = section.match(/\[([^\]\n]{2,80}),\s*\n*\s*([^\]\n]{2,80})\s*\n*\s*\((\d{5})\)\]/i);
    if (m) return cleanInline_(m[1]) + ', ' + m[3] + ' ' + cleanInline_(m[2]);
    m = section.match(/\n(\d{5})\s+([^\n]{2,70})\s*\n+\s*([^\n]{3,100})\s*\n/i);
    if (m && /(?:str\.|straße|strasse|weg|allee|ring|platz|gasse)\s+\d+/i.test(m[3])) return cleanInline_(m[3]) + ', ' + m[1] + ' ' + cleanInline_(m[2]);
  }

  if (/everreal/i.test(portal)) {
    m = String(title || '').match(/\bin\s+([^,"]+),\s*([^,"]+)$/i);
    if (m) return cleanInline_(m[2]) + ', ' + cleanInline_(m[1]);
  }

  if (/immomio|dawonia/i.test(portal)) {
    m = b.match(/([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\- ]{2,60}(?:straße|str\.|strasse|weg|allee|ring|platz|gasse)\s+\d+[a-zA-Z]?),\s*(\d{5})\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\- ]{2,50})/i);
    if (m) return cleanInline_(m[1]) + ', ' + m[2] + ' ' + cleanInline_(m[3]);
  }

  const banned = /(Invalidenstraße 65|Ostendstraße 113|Otto-Wagner-Str\. 30|Hansastr\. 27f|Max-Joseph-Str\. 2)/i;
  const re = /([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\- ]{2,55}(?:straße|str\.|strasse|weg|allee|ring|platz|gasse)\s+\d+[a-zA-Z]?)\s*,?\s*\n?\s*(\d{5})\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\- ]{2,45})/gi;
  while ((m = re.exec(section)) !== null) {
    const candidate = cleanInline_(m[1]) + ', ' + m[2] + ' ' + cleanInline_(m[3]);
    if (!banned.test(candidate)) return candidate;
  }
  return '';
}

function extractEuro_(body, portal) {
  const section = listingSection_(body, portal);
  let m = null;
  if (/immoscout/i.test(portal)) m = section.match(/Kaltmiete\s*:?\s*\n*\s*([\d.]+(?:,\d{1,2})?)\s*€/i);
  if (!m && /immowelt/i.test(portal)) m = section.match(/\n([\d.]+(?:,\d{1,2})?)\s*(?:Euro|€)\s*\n/i) || section.match(/\[([\d.]+(?:,\d{1,2})?)\s*€\]/i);
  if (!m && /immomio|dawonia/i.test(portal)) m = section.match(/Gesamtmiete:\s*\*?\s*([\d.]+(?:,\d{1,2})?)\s*€/i);
  if (!m) m = section.match(/(?:kaltmiete|nettokaltmiete)\s*:?\s*\n*\s*([\d.]+(?:,\d{1,2})?)\s*€/i);
  return m ? parseGermanNumber_(m[1]) : '';
}

function extractSqm_(body, portal) {
  const section = listingSection_(body, portal);
  const m = section.match(/Wohnfläche\s*:?\s*\n*\s*([\d.,]+)\s*m(?:²|2)/i) || section.match(/Größe:\s*\*?\s*([\d.,]+)\s*m(?:²|2)/i) || section.match(/ca\.\s*([\d.,]+)\s*m(?:²|2)/i) || section.match(/([1-9]\d{1,2}(?:[.,]\d+)?)\s*m(?:²|2)/i);
  return m ? parseGermanNumber_(m[1]) : '';
}

function extractRooms_(body, portal) {
  const section = listingSection_(body, portal);
  const m = section.match(/Zimmer\s*:?\s*\n*\s*([1-9](?:[.,]\d)?)/i) || section.match(/([1-9](?:[.,]\d)?)\s*Zimmer\b/i);
  return m ? parseGermanNumber_(m[1]) : '';
}

function parseGermanNumber_(value) {
  return Number(String(value || '').replace(/\./g, '').replace(',', '.'));
}

function normalizeKey_(value) {
  return String(value || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function isGenericTitle_(value) {
  return /^(wohnungsanfrage|ihre persönliche vorstellung beim anbieter|deine kontaktanfrage wurde erfolgreich versendet|vielen dank für deine anfrage|vielen dank für ihre anfrage|unser team hat ihnen geantwortet)/i.test(String(value || '').trim());
}

function matchExistingRow_(parsed, message) {
  const sheet = getSheet_();
  const last = Math.max(sheet.getLastRow(), 1);
  if (last < 2) return -1;

  const rows = sheet.getRange(2, 1, last - 1, WH.headers.length).getDisplayValues();
  const subject = normalizeKey_(message.subject);
  const address = normalizeKey_(parsed.address);
  const title = normalizeKey_(parsed.title);
  const canonicalId = parsed.canonicalId || '';
  let best = { row: -1, score: 0 };

  rows.forEach(function(r, i) {
    let score = 0;
    const rowTitle = normalizeKey_(r[0]);
    const rowAddress = normalizeKey_(r[1]);
    const rowId = r[14] || '';
    const lastMessageId = r[15] || '';
    const threadId = r[16] || '';
    const lastSubject = normalizeKey_(r[17]);

    if (lastMessageId && lastMessageId === message.messageId) score += 160;
    if (threadId && threadId === message.threadId) score += 150;
    if (canonicalId && rowId === canonicalId) score += 140;
    if (parsed.objectId && (rowId.indexOf(parsed.objectId) >= 0 || String(r[11] || '').indexOf(parsed.objectId) >= 0 || String(r[17] || '').indexOf(parsed.objectId) >= 0)) score += 120;
    if (address && rowAddress && (address === rowAddress || address.indexOf(rowAddress) >= 0 || rowAddress.indexOf(address) >= 0)) score += 70;
    if (title.length > 10 && rowTitle.length > 10 && (title.indexOf(rowTitle) >= 0 || rowTitle.indexOf(title) >= 0)) score += 55;
    if (subject && lastSubject && subject === lastSubject) score += 45;

    const postcodeA = address.match(/\b\d{5}\b/);
    const postcodeB = rowAddress.match(/\b\d{5}\b/);
    if (postcodeA && postcodeB && postcodeA[0] === postcodeB[0]) score += 15;
    if (score > best.score) best = { row: i + 2, score: score };
  });

  return best.score >= 45 ? best.row : -1;
}

function upsertRentalRow_(rowNumber, parsed, m) {
  const sheet = getSheet_();
  const now = Utilities.formatDate(m.date, Session.getScriptTimeZone() || 'Europe/Berlin', 'yyyy-MM-dd HH:mm');

  if (rowNumber < 2) {
    sheet.appendRow([
      parsed.title || 'Wohnungsanfrage', parsed.address || 'Adresse aus E-Mail prüfen', parsed.portal,
      parsed.kaltmiete, parsed.rooms, 'zu prüfen', humanStatus_(parsed.status), now, parsed.nextAction,
      'offen', extractContact_(m.from), parsed.note + ' | Gmail: https://mail.google.com/mail/u/0/#all/' + m.threadId,
      '', parsed.sqm, parsed.canonicalId || ('gmail:' + m.threadId), m.messageId, m.threadId, m.subject
    ]);
    return;
  }

  const current = sheet.getRange(rowNumber, 1, 1, WH.headers.length).getValues()[0];
  const isGmailBacked = /^gmail:/.test(String(current[14] || '')) || current[16] === m.threadId || current[15] === m.messageId || (parsed.canonicalId && current[14] === parsed.canonicalId);

  if (parsed.title && !isGenericTitle_(parsed.title) && (isGmailBacked || !current[0] || isGenericTitle_(current[0]))) current[0] = parsed.title;
  if (parsed.address && (isGmailBacked || !current[1] || /prüfen|invalidenstraße|ostendstraße|hansastr\. 27f|max-joseph-str\. 2/i.test(String(current[1])))) current[1] = parsed.address;
  if (parsed.portal) current[2] = parsed.portal;
  if (parsed.kaltmiete !== '' && parsed.kaltmiete != null && (isGmailBacked || !current[3] || Number(current[3]) === 0)) current[3] = parsed.kaltmiete;
  if (parsed.rooms !== '' && parsed.rooms != null && (isGmailBacked || !current[4] || Number(current[4]) > 5)) current[4] = parsed.rooms;
  current[6] = humanStatus_(parsed.status);
  current[7] = now;
  current[8] = parsed.nextAction;
  current[10] = current[10] || extractContact_(m.from);
  current[11] = parsed.note + ' | Gmail: https://mail.google.com/mail/u/0/#all/' + m.threadId;
  if (parsed.sqm !== '' && parsed.sqm != null && (isGmailBacked || !current[13])) current[13] = parsed.sqm;
  if (parsed.canonicalId && (isGmailBacked || !current[14] || /^gmail:/.test(String(current[14])))) current[14] = parsed.canonicalId;
  current[14] = current[14] || ('gmail:' + m.threadId);
  current[15] = m.messageId;
  current[16] = m.threadId;
  current[17] = m.subject;
  sheet.getRange(rowNumber, 1, 1, WH.headers.length).setValues([current]);
}

function cleanupNoiseRowsManual() {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) {
    SpreadsheetApp.getUi().alert('Nichts zu bereinigen.');
    return;
  }

  const rows = sheet.getRange(2, 1, last - 1, WH.headers.length).getDisplayValues();
  const toDelete = [];

  rows.forEach(function(r, i) {
    const title = String(r[0] || '').toLowerCase();
    const subject = String(r[17] || '').toLowerCase();
    const portal = String(r[2] || '').toLowerCase();
    const combined = title + ' ' + subject;

    const obviousNoise = /neue suche gespeichert|14-tage-überblick|neue ergebnisse sofort aufs smartphone|alternative angebote?: gezeichneter suchbereich|alternatives angebot: gezeichneter suchbereich|neues angebot: gezeichneter suchbereich|you shared some google account data|e-mail-adresse bestätigen|email-adresse bestätigen|registrierung erfolgreich|wie du ähnliche immobilien .* finden kannst/.test(combined);
    if (obviousNoise && /immowelt|immoscout|immomio|dawonia|google|e-mail/.test(portal + ' ' + combined)) toDelete.push(i + 2);
  });

  toDelete.sort(function(a, b) { return b - a; }).forEach(function(rowNumber) {
    sheet.deleteRow(rowNumber);
  });

  SpreadsheetApp.getUi().alert('Bereinigung fertig: ' + toDelete.length + ' offensichtliche Nicht-Bewerbungs-Mails entfernt.');
}

function extractContact_(from) {
  return String(from || '').replace(/<[^>]+>/g, '').trim();
}

function humanStatus_(status) {
  return ({
    new: 'Neu / Antwort prüfen',
    applied: 'Warten auf Prüfung',
    documents: 'Aktiv – Zusatzangaben / Unterlagen',
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
  const apartments = rows.filter(function(r) { return r[0]; }).map(function(r) {
    return {
      id: r[14] || '', title: r[0], address: r[1], portal: r[2], kaltmiete: r[3], rooms: r[4],
      transit: r[5], status: normalizeStatus_(r[6]), statusLabel: r[6], updatedAt: r[7], nextAction: r[8],
      documents: r[9], contact: r[10], note: r[11], score: r[12], sqm: r[13], threadId: r[16], subject: r[17]
    };
  }).sort(function(a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
  const counts = {};
  apartments.forEach(function(a) { counts[a.status] = (counts[a.status] || 0) + 1; });
  return { apartments: apartments, counts: counts, generatedAt: new Date().toISOString() };
}

function setApartmentStatus(id, status) {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) throw new Error('Keine Wohnungen gespeichert.');
  const ids = sheet.getRange(2, 15, last - 1, 1).getDisplayValues().map(function(r) { return r[0]; });
  const idx = ids.indexOf(id);
  if (idx < 0) throw new Error('Wohnung nicht gefunden: ' + id);
  const row = idx + 2;
  const next = ({
    new: 'Nachricht prüfen', applied: 'Auf Antwort warten', documents: 'Unterlagen / Zusatzangaben vervollständigen',
    viewing: 'Besichtigung prüfen / bestätigen', offer: 'Mietangebot prüfen / Jobcenter-Zusicherung',
    rejected: 'Keine Aktion', closed: 'Keine Aktion'
  })[status] || '';
  sheet.getRange(row, 7).setValue(humanStatus_(status));
  sheet.getRange(row, 8).setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Berlin', 'yyyy-MM-dd HH:mm'));
  sheet.getRange(row, 9).setValue(next);
  return getDashboardData();
}

function showWohnungHunterDashboard() {
  SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutput(INDEX_HTML_).setTitle('Wohnung Hunter').setWidth(440));
}

function doGet() {
  return HtmlService.createHtmlOutput(INDEX_HTML_).setTitle('Wohnung Hunter');
}

function ensureSheet_() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('WH_SPREADSHEET_ID');
  if (!spreadsheetId) {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (!active) throw new Error('Spreadsheet-ID fehlt. Einmal setupWohnungHunter aus der gebundenen Tabelle ausführen.');
    spreadsheetId = active.getId();
    props.setProperty('WH_SPREADSHEET_ID', spreadsheetId);
  }
  const ss = SpreadsheetApp.openById(spreadsheetId);
  let sheet = ss.getSheetByName(WH.sheetName);
  if (!sheet) sheet = ss.insertSheet(WH.sheetName);
  const width = Math.max(sheet.getLastColumn(), WH.headers.length);
  const existing = width ? sheet.getRange(1, 1, 1, width).getDisplayValues()[0] : [];
  WH.headers.forEach(function(h, i) {
    if (existing[i] !== h) sheet.getRange(1, i + 1).setValue(h);
  });
  sheet.setFrozenRows(1);
  return sheet;
}

function getSheet_() {
  return ensureSheet_();
}

function removeTriggers_(handler) {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === handler) ScriptApp.deleteTrigger(t);
  });
}

function loadSeen_() {
  try {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty('WH_SEEN') || '{}');
  } catch (e) {
    return {};
  }
}

function saveSeen_(seen) {
  const entries = Object.keys(seen).map(function(key) { return [key, seen[key]]; })
    .sort(function(a, b) { return Number(b[1]) - Number(a[1]); })
    .slice(0, 1200);
  const out = {};
  entries.forEach(function(entry) { out[entry[0]] = entry[1]; });
  PropertiesService.getScriptProperties().setProperty('WH_SEEN', JSON.stringify(out));
}

const INDEX_HTML_ = '<html><body style="font-family:Arial,sans-serif;padding:16px"><h2>🏠 Wohnung Hunter</h2><p>Gmail-Scan läuft automatisch. Reparatur und Bereinigung findest du im Menü <b>🏠 Wohnung Hunter</b> der Tabelle.</p></body></html>';
