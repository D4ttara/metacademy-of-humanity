import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const parse = path => readFileSync(path, 'utf8').trim().split(/\r?\n/).map(line => JSON.parse(line));
const graph = parse(new URL('./moh_metagraph_v02.jsonl', import.meta.url));
const knowledge = parse(new URL('./knowledge_graph_v01.jsonl', import.meta.url));
const project = parse(new URL('./project_evolution_graph_v01.jsonl', import.meta.url));

assert.equal(graph.filter(x => x.id === 'moh:metagraph').length, 1, 'exactly one canonical metagraph root');
assert.equal(knowledge[0].root_ref, 'moh:metagraph', 'knowledge is a view');
assert.equal(project[0].root_ref, 'moh:metagraph', 'project is a view');
assert.ok(graph.some(x => x.id === 'moh:reality:metaphysical'), 'metaphysical reality class is represented');
assert.ok(graph.some(x => x.id === 'moh:evidence:metaphysical'), 'metaphysical evidence passport is represented');
assert.ok(graph.some(x => x.id === 'moh:field:lost-possibility'), 'lost possibility field is represented');
assert.ok(graph.some(x => x.id === 'moh:access:public'), 'access remains an overlay');
assert.ok(graph.some(x => x.from === 'moh:metaphysical:residue' && x.relation === 'HAS_EVIDENCE_PASSPORT'), 'metaphysical hypothesis keeps separate provenance');
console.log('MOH_METAGRAPH_TEST=PASS root=1 views=7 access_ne_evidence=true metaphysics_passport=true');
