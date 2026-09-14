// Dependency-free local tests. Gmail/Sheets/Properties/locks are simulated.
// All committed mail fixtures are synthetic; no applicant correspondence.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, 'WohnungHunter.gs'), 'utf8');
const compiled = new vm.Script(source, { filename: 'WohnungHunter.gs' });
let passed = 0;
function test(name, fn) { try { fn(); passed++; console.log('PASS ' + name); } catch(e) { console.error('FAIL ' + name); throw e; } }

class Sheet {
  constructor(name, book) { this.name = name; this.book = book; this.data = []; this.notes = {}; this.maxRows = 100; this.maxColumns = 26; }
  getLastRow() { return this.data.length; }
  getMaxRows() { return this.maxRows; }
  getMaxColumns() { return this.maxColumns; }
  insertRowsAfter(_, count) { this.maxRows += count; }
  insertColumnsAfter(_, count) { this.maxColumns += count; }
  setFrozenRows() {}
  hideSheet() {}
  getRange(r, c, h = 1, w = 1) {
    const sheet = this;
    return {
      getValues() { return Array.from({length:h}, (_,i) => Array.from({length:w}, (_,j) => sheet.data[r+i-1]?.[c+j-1] ?? '')); },
      getDisplayValues() { return this.getValues().map(row => row.map(String)); },
      getFormulas() { return this.getValues().map(row => row.map(v=>typeof v === 'string' && v.startsWith('=') ? v : '')); },
      setValues(rows) {
        assert.equal(rows.length, h);
        rows.forEach((row,i) => { assert.equal(row.length,w); sheet.data[r+i-1] ||= []; row.forEach((v,j) => { sheet.data[r+i-1][c+j-1] = v; }); });
        return this;
      },
      setNote(text) { sheet.notes[r+':'+c] = text; return this; },
      setNumberFormat() { return this; }
    };
  }
  deleteRow(n) { this.data.splice(n-1,1); }
  copyTo(book) { const copy = book.insertSheet('Copy of ' + this.name); copy.data = this.data.map(r=>r.slice()); return copy; }
  setName(name) { delete this.book.sheets[this.name]; this.name = name; this.book.sheets[name] = this; return this; }
}

