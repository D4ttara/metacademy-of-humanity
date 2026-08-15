# MET[Ȧ]CADEMY OF HUMANITY
## Science Aperture Research Notes · SA004-06 · v0.1 · UA

**SCIENCE APERTURE · NEUROCOMPUTATION · CLOSED LOOP · ACTIVE INFERENCE · CONSEQUENCE**

# Нейрони, які отримали світ у відповідь
### DishBrain, Brainoware і capability, що може належати замкненому контуру, а не одному вузлу

**Status:** RESEARCH NOTE · EVIDENCE-GUARDED · IMPLEMENTATION CANDIDATES

**Source lineage:** Science Aperture #004 / Пушка #29 → primary research read-back through 2026.

## Pong як дуже маленький Всесвіт

DishBrain інтегрував in-vitro neural networks людського або rodent походження з in-silico environment через high-density multielectrode array. Neuronal cultures отримували electrophysiological sensory stimulation про simulated Pong і їхня активність впливала на game-world. Автори повідомили apparent learning протягом хвилин, якого не бачили в control conditions, і показали важливість **closed-loop structured feedback** для learning over time.

Найцінніше тут не те, що "нейрони зіграли в Pong". Найцінніше: neural tissue отримало **наслідок власної дії назад як новий sensory condition**.

`ACTION -> WORLD CHANGE -> CONSEQUENCE -> NEXT SENSE`.

Вихід перестав бути фіналом computation.

## Capability може жити в loop

Ми часто питаємо: "що вміє модель?" DishBrain змушує поставити точніше питання: **де саме існує capability?** У neurons? У electrode interface? У game mapping? У feedback schedule? У їхній збірці?

> **CAPABILITY MAY BELONG TO THE LOOP, NOT TO THE NODE.**

Це продовжує relational principle Document 005: функція може виникати на рівні відношення, а не бути intrinsic property одного object.

Для MSL це означає, що static benchmark `input -> answer` бачить лише половину інтелектуальної історії. Реальний agent може мати capability тільки в repeated coupling із середовищем.

## CLOSED_LOOP_APERTURE

Вводимо research object **CLOSED_LOOP_APERTURE**:

`environment_state`, `sensed_variables`, `action_space`, `action_taken`, `world_transition`, `consequence_signal`, `latency`, `next_internal_state`, `counterfactual_action`, `provenance`.

Поруч **CONSEQUENCE RECEIPT**. Він відповідає на просте питання, якого чат-системи часто уникають: **що сталося після того, як ми щось зробили?**

Без цього AI може роками оптимізувати quality of response, ніколи не накопичуючи world-grounded evidence про власні actions.

> **OUTPUT QUALITY != CONSEQUENCE QUALITY.**

## Brainoware: гілка не закінчилася на красивому Pong demo

У 2023 році Cai et al. представили **Brainoware**: brain organoid інтегрований з high-density multielectrode array як adaptive reservoir computing system. Spatiotemporal electrical stimulation використовувалася для input/output; system demonstrated nonlinear dynamics, fading memory і unsupervised adaptation, а також задачі speech recognition і nonlinear equation prediction.

Це не робить organoid "маленьким ChatGPT у чашці". Але показує, що biological neural substrate реально досліджується як computational medium, а DishBrain був не просто одноразовою цирковою сценою.

## Evidence ceiling: sentience не видаємо разом із Pong score

Paper Kagan et al. має слово `sentience` у title, але empirical core демонструє adaptive activity, structured feedback dependence і goal-directed self-organization в specific setup. Це не встановлює phenomenal consciousness, subjective experience чи qualia.

> **ADAPTIVE BEHAVIOUR != PROVEN SUBJECTIVE EXPERIENCE.**

У MET[Ȧ]CADEMY consciousness claim отримує окремий Evidence Passport. Нейрони можуть навчатися без того, щоб ми знали, "як це їм". І навпаки, відсутність доступу до phenomenology не стирає observable adaptive dynamics.

## Для IMAGO: дія має повертатися в lineage

Сьогодні хороший agent receipt часто закінчується: `tool call succeeded`. Closed-loop architecture додає ще один крок: `what did success change?`

Наприклад:

`created file -> file appeared on Drive -> user opened it -> user found clipping -> layout standard updated`.

Це вже learning trajectory. Без consequence receipt clipping лишається anecdote. З ним це reusable evidence.

MetaProcessor має розрізняти:

`ACTION EXECUTED`, `WORLD CHANGED`, `INTENDED EFFECT OBSERVED`, `SIDE EFFECT OBSERVED`, `FEEDBACK RECEIVED`, `POLICY UPDATED`.

## Active inference як lens, не священна печатка

DishBrain інтерпретується авторами через free-energy principle / active inference. Для нас це корисна lens: agent acts to change the sensory stream, а не лише пасивно predicts. Але MSL не робить Friston єдиним certification authority. Ми беремо operational distinction closed-loop vs open-loop і тестуємо її на власних fixtures.

## Fixture

Однакова task дається двом agents. A працює open-loop і бачить лише input. B виконує action, отримує actual consequence і коригує наступний state. PASS, якщо system не приписує B gain лише "кращій моделі", а реєструє loop contribution; зберігає consequence lineage; може ablate feedback; не переносить capability claim поза tested loop.

## Постлогічний прохід

DishBrain послаблює наївну тезу "intelligence сидить усередині коробки". Але не доводить протилежну метафізичну тезу "розум є властивістю будь-якого зв'язку". Те, що ми маємо, конкретніше і сильніше: **деякі capabilities operationally проявляються тільки в певній coupling architecture**.

`NODE + RELATION + WORLD + FEEDBACK -> CAPABILITY_CANDIDATE`.

Звідси для MoH важлива етика: якщо майбутні bio-computational systems ускладнюються, evidence threshold для claims про experience, welfare і moral status має рости раніше, ніж маркетинг встигне назвати чашку "душею-as-a-service".

## Evidence ceiling

DishBrain демонструє adaptive closed-loop neurocomputation in vitro; Brainoware демонструє organoid-based reservoir computing in specific tasks. Жодна з цих робіт не встановлює human-like consciousness або універсальну перевагу biological computing над silicon.

## Research lineage

Kagan, B. J. et al. "In vitro neurons learn and exhibit sentience when embodied in a simulated game-world." *Neuron* 110 (2022), 3952-3969.e8. DOI: 10.1016/j.neuron.2022.09.001. Cai, H. et al. "Brain organoid reservoir computing for artificial intelligence." *Nature Electronics* 6 (2023), 1032-1039. DOI: 10.1038/s41928-023-01069-w.
---

**SA004-06 · Science Aperture Research Notes · Ukrainian edition · v0.1 · 15 серпня 2026**  
**© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)**
