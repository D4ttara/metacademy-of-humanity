---
document: "017"
class: "Research Note"
status: published
version: v1.0
date: 2026-10-11
language: en
edition: EN
support_page: true
title: "S{Ȧ}R: DON'T TRANSLATE SANSKRIT TOO EARLY"
shorttitle: "S{Ȧ}R: don't translate Sanskrit too early"
subtitle: "Preserving word, root, ambiguity and time in a machine-readable Bhagavad Gītā"
copyright: "© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)"
---

# S{Ȧ}R: DON'T TRANSLATE SANSKRIT TOO EARLY

## Preserving word, root, ambiguity and time in a machine-readable Bhagavad Gītā

There is a very human way to handle a difficult text: see a word, immediately translate it into one convenient modern word, place that translation in a table, and announce that we now have data. This is how civilisation ends up with a spreadsheet in which `dharma = duty`, `ātman = soul`, `yoga = yoga`, after which everyone goes home satisfied except Sanskrit. Sanskrit, regrettably, has no appeals department.

S{Ȧ}R, Sanskrit Semantic Recognition, begins with the opposite suspicion: **translation may not be the first step. It may be one of the last.** Before choosing an English or Ukrainian phrase, a system should preserve surface form, sandhi, morphology, dhātu, derivation, compound structure, syntactic role, competing senses, context, attested semantic history, commentarial readings and, where the evidence genuinely supports it, historical etymology and Indo-European cognates. Not because translation is bad. Because translation is compression.

The project's base rule is therefore short: **DON'T COLLAPSE.** Do not reduce a concept to the first convenient gloss. Do not confuse traditional etymological interpretation with historical-comparative etymology. Do not present commentary as the literal text. Do not turn an intention into an accomplished event. Do not force two plausible parses to fight to the death simply because a database column wants one value.

## Why Chapter One

The first experimental field is Chapter 1 of the Bhagavad Gītā, and the first gold candidate is BG 1.1. This is deliberately modest. The opening chapter does not immediately throw the system into the full philosophical ocean of `brahman`, `ātman`, `prakṛti`, `puruṣa` and the centuries of schools accumulated around them. It gives us people, kinship, armies, places, intention, questions, fear and moral anticipation. There is enough complexity for the system to fail honestly, but not so much that we have to found a new religion to explain the stack trace.

The first verse already shows why this matters. `Yuyutsavaḥ` does not merely mean that people are fighting. Its morphology carries desiderative force: **desiring or intending to fight**. That is a different event structure. There is a possible future fight, there are agents disposed toward it, but the fight itself has not yet occurred. If an early translation collapses this into a generic `fight`, the machine loses a distinction that may later matter for modelling motivation, decision and Arjuna's transition from warrior readiness into moral conflict.

In the same verse Dhṛtarāṣṭra partitions the participants as `māmakāḥ` and `pāṇḍavāḥ`, roughly the linguistic perspective of “mine” versus “the Pāṇḍavas.” This does not prove a grand psychological theory about the king. It does create an observable asymmetry of grouping. S{Ȧ}R stores that asymmetry as a semantic observation instead of polishing it into a neutral roster. Tiny difference. Large interpretations have a habit of growing from tiny differences and later forgetting where they came from.

## Not one text, but a stack of layers

S{Ȧ}R is deliberately layered. At the bottom is the identity of a particular textual witness: edition, recension, numbering, variant. Above that come surface form, IAST and pāda boundaries; then phonology and sandhi; morphology; derivation, dhātu, prefixes and suffixes; samāsa; syntax and kāraka; lexical semantics; concept nodes; discourse and speech acts; narrative events; cognitive states; argument structure; commentarial layers; diachronic semantics; traditional nirvacana; historical etymology; a cognate graph; and only then translation projections.

The word `projection` matters. English `duty`, Ukrainian `обов'язок`, or another phrase is not `dharma` itself. It is a way of exposing part of a conceptual field for a particular context and reader. A different translation mode may choose another projection. In the machine model they can coexist, and the system should be able to explain **what each version preserved and what it compressed**.

This makes possible a slightly strange but useful feature: a translation can carry a loss report. If a modern phrase hides number, gender, desiderative force, compound ambiguity, register or a relational nuance, the system does not have to pretend nothing happened. It can say: here is the readable translation, and here is what was sacrificed for readability. JPEG has been more honest about compression than many translations for decades. We can catch up.

## Four levels of vāk, without the universal spiritual blender

A separate axis works with the traditional scheme `vaikharī`, `madhyamā`, `paśyantī`, `parā`. A safety rail is necessary here. These are not simply “four objective levels of Sanskrit” that can be attached to every token. The four-stage scheme is especially elaborated in later philosophical and Tantric traditions, while different Sanskrit theories of language do not formulate the word-meaning relation identically. S{Ȧ}R therefore stores this apparatus as an **attributed traditional model**: who uses it, in which school, in which period, and with what meaning.

