/**
 * Wohnung Hunter v0.5.1 timeout hotfix.
 *
 * Add this file next to WohnungHunter.gs and WohnungHunter.v051.gs.
 * Run setupWohnungHunter051Safe() once.
 *
 * Why: the first v0.5.1 setup can exceed Apps Script's execution limit because
 * it performs a Gmail scan and a deep alias rebuild in the same invocation.
 * This hotfix installs the trigger without an immediate scan and keeps the
 * automatic 5-minute pass conservative: Gmail ingest first, then only the
 * cheap safety layers when enough execution budget remains.
 */
var WH051SAFE = {
  version: '0.5.1-safe',
  scanHandler: 'scanRentalMail051Safe',
  maxBaseMsBeforePatch: 150000
};

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
    return { ready: true };
  });

  if (result.busy) return alert_('Hunter arbeitet gerade. Safe-Setup gleich erneut starten.');
  alert_('Wohnung Hunter v0.5.1-safe aktiv.\n' +
    'Der 5-Minuten-Trigger ist installiert. Kein Sofort-Scan, damit das Setup nicht mehr in das 6-Minuten-Limit läuft.');
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
  // Cheap and critical only. Deep alias normalization stays manual because it
  // can touch many historical rows and is the part most likely to exceed the
  // Apps Script wall-clock limit.
  result.noise = suppressNoise051_(sheets);
  result.terminal = applyTerminalOverrides051_(sheets);
  SpreadsheetApp.flush();
  return result;
}

function runWohnungHunter051SafeManual() {
  var result = withLock_(function() { return postProcess051Safe_(); });
  if (result.busy) return alert_('Hunter arbeitet gerade.');
  alert_('v0.5.1-safe: ' + (result.noise || 0) + ' Noise, ' +
    (result.terminal || 0) + ' Terminal-Overrides.');
}

function showWohnungHunter051SafeStatus() {
  var triggers = ScriptApp.getProjectTriggers().filter(function(t) {
    return t.getHandlerFunction() === WH051SAFE.scanHandler;
  }).length;
  alert_('Wohnung Hunter ' + (props_().getProperty('WH_PATCH_VERSION') || '?') +
    '\nSafe-Trigger: ' + triggers +
    '\nBasisparser: v' + (props_().getProperty('WH_VERSION') || '?'));
}