function runtime() {
  const properties = {}, messages = [], alerts = [], searches = [], triggers = [];
  const book = { sheets: {}, getId:()=> 'test-sheet', getSheetByName(name) { return this.sheets[name]; }, insertSheet(name) { return this.sheets[name] = new Sheet(name,this); } };
  let triggerId = 0, bodyReads = 0, busy = false;
  const prop = { getProperty:k=>properties[k]??null, setProperty(k,v) { assert.ok(Buffer.byteLength(v)<9000, 'property value quota'); properties[k]=v; return this; }, deleteProperty(k) { delete properties[k]; return this; } };
  const ui = {alert:x=>alerts.push(x), createMenu() { return {addItem(){return this;},addSeparator(){return this;},addToUi(){}}; }};
  const ctx = vm.createContext({console, Date, JSON, Object, String, Number, Array, RegExp, Math,
    PropertiesService: {getScriptProperties:()=>prop},
    SpreadsheetApp: {getActiveSpreadsheet:()=>book, openById:()=>book, flush(){}, getUi:()=>ui},
    Session: {getEffectiveUser:()=>({getEmail:()=> 'owner@example.test'})},
    LockService: {getScriptLock:()=>({tryLock:()=>!busy,releaseLock(){}})},
    ScriptApp: {
      getProjectTriggers:()=>triggers.slice(), deleteTrigger:t=>triggers.splice(triggers.indexOf(t),1),
      newTrigger(handler) { let minutes; return { timeBased(){return this;}, everyMinutes(n){minutes=n;return this;}, create(){assert.equal(minutes,5);const id=++triggerId; const t={getHandlerFunction:()=>handler,getUniqueId:()=>String(id)}; triggers.push(t);return t;} }; }
    },
    GmailApp: {
      getAliases:()=>['alias@example.test'],
      search(q, offset, limit) {
        searches.push({q,offset,limit});
        const after=Number(q.match(/after:(\d+)/)[1])*1000, before=Number(q.match(/before:(\d+)/)[1])*1000;
        const ids=[...new Set(messages.filter(m=>m.date>=after&&m.date<before&&!m.draft).map(m=>m.threadId))];
        ids.sort((a,b)=>Math.max(...messages.filter(m=>m.threadId===b).map(m=>+m.date))-Math.max(...messages.filter(m=>m.threadId===a).map(m=>+m.date)));
        return ids.slice(offset,offset+limit).map(thread);
      },
      getMessageById(id) {const m=messages.find(x=>x.messageId===id);if(!m||m.fail) throw new Error('fixture unavailable');return wrap(m);}
    }
  });
  function thread(id) {return {getId:()=>id,getMessages:()=>messages.filter(m=>m.threadId===id).map(wrap)};}
  function wrap(m) {return {getId:()=>m.messageId,getThread:()=>thread(m.threadId),getFrom:()=>m.from,getSubject:()=>m.subject,getDate:()=>m.date,isDraft:()=>!!m.draft,getPlainBody:()=>{bodyReads++;return m.body;},getBody:()=>m.html||''};}
  compiled.runInContext(ctx);
  return {ctx,properties,messages,alerts,searches,triggers,book,bodyReads:()=>bodyReads,setBusy:v=>busy=v};
}
function mail(overrides={}) {return {messageId:'msg1',threadId:'shared',from:'agent@immobilienscout24.de',subject:'Vielen Dank für Ihre Anfrage (Objekt 12345678)',body:'Ihre Anfrage wurde übermittelt.\nDaten zur Immobilie\nRuhige Wohnung\nScout-ID: 12345678\nAdresse: Beispielweg 2, 80000 Teststadt\nKaltmiete: 750,00 €\nZimmer: 2,5\nWohnfläche: 55,5 m²',date:new Date(Date.now()-3600000),...overrides};}
const ctx=runtime().ctx;
function parse(overrides) {return ctx.parseRentalMessage_(mail(overrides));}
function status(subject,body='') {return ctx.detectStatus_(subject,body).status;}

