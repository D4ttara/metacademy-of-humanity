const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = fs.readFileSync(path.join(__dirname, 'WohnungHunter.gs'), 'utf8');
const patch = fs.readFileSync(path.join(__dirname, 'WohnungHunter.v051.gs'), 'utf8');
const safe = fs.readFileSync(path.join(__dirname, 'WohnungHunter.v051.safe.gs'), 'utf8');
new vm.Script(base, {filename:'WohnungHunter.gs'});
new vm.Script(patch, {filename:'WohnungHunter.v051.gs'});
new vm.Script(safe, {filename:'WohnungHunter.v051.safe.gs'});

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS ' + name); }

test('safe hotfix compiles and installs a distinct trigger handler', () => {
  assert.match(safe, /setupWohnungHunter051Safe/);
  assert.match(safe, /scanRentalMail051Safe/);
  assert.match(safe, /everyMinutes\(5\)/);
});

test('safe setup performs no immediate Gmail scan', () => {
  const m = safe.match(/function setupWohnungHunter051Safe\(\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(m);
  assert.doesNotMatch(m[1], /scanRentalMail\s*\(|scanRentalMail051Safe\s*\(/);
});

test('automatic safe pass omits deep alias normalization', () => {
  const m = safe.match(/function postProcess051Safe_\(\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(m);
  assert.match(m[1], /suppressNoise051_/);
  assert.match(m[1], /applyTerminalOverrides051_/);
  assert.doesNotMatch(m[1], /normalizeAliases051_/);
});

test('automatic pass skips safety work after a slow base scan', () => {
  assert.match(safe, /maxBaseMsBeforePatch:\s*150000/);
  assert.match(safe, /elapsed > WH051SAFE\.maxBaseMsBeforePatch/);
  assert.match(safe, /skipped:\s*true/);
});

test('safe installer removes old v0.5 and v0.5.1 trigger handlers', () => {
  assert.match(safe, /h === 'scanRentalMail'/);
  assert.match(safe, /h === 'scanRentalMail051'/);
});

console.log(`v0.5.1-safe: ${passed} checks passed`);
