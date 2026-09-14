const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = fs.readFileSync(path.join(__dirname, 'WohnungHunter.gs'), 'utf8');
const patch = fs.readFileSync(path.join(__dirname, 'WohnungHunter.v051.gs'), 'utf8');
new vm.Script(base, {filename:'WohnungHunter.gs'});
new vm.Script(patch, {filename:'WohnungHunter.v051.gs'});

const ctx = vm.createContext({console, Date, JSON, Object, String, Number, Array, RegExp, Math});
new vm.Script(base).runInContext(ctx);
new vm.Script(patch).runInContext(ctx);
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS ' + name); }

test('v0.5.1 sources compile', () => {
  assert.match(patch, /setupWohnungHunter051/);
  assert.match(patch, /scanRentalMail051/);
});

test('ohne-makler search notification is noise', () => {
  assert.equal(ctx.patchNoiseReason051_('Benachrichtigung zu Ihrer Immobiliensuche', 'ohne-makler <info@anfragen.ohne-makler.net>'), 'Suchbenachrichtigung / ohne-makler');
});

test('normal ohne-makler transaction is not hidden by patch rule', () => {
  assert.equal(ctx.patchNoiseReason051_('Ihre Anfrage wurde beantwortet', 'Makler <reply@anfragen.ohne-makler.net>'), '');
});

test('Everreal ID-less follow-up key requires exact title portal and sender domain', () => {
  const a = {title:'Geräumige 2-Zimmer-Wohnung mit Balkon in Moosach', portal:'Everreal', from:'Wohnungsbau <no-reply@m.everreal.co>'};
  const b = {title:'Geräumige 2-Zimmer-Wohnung mit Balkon in Moosach', portal:'Everreal', from:'Other <x@example.test>'};
  assert.ok(ctx.stableEventKey051_(a));
  assert.notEqual(ctx.stableEventKey051_(a), ctx.stableEventKey051_(b));
});

test('Dawonia strong signature is address rooms sqm', () => {
  const a = {portal:'Dawonia / Immomio', address:'Dickensstr. 17, 81243 München', rooms:1, sqm:39.67};
  const b = {portal:'Dawonia / Immomio', address:'Dickensstr. 17, 81243 München', rooms:1, sqm:39.67};
  const c = {portal:'Dawonia / Immomio', address:'Dickensstr. 17, 81243 München', rooms:1, sqm:40};
  assert.equal(ctx.dawoniaSignature051_(a), ctx.dawoniaSignature051_(b));
  assert.notEqual(ctx.dawoniaSignature051_(a), ctx.dawoniaSignature051_(c));
  assert.ok(ctx.dawoniaSignature051_(a));
});

test('conditional Ganghofer-style state is not terminal', () => {
  const r = Array(20).fill('');
  r[0] = 'Gemütliche Balkonwohnung in ruhiger Lage';
  r[6] = 'applied';
  r[8] = 'Antwort des Anbieters prüfen';
  r[11] = 'Erste Besichtigungsrunde voll, eventuell zweite Runde.';
  assert.equal(ctx.terminalKind051_(r), '');
});

test('Putzbrunn withdrawal is terminal and object number is extracted', () => {
  const r = Array(20).fill('');
  r[0] = 'Objekt 10765 – Rücknahme meiner Anfrage';
  r[11] = 'Ich möchte meine Anfrage zurückziehen und auf eine Besichtigung verzichten.';
  assert.equal(ctx.terminalKind051_(r), 'withdrawn');
  assert.deepEqual(Array.from(ctx.rowObjectNumbers051_(r)), ['10765']);
});

test('documents column alone does not create terminal override', () => {
  const r = Array(20).fill('');
  r[6] = 'documents';
  r[9] = 'geschlossen';
  assert.equal(ctx.terminalKind051_(r), '');
});

test('rejection is terminal but withdrawal wins on conflict', () => {
  const r = Array(20).fill('');
  r[6] = 'Abgelehnt';
  assert.equal(ctx.terminalKind051_(r), 'rejected');
  assert.equal(ctx.strongerTerminal051_('rejected','withdrawn'), 'withdrawn');
});

class Sheet {
  constructor(data) { this.data = data.map(r => r.slice()); }
  getLastRow() { return this.data.length; }
  getRange(r,c,h=1,w=1) {
    const self = this;
    return {
      getValues() { return Array.from({length:h},(_,i)=>Array.from({length:w},(_,j)=>self.data[r+i-1]?.[c+j-1] ?? '')); },
      setValues(rows) { rows.forEach((row,i)=>row.forEach((v,j)=>{ self.data[r+i-1] ||= []; self.data[r+i-1][c+j-1]=v; })); return this; },
      setValue(v) { self.data[r-1] ||= []; self.data[r-1][c-1]=v; return this; }
    };
  }
}
function row(values={}) {
  const r = Array(20).fill('');
  Object.keys(values).forEach(k => r[Number(k)] = values[k]);
  return r;
}

test('Putzbrunn withdrawal protects both viewing mail and Immowelt alias, preserving F/J/L/M', () => {
  const header = ctx.WH.headers.slice();
  const main = new Sheet([header,
    row({0:'Jetzt Besichtigung zur Immobile 10765 vereinbaren oder Adresse erhalten!',5:'BUS',6:'viewing',8:'Besichtigung prüfen / bestätigen',9:'DOCS',11:'NOTE',12:'SCORE',14:'gmail-message:view',19:'0.5'}),
    row({0:'Charmantes 1-Zimmer-Appartment mit separater EBK und Terrasse in Putzbrunn',5:'BUS2',6:'applied',8:'Auf Antwort warten',9:'DOCS2',11:'NOTE2',12:'SCORE2',14:'immowelt:2rgfs5v',19:'0.5'})
  ]);
  const backup = new Sheet([header,
    row({0:'Objekt 10765 – Rücknahme meiner Anfrage',11:'Ich möchte meine Anfrage zurückziehen und auf eine Besichtigung verzichten.',14:'gmail:withdraw'}),
    row({0:'Charmantes 1-Zimmer-Appartment mit separater EBK und Terrasse in Putzbrunn',11:'Online-ID 2rgfs5v; Makler-Nr. : 10765',14:'immowelt:2rgfs5v'})
  ]);
  const ss = {getSheetByName:name => name === ctx.WH.backupSheet ? backup : null};
  const changed = ctx.applyTerminalOverrides051_({main,ss});
  assert.equal(changed,2);
  for (const r of main.data.slice(1)) {
    assert.equal(r[6],'withdrawn');
    assert.equal(r[8],'Keine Aktion');
  }
  assert.deepEqual(main.data[1].slice(5,13).filter((_,i)=>[0,4,6,7].includes(i)), ['BUS','DOCS','NOTE','SCORE']);
  assert.deepEqual(main.data[2].slice(5,13).filter((_,i)=>[0,4,6,7].includes(i)), ['BUS2','DOCS2','NOTE2','SCORE2']);
});

test('patch never writes user-managed F/J/L/M columns', () => {
  assert.doesNotMatch(patch, /getRange\(rowNumber,\s*(?:6|10|12|13)\b/);
});

console.log(`v0.5.1: ${passed} checks passed`);