test('whole source compiles and uses no Node/browser runtime or HTML UI',()=>{
  assert.ok(source.length>10000);
  assert.doesNotMatch(source,/HtmlService|INDEX_HTML|function doGet|showSidebar|\brequire\(|\bfetch\(|\bURL\(|\bimport\s/);
});
test('Scout ID, cold rent, fractional rooms, size',()=>{const p=parse();assert.equal(p.canonicalId,'is24:12345678');assert.equal(p.kaltmiete,750);assert.equal(p.rooms,2.5);assert.equal(p.sqm,55.5);assert.equal(p.status,'applied');});
test('domain-scoped Scout direct URL',()=>{assert.equal(ctx.identity_('https://www.immobilienscout24.de/12345678','ImmoScout24').id,'is24:12345678');});
test('Immowelt case normalized',()=>{assert.equal(ctx.identity_('Online-ID: [2ABCD99] https://www.immowelt.de/expose/2abcd99','Immowelt').id,'immowelt:2abcd99');});
test('Everreal UUID extracted only from apply path',()=>{const id='11111111-2222-3333-4444-555555555555';assert.equal(ctx.identity_('https://team.everreal.co/app/public/apply/'+id+'/applications/step1/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee','Everreal').id,'everreal:'+id);assert.equal(ctx.identity_('https://resources.everreal.co/privacy/'+id+'.pdf','Everreal').id,'');});
test('Immomio encoded numeric and UUID application IDs',()=>{assert.equal(ctx.identity_('applicationId%22%3A123456789','Immomio').id,'immomio:123456789');assert.equal(ctx.identity_('applicationId="11111111-2222-3333-4444-555555555555"','Immomio').id,'immomio:11111111-2222-3333-4444-555555555555');});
test('Immomio expose ID is not an application ID',()=>{assert.equal(ctx.identity_('https://tenant.immomio.com/de/expose/123456789','Immomio').id,'');});
test('unrelated domain and arbitrary number never become portal ID',()=>{assert.equal(ctx.identity_('https://evil.test/expose/12345678 Order 12345678','ImmoScout24').id,'');});
test('encoded tracking target is decoded locally',()=>{assert.equal(ctx.identity_('https://tracking.test/?url='+encodeURIComponent('https://www.immowelt.de/expose/2abcd99'),'Immowelt').id,'immowelt:2abcd99');});
test('conflicting same-portal IDs stay isolated and blank listing fields',()=>{const p=parse({body:mail().body+'\nScout-ID: 87654321'});assert.equal(p.canonicalId,'gmail-message:msg1');assert.equal(p.kaltmiete,'');assert.match(p.review,/Mehrere/);});
test('cross-portal ambiguity is never an alias',()=>{const p=parse({body:mail().body+'\nOnline-ID: 2abcd99'});assert.equal(p.canonicalId,'gmail-message:msg1');});
test('no ID fallback is per message not thread',()=>{const a=parse({subject:'Ihre Anfrage',body:'Vielen Dank für Ihre Wohnungsanfrage.',messageId:'m1'}),b=parse({subject:'Ihre Anfrage',body:'Vielen Dank für Ihre Wohnungsanfrage.',messageId:'m2'});assert.notEqual(a.canonicalId,b.canonicalId);});
test('Google and registration noise',()=>{for(const subject of ['Neue Suche gespeichert','Registrierung erfolgreich','E-Mail-Adresse bestätigen','You shared some Google account data','Security alert']) assert.equal(parse({subject}).relevant,false);});
test('search alerts containing application buttons are rejected',()=>{for(const subject of ['1 Angebot: Mietwohnung','2 neue Angebote: München','1 alternatives Angebot: gezeichneter Suchbereich','14-Tage-Überblick neuer Angebote']) assert.equal(parse({subject,body:mail().body+' Jetzt Bewerbung senden und Besichtigung buchen'}).relevant,false);});
test('sent mail and drafts are rejected',()=>{assert.equal(parse({outgoing:true}).relevant,false);assert.equal(parse({draft:true}).relevant,false);});
test('no rental context no row',()=>{assert.equal(parse({from:'jobs@example.test',subject:'Ihre Bewerbung',body:'Ihre Bewerbung wurde eingereicht.'}).relevant,false);});
test('Dawonia unavailable is rejected',()=>{assert.equal(status('Objekt nicht mehr verfügbar <Wohnung>'),'rejected');});
test('concrete viewing is viewing',()=>{assert.equal(status('Einladung zur Besichtigung','Bitte wählen Sie Ihren Besichtigungstermin aus.'),'viewing');});
test('Oliver-style conditional invitation stays applied',()=>{assert.equal(status('Neue Nachricht','Ich werde Ihre Anfrage prüfen und mich wieder melden wenn wir einen Termin zur Besichtigung vereinbaren können.'),'applied');});
test('Immomio contingent booking boilerplate stays applied',()=>{assert.equal(status('Bewerbungseingang erfolgreich','Sie werden benachrichtigt, sobald wir Sie eingeladen haben. In Ihrem Mieterbereich können Sie gegebenenfalls einen Besichtigungstermin auswählen.'),'applied');});
test('documents prerequisite before viewing stays documents',()=>{assert.equal(status('Vervollständigen Sie Ihre Immobilienanfrage','Bevor wir einen Besichtigungstermin vereinbaren können, brauchen wir weitere Informationen über Sie. Anfrage abschließen.'),'documents');});
test('real invitation survives unrelated conditional sentence',()=>{assert.equal(status('Einladung zur Besichtigung','Wir laden Sie zur Besichtigung ein. Falls Sie Unterlagen haben, bringen Sie diese mit.'),'viewing');});
test('applicant copied request does not become viewing/documents',()=>{const p=parse({body:'Der Anbieter hat Ihre Anfrage erhalten.\nObjektdaten\nOnline-ID: 2abcd99\nDeine Info --------\nÜber eine Einladung zur Besichtigung würde ich mich freuen. SCHUFA und Unterlagen kann ich vorlegen.',subject:'Vielen Dank für deine Anfrage',from:'info@immowelt.de'});assert.equal(p.status,'applied');});
test('quoted historical offer/rejection does not control new event',()=>{assert.equal(parse({body:'Vielen Dank für Ihre Anfrage.\nOn Monday someone wrote:\nAbsage. Scout-ID: 87654321'}).status,'applied');});
test('contract offer concrete, hypothetical contract not offer',()=>{assert.equal(status('Ihr Mietangebot','Anbei erhalten Sie den Mietvertrag zur Unterschrift.'),'offer');assert.equal(status('Ihre Anfrage','Falls es zu einem Mietvertrag kommt, benötigen wir später Daten.'),'applied');});
test('HTML entities and buttons work without HTML UI',()=>{const p=parse({subject:'Ihre Wohnungsanfrage',body:'',html:'<style>fake</style><div>Bitte vervollst&auml;ndigen Sie Ihre Angaben.</div><a href="https://www.immobilienscout24.de/expose/12345678">Anfrage abschließen</a>'});assert.equal(p.status,'documents');assert.equal(p.canonicalId,'is24:12345678');});
test('plain Markdown quotation used by Scout retains landlord reply',()=>{assert.equal(parse({subject:'Neue Nachricht (Objekt 12345678)',body:'> Wir laden Sie zur Besichtigung ein.'}).status,'viewing');});
test('generic price/total rent does not populate cold rent',()=>{assert.equal(ctx.listing_('Wohnung','Objektdaten\nPreis: 900 Euro\nGesamtmiete: 1000 €').kaltmiete,'');});
test('provider footer is excluded from listing',()=>{const p=parse({body:'Daten zur Immobilie\nSchöne Wohnung\nKaltmiete: 500 €\nKontaktdaten des Anbieters\nAdresse: Bürostraße 45, 80000 Teststadt\nZimmer: 9'});assert.equal(p.address,'');assert.equal(p.rooms,'');});
test('German and decimal-point numbers',()=>{for(const [s,n] of [['1.250,50',1250.5],['2,5',2.5],['2.5',2.5],['1.250',1250]]) assert.equal(ctx.number_(s),n);});
test('rooms cannot match trailing digit of a 49 square metre value',()=>{assert.equal(ctx.listing_('','49 Zimmer').rooms,'');assert.equal(ctx.listing_('','49 m²\nZimmer\n2.5').rooms,2.5);assert.equal(ctx.listing_('','2-Zimmer-Wohnung · 49 m²').sqm,49);});
test('generic account footer is not a request for documents',()=>{assert.equal(status('Bewerbungseingang erfolgreich','Bitte nicht auf diese E-Mail antworten. Weitere Informationen finden Sie im Impressum.'),'applied');});
test('bare rental offer subject is recognized',()=>{assert.equal(status('Ihr Mietangebot zur Wohnung Beispielweg 2'),'offer');});
test('formula injection is escaped',()=>{assert.equal(ctx.safeCell_('=IMPORTXML("bad")'),'\'=IMPORTXML("bad")');assert.equal(ctx.safeCell_(123),123);});

function rows(r) {return r.book.getSheetByName('Wohnungen').data.slice(1);}
function setup(r) {r.ctx.setupWohnungHunter();}
test('setup creates exactly one five-minute trigger even after repeat',()=>{const r=runtime();setup(r);setup(r);assert.equal(r.triggers.length,1);});
test('trigger before setup cannot mutate legacy sheet',()=>{const r=runtime();assert.equal(r.ctx.scanRentalMail().setupRequired,true);assert.equal(Object.keys(r.book.sheets).length,0);});
test('same Gmail thread and subject with two IDs yields two apartments',()=>{const r=runtime();r.messages.push(mail(),mail({messageId:'m2',body:mail().body.replaceAll('12345678','87654321').replace('750,00','900,00'),subject:'Vielen Dank für Ihre Anfrage (Objekt 87654321)'}));setup(r);assert.equal(rows(r).length,2);assert.deepEqual(rows(r).map(x=>x[3]).sort(),[750,900]);});
test('same canonical ID across threads updates one row',()=>{const r=runtime();r.messages.push(mail(),mail({messageId:'m2',threadId:'other',subject:'Einladung zur Besichtigung (Objekt 12345678)',body:'Wir laden Sie zur Besichtigung ein.',date:new Date(Date.now()-1800000)}));setup(r);assert.equal(rows(r).length,1);assert.equal(rows(r)[0][6],'viewing');});
test('repeat scan and repair are idempotent',()=>{const r=runtime();r.messages.push(mail());setup(r);r.ctx.scanRentalMail();r.ctx.repairRecentBatchManual();r.ctx.repairRecentBatchManual();assert.equal(rows(r).length,1);assert.equal(r.book.getSheetByName('WH_Events_v05').data.length,2);});
test('older confirmation never overwrites newer rejection during repair',()=>{const r=runtime();r.messages.push(mail({subject:'Objekt nicht mehr verfügbar (Objekt 12345678)',date:new Date(Date.now()-1000000)}),mail({messageId:'older',date:new Date(Date.now()-5000000)}));setup(r);assert.equal(rows(r)[0][6],'rejected');r.ctx.repairRecentBatchManual();assert.equal(rows(r)[0][6],'rejected');});
test('generic new reply keeps actionable status but asks to review response',()=>{const r=runtime();r.messages.push(mail({subject:'Einladung zur Besichtigung (Objekt 12345678)'}),mail({messageId:'reply',subject:'Neue Nachricht (Objekt 12345678)',body:'Guten Tag, wir melden uns morgen.',date:new Date(Date.now()-1000000)}));setup(r);assert.equal(rows(r)[0][6],'viewing');assert.match(rows(r)[0][8],/Antwort/);});
test('20-message bound including large shared thread',()=>{const r=runtime();for(let i=0;i<53;i++) r.messages.push(mail({messageId:'m'+i}));setup(r);assert.equal(r.bodyReads(),20);r.ctx.scanRentalMail();assert.equal(r.bodyReads(),40);r.ctx.scanRentalMail();assert.equal(r.bodyReads(),53);assert.equal(rows(r).length,1);});
test('pagination processes over 80 threads without starvation',()=>{const r=runtime();for(let i=0;i<101;i++) r.messages.push(mail({messageId:'m'+i,threadId:'t'+i}));setup(r);for(let i=0;i<7;i++)r.ctx.scanRentalMail();assert.equal(r.book.getSheetByName('WH_Events_v05').data.length,102);assert.ok(r.searches.some(x=>x.offset===80));});
test('old messages returned inside matching thread are excluded by date',()=>{const r=runtime();r.messages.push(mail(),mail({messageId:'old',date:new Date(Date.now()-90*86400000)}));setup(r);assert.equal(r.bodyReads(),1);});
test('own account alias is filtered during runtime',()=>{const r=runtime();r.messages.push(mail({from:'Alias <alias@example.test>'}));setup(r);assert.equal(rows(r).length,0);});
test('legacy corrupt rows backed up, source queued, no false fields inherited',()=>{const r=runtime();r.properties.WH_SPREADSHEET_ID='test-sheet';const s=r.book.insertSheet('Wohnungen');s.data=[Array.from(r.ctx.WH.headers).slice(0,18),['Wrong','Wrong street','ImmoScout24',999,9,'manual transit','Besichtigung','2026-01-01','old','private docs','agent','manual note',10,99,'is24:87654321','msg1','shared','old']];r.messages.push(mail());setup(r);assert.equal(rows(r).length,1);assert.equal(rows(r)[0][14],'is24:12345678');assert.equal(rows(r)[0][3],750);assert.equal(r.book.getSheetByName('WH_Backup_v04').data[1][11],'manual note');assert.equal(rows(r)[0][11],'');});
test('manual unimported rows stay untouched during migration',()=>{const r=runtime();r.properties.WH_SPREADSHEET_ID='test-sheet';const s=r.book.insertSheet('Wohnungen');s.data=[Array.from(r.ctx.WH.headers).slice(0,18),['Manually entered']];setup(r);assert.equal(rows(r)[0][0],'Manually entered');});
test('manual fields in v0.5 row survive later messages',()=>{const r=runtime();r.messages.push(mail());setup(r);const row=rows(r)[0];row[5]='U-Bahn';row[9]='sent';row[11]='my note';row[12]=0;r.messages.push(mail({messageId:'m2',date:new Date(Date.now()-500000)}));r.ctx.scanRentalMail();assert.equal(rows(r)[0][5],'U-Bahn');assert.equal(rows(r)[0][9],'sent');assert.equal(rows(r)[0][11],'my note');assert.equal(rows(r)[0][12],0);});
test('single failing message is retried, visible, and does not stop others',()=>{const r=runtime();r.messages.push(mail({fail:true}),mail({messageId:'ok'}));setup(r);r.ctx.scanRentalMail();r.ctx.scanRentalMail();const q=r.book.getSheetByName('WH_Queue_v05').data;assert.equal(q.find(x=>x[1]==='msg1')[2],'failed');assert.equal(rows(r).length,1);r.messages[0].fail=false;r.ctx.retryFailedMessagesManual();r.ctx.scanRentalMail();assert.equal(q.find(x=>x[1]==='msg1')[2],'done');});
test('concurrent invocations do no work',()=>{const r=runtime();r.setBusy(true);assert.equal(r.ctx.scanRentalMail().busy,true);assert.equal(r.searches.length,0);});
test('projection retry removes old identity even after durable event was replaced',()=>{
  const r=runtime();r.messages.push(mail());setup(r);
  r.messages[0].subject='Vielen Dank für Ihre Anfrage (Objekt 87654321)';r.messages[0].body=mail().body.replaceAll('12345678','87654321');
  const original=r.ctx.renderKey_;let once=true;
  r.ctx.renderKey_=function(...args){if(once){once=false;throw new Error('injected write interruption');}return original(...args);};
  r.ctx.repairRecentBatchManual();r.ctx.repairRecentBatchManual();
  assert.equal(rows(r).length,1);assert.equal(rows(r)[0][14],'is24:87654321');
});
test('failed abandoned repair is retried by the automatic queue',()=>{
  const r=runtime();r.messages.push(mail());setup(r);r.messages[0].fail=true;
  for(let i=0;i<3;i++)r.ctx.repairRecentBatchManual();
  r.ctx.resetRepairCursorManual();r.messages[0].fail=false;r.ctx.retryFailedMessagesManual();r.ctx.scanRentalMail();
  const q=r.book.getSheetByName('WH_Queue_v05').data;
  assert.equal(q.find(x=>x[0]==='scan'&&x[1]==='msg1')[2],'done');
  assert.equal(q.filter(x=>x[2]==='failed').length,0);
});
test('Gmail plus and dot aliases identify the same owner',()=>{assert.equal(ctx.ownAddressKey_('Owner <test.owner+rent@googlemail.com>'),'testowner@gmail.com');});
test('cleanup counts rows, backs up and does not inspect arbitrary note text',()=>{const r=runtime();setup(r);const s=r.book.getSheetByName('Wohnungen');const a=Array(20).fill(''),b=Array(20).fill('');a[0]='Neue Suche gespeichert';a[17]=a[0];b[0]='Real Wohnung';b[17]='Ihre Anfrage';b[11]='Newsletter abbestellen';s.data.push(a,b);const result=r.ctx.cleanupNoiseRows_();assert.equal(result.removed,1);assert.equal(rows(r).length,1);assert.equal(r.book.getSheetByName(result.backup).data.length,3);});

if (process.env.WH_PRIVATE_FIXTURES) {
  const fixtures=JSON.parse(fs.readFileSync(process.env.WH_PRIVATE_FIXTURES,'utf8'));
  const expected=['applied','applied','rejected','documents','applied','applied'];
  test('six private observed portal templates classified locally (no fixture content committed)',()=>{fixtures.forEach((m,i)=>{const p=ctx.parseRentalMessage_(m);assert.equal(p.relevant,true,'fixture '+i+' relevant');assert.equal(p.status,expected[i],'fixture '+i+' status');});});
}
console.log('\n'+passed+' tests passed. Full-file syntax compiled before every runtime test.');