It can still be computationally useful. `Vaikharī` can anchor the articulated or written expression. `Madhyamā` can be modelled as an internal linguistic organisation prior to external articulation. `Paśyantī` can serve as a traditional conceptual lens where differentiation is not yet fully lexicalised. `Parā` remains an extremely cautious meta-level, not a button marked COMPUTE TRANSCENDENCE. If Python eventually prints `PARA = 42`, our first hypothesis will be that it has read Douglas Adams.

A separate future track is reserved for Bhartṛhari and `sphoṭa`. That matters because theories of holistic utterance meaning should not simply be stuffed into a later four-vāk scheme. One future experiment is unusually concrete: compare incremental machine meaning assembly, token by token, against models where sentence-wholeness or meaning-wholeness has theoretical priority.

## Roots deeper than a dictionary

The second major direction is historical depth. For an important word the system can move from surface form to lemma and dhātu, then through Old Indo-Aryan evidence toward Proto-Indo-Iranian and, where the evidence is strong enough, a Proto-Indo-European etymon and cognates in Iranian, Greek, Latin, Germanic, Slavic, Baltic and other branches.

But another safety rail matters: **the age of a word is not the age of a concept**. A very old inherited root may acquire a specialised philosophical sense thousands of years later. S{Ȧ}R therefore does not allow a PIE reconstruction to order a Gītā verse around by shouting “this is what the word really means.” A cognate graph explains the history of forms and part of the history of meanings. The contextual meaning of a Gītā occurrence must still be argued from text, grammar, corpus evidence, conceptual history and interpretive traditions.

This also separates historical etymology from `nirvacana`. A traditional Indian derivational interpretation can be philosophically significant even when historical-comparative linguistics does not regard it as the genetic history of the word. Instead of making one system invalidate the other, S{Ȧ}R stores **two different relation types**. The disagreement becomes data.

## How a research programme actually starts

The beginning of research is less romantic than a manifesto, which is good. First define the object, boundaries, sources and failure rules. Then create a very small gold set where every step can still be inspected by hand. Run more than one independent tool. Do not count two websites as independent confirmation if both quietly reproduce the same digital edition. Record hypotheses, confidence, provenance, parser versions and the parts that remain unknown.

The initial S{Ȧ}R pass therefore relies on existing digital Sanskrit infrastructure rather than pretending one miracle website can do everything: GRETIL for e-texts, the University of Hyderabad Saṃsādhanī environment for structured Bhagavad Gītā analysis, Sanskrit Heritage for segmentation and morphology, the Digital Corpus of Sanskrit for attested corpus evidence, Cologne Digital Sanskrit Dictionaries and Sanskrit Library for lexicography and grammar, Sanskrit WordNet for lexical-semantic relations, and the UT Austin Indo-European Lexicon as one entry point into Indo-European reflex data. We are not reinventing a Sanskrit parser from zero. We are building a system designed to **not lose disagreement among already existing forms of knowledge**.

That is an important limit on the project's claims. The interesting part is not “we discovered that Sanskrit has roots.” If there is novelty here, it may lie in the integration architecture: a layered model in which form, history, translation, traditional interpretation, corpus evidence and machine hypothesis do not melt into one substance, but remain typed, traceable and recomputable.

## When the data becomes large

A first prototype can live happily in Python objects and JSON. That is also an excellent way to obtain, a month later, a file the size of a modest religious schism. Scalability therefore begins now. The immutable source layer preserves witnesses. The derived layer is append-only: every parser run adds records with versions and dependency hashes instead of rewriting history. The active graph lives in normalised node and edge tables with indexes, while large corpus tables can later move to Parquet and be scanned with DuckDB. There is no reason to load all Sanskrit into RAM in order to answer a question about one verse. The laptop has suffered enough.

Nor should every possible cross-layer relation be precomputed. Most parsing begins verse-local or passage-local. Expensive cross-corpus joins are lazy. Stable results are cached by dependency fingerprint. Long jobs checkpoint and resume. Ambiguity is bounded rather than erased: preserve the best-supported alternatives without allowing one compound to generate twenty million parallel universes before breakfast.

The first working BG 1.1 graph already exists: 16 nodes and 17 edges. A SQLite representation now sits beside the JSON pilot. These are not impressive numbers, and that is exactly why they are useful. At this scale we can still look every edge in the eye and ask who invited it.

## What could follow if the system survives its own architecture

The most obvious result is a generator of translation modes from one semantic source. Literal, root-preserving, academic, philosophical, poetic and plain-language versions no longer need to be unrelated manual universes. They can be controlled projections of one graph, each with an explicit compression cost.

