/**
 * Wohnung Hunter v0.5.1-safe2 — no blocking UI calls.
 *
 * Add this file next to WohnungHunter.gs and WohnungHunter.v051.gs.
 * Run setupWohnungHunter051Safe() once from the Apps Script editor.
 *
 * Important: SpreadsheetApp.getUi().alert() blocks the server-side execution
 * until a dialog is dismissed in the bound Sheet. When a function is launched
 * from the Apps Script editor that dialog can be invisible, which makes an
 * otherwise finished setup hit Google's 6-minute execution limit. Therefore
 * every editor-facing function in this file logs/returns status instead of
 * opening a modal alert.
 */
var WH051SAFE = {
  version: '0.5.1-safe2',
  scanHandler: 'scanRentalMail051Safe',
  maxBaseMsBeforePatch: 150000
};

function log051Safe_(message) {
  console.log(message);
  return message;
}

function setupWohnungHunter051Safe() {
  var result = withLock_(function() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Setup aus der gebundenen Wohnung-Hunter-Tabelle starten.');
    var stored = props_().getProperty('WH_SPREADSHEET_ID');
    if (stored && stored !== ss.getId()) throw new Error('Andere Tabelle gespeichert. Bitte die ursprüngliche Tabelle öffnen.');
    if (!stored) props_().setProperty('WH_SPREADSHEET_ID', ss.getId());

    var trigger = ScriptApp.newTrigger(WH051SAFE.scanHandler).timeBased().everyMinutes(5).create();
    ScriptApp.getProjectTriggers().forEach(function(t) {
      var h = t.getHandlerFunction();
      if ((h === 'scanRentalMail' || h === 'scanRentalMail051' || h === WH051SAFE.scanHandler) &&
          t.getUniqueId() !== trigger.getUniqueId()) {
        ScriptApp.deleteTrigger(t);
      }
    });
    props_().setProperty('WH_PATCH_VERSION', WH051SAFE.version);
    return { ready: true, version: WH051SAFE.version, trigger: 1 };
  });

  if (result.busy) {
    log051Safe_('Hunter arbeitet gerade. Safe-Setup gleich erneut starten.');
    return { busy: true };
  }
  log051Safe_('Wohnung Hunter ' + WH051SAFE.version + ' aktiv. 5-Minuten-Trigger installiert. Kein Sofort-Scan.');
  return result;
}

function scanRentalMail051Safe() {
  var started = Date.now();
  var result = scanRentalMail();
  if (!result || result.busy || result.setupRequired) return result;

  var elapsed = Date.now() - started;
  if (elapsed > WH051SAFE.maxBaseMsBeforePatch) {
    result.patch = { skipped: true, reason: 'Basislauf dauerte ' + elapsed + ' ms; Safety-Pass auf nächsten Lauf verschoben.' };
    return result;
  }

  var patch = withLock_(function() { return postProcess051Safe_(); });
  result.patch = patch;
  return result;
}

function postProcess051Safe_() {
  var sheets = ensureSheets_();
  var result = { noise: 0, aliased: 0, terminal: 0 };
  result.noise = suppressNoise051_(sheets);
  result.terminal = applyTerminalOverrides051_(sheets);
  SpreadsheetApp.flush();
  return result;
}

function runWohnungHunter051SafeManual() {
  var result = withLock_(function() { return postProcess051Safe_(); });
  if (result.busy) {
    log051Safe_('Hunter arbeitet gerade.');
    return result;
  }
  log051Safe_('v0.5.1-safe2: ' + (result.noise || 0) + ' Noise, ' +
    (result.terminal || 0) + ' Terminal-Overrides.');
  return result;
}

function showWohnungHunter051SafeStatus() {
  var triggers = ScriptApp.getProjectTriggers().filter(function(t) {
    return t.getHandlerFunction() === WH051SAFE.scanHandler;
  }).length;
  var status = {
    patch: props_().getProperty('WH_PATCH_VERSION') || '?',
    safeTriggers: triggers,
    baseParser: props_().getProperty('WH_VERSION') || '?'
  };
  log051Safe_('Wohnung Hunter ' + status.patch + '; Safe-Trigger: ' + status.safeTriggers + '; Basisparser: v' + status.baseParser);
  return status;
}