A second result is semantic archaeology. We can trace how `dharma`, `yoga`, `buddhi`, `ātman`, `kṣetra` and other concepts behave across Vedic, Upaniṣadic, Epic and later material. Not “etymology reveals the true secret meaning,” but something more interesting: **here is the trajectory of the word, here is the trajectory of the concept, and they are not always the same trajectory**.

A third result is a map of disagreement. Śaṅkara, Rāmānuja, Madhva, Abhinavagupta and other commentarial traditions do not need to be averaged into the colourless sentence “Hinduism says.” A machine can show where a grammatical form or argument is read differently, what evidence supports each reading, and what changes downstream if one interpretation is selected instead of another.

A fourth direction is education. A reader who does not read Devanāgarī can receive IAST, a morphological path and a human explanation without first completing a degree in Sanskrit. This does not replace learning the language; it can provide a more honest bridge toward it, especially if the interface keeps saying: here we know, here we reconstruct, here the traditions disagree.

A fifth direction concerns AI itself. Ancient texts are excellent stress tests for machine reasoning because they contain ambiguity, long histories of concepts and competing interpretive systems. A model that always emits one confident translation may look intelligent while remaining epistemically crude. S{Ȧ}R lets us test another capability: **can a machine preserve several possible worlds until the evidence is sufficient to collapse them responsibly?**

And if the model proves transferable, similar architecture may be useful beyond Sanskrit, for historical corpora where translation, textual variants, commentary and etymology form a layered system. That is a future hypothesis, not a T-shirt slogan.

## What we are not claiming

S{Ȧ}R does not compute the final meaning of the Bhagavad Gītā. It does not prove metaphysics in Python. It does not replace Sanskritists. It does not declare a PIE root to be the secret code of the universe. It does not convert the four levels of vāk into universal neurophysiology. And a confidence value of 0.93 is not a spiritual rank.

The project is at the beginning. That is precisely why its boundaries should be public now. A good research programme should leave a trail not only of successes but of what it does not yet know. Every derived record should have provenance. Important hypotheses should retain alternatives. Every parser may be wrong. A human correction should not delete the machine's previous mistake; it should add an adjudication layer so we can later see exactly how the system learned not to make the same mistake twice.

## From one śloka to a field

The development path is deliberately slow: first BG 1.1 as a gold record, then 1.1-1.10 as a regression corpus, then Chapter 1, then the whole Gītā, and only then broader corpus federation. This is less theatrical than announcing tomorrow that “we digitised 700 verses and decoded ancient wisdom.” It also reduces the chance that the day after tomorrow we must explain why ancient wisdom is stored in a column named `meaning_final_v7_REAL_FINAL2`.

If S{Ȧ}R acquires scientific value, that value will not lie in one translation. It may lie in an **infrastructure for preserved ambiguity**. The text stops being raw material that must be converted into modern sentences as quickly as possible and becomes a model whose layers can be inspected, compared and reprojected. Translation is no longer the death of the source. It is one interface to the source.

And perhaps that is the most interesting consequence of the experiment. We began with what sounded almost like a joke: “what happens if we translate the Bhagavad Gītā into Python?” The better answer turned out to be stranger: **do not translate the Gītā into Python. Teach Python not to translate the Gītā too early.**

## Sources and research infrastructure

The launch phase compares GRETIL (https://gretil.sub.uni-goettingen.de/), the University of Hyderabad Saṃsādhanī Bhagavad Gītā e-reader (https://sanskrit.uohyd.ac.in/scl/e-readers/sbg/main.html), Sanskrit Heritage (https://sanskrit.uohyd.ac.in/SKT/), the Digital Corpus of Sanskrit (https://sanskrit-linguistics.org/dcs/), Cologne Digital Sanskrit Dictionaries (https://www.sanskrit-lexicon.uni-koeln.de/), Sanskrit Library (https://www.sanskritlibrary.org/), Sanskrit WordNet (https://sanskritwordnet.unipv.it/) and the UT Austin Indo-European Lexicon (https://lrc.la.utexas.edu/lex/languages/Skt). Each resource is used within its evidential role and rights boundary. A public research system should not bulk-republish a protected corpus merely because a browser was allowed to read it.

## Support the work

S{Ȧ}R is being developed as independent research inside MET[Ȧ]CADEMY OF HUMANITY. Support helps pay for infrastructure, keep results public, produce bilingual editions, check corpora and continue the work without a paywall. Monobank, PayPal and USDT/TRC20 are available on the support page: https://d4ttara.github.io/metacademy-of-humanity/support/ . Voluntary support does not purchase a preferred result or create governance rights. It simply buys the research more time not to do stupid things in a hurry.

## Reader question

If a machine translates Sanskrit, **what must it preserve before it chooses one modern phrase**? And where should it be allowed to answer: “one translation is not enough yet”? Public thread for Document 017: https://github.com/D4ttara/metacademy-of-humanity/issues/77

© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)