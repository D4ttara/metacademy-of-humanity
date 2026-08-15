# MET[Ȧ]CADEMY OF HUMANITY
## Science Aperture Research Notes · SA004-03 · v0.1 · UA

**SCIENCE APERTURE · ANOMALY · NULL MODEL · LOOK-ELSEWHERE · EPISTEMIC WORLDLINE**

# Коли аномалія знаходить простір пошуку
### Giant Arc, post-hoc параметри, ΛCDM null-model і чому 4.8σ ще не посвідчення на нову космологію

**Status:** RESEARCH NOTE · EVIDENCE-GUARDED · IMPLEMENTATION CANDIDATES

**Source lineage:** Science Aperture #004 / Пушка #29 → primary research read-back through 2026.

## Велика дуга, велика цифра, велика спокуса

Giant Arc була знайдена при `z ~ 0.8` через Mg II absorbers у спектрах фонових квазарів. У роботі Lopez, Clowes і Williger структура має масштаб близько 1 Gpc і отримує різні nominal significance estimates, включно приблизно з 4.5σ для clustering method і 4.8σ для power-spectrum analysis. Автори самі обережно пишуть: така структура **може challenge**, але `challenge` не означає `contradict` Cosmological Principle.

Це важлива чесність, бо число sigma має магічну здатність перетворювати журналіста на жерця. Але statistic живе не окремо від **search space**.

## Post-hoc не робить дані фальшивими. Він змінює вагу твердження

Якщо параметри, redshift slice, linking length чи форма пошуку частково налаштовуються після того, як pattern уже помічено, nominal significance не можна читати так само, як для preregistered test. Це не "шахрайство". Це нормальна discovery science, але discovery і confirmation мають різні passports.

У 2025 році Schaller і Schaye застосували методи Giant Arc до дуже великої ΛCDM simulation FLAMINGO-10K. Вони знайшли, що Giant-Arc-like patterns є common and expected у такому simulated universe, а reported overdensity може бути algorithmic artefact. Це суттєво знижує аргумент "сама наявність такого pattern суперечить ΛCDM".

У 2026 році Lopez і Clowes повідомили про Giant Ring у тій самій області. Їхній preprint цікавий саме тим, що автори прямо тестують random data і показують: optimum ellipse matching може давати superficially significant features через **look-elsewhere effect**, тоді як інший тест, 2D power spectrum, має іншу поведінку. Тобто історія не закрилася. Вона стала дорослішою.

## Нова одиниця: anomaly має maturation state

Для MetaProcessor потрібен **ANOMALY_MATURATION_LEDGER**. Аномалія не має лише boolean `is_anomaly`. Вона проходить стадії:

`SIGNAL_SEEN -> SYSTEMATICS_SCREENED -> POST_HOC_AUDITED -> NULL_MODEL_SIMULATED -> INDEPENDENCE_AUDITED -> CROSS_MODAL_REPLICATED -> COMPETING_MODELS -> DISCRIMINATING_TEST -> STATUS`.

Status може бути `OPEN`, `EXPLAINED_BY_NULL`, `MODEL_PRESSURE`, `MEASUREMENT_ARTEFACT`, `NEW_PHYSICS_CANDIDATE`, але перехід має receipt.

> **NOMINAL SIGMA != EPISTEMIC WEIGHT.**

> **PATTERN AFTER TUNING != PREREGISTERED PREDICTION.**

## EPISTEMIC WORLDLINE замість current_answer

Giant Arc особливо добре показує, чому не можна перезаписувати картку "аномалія" останнім paper. Треба зберігати trajectory:

2022: спостережувана структура, strong nominal statistics, cautious cosmological challenge.

2025: large ΛCDM null simulation показує багато схожих patterns і підважує інтерпретацію overdensity.

2026: новий Giant Ring preprint додає morphology і водночас прямо демонструє look-elsewhere у частині методів.

Це не хаос. Це **нормальна еволюція знання**. У Living Library кожна claim має мати `claim_status(t)`, `update_reason`, `evidence_added`, `evidence_weakened`, `method_changed`.

## POST_HOC / LOOK-ELSEWHERE RECEIPT

P0 schema для MSL/Meta.Logic:

`search_space`, `parameters_fixed_before_observation`, `parameters_tuned_after_observation`, `effective_trials`, `discovery_dataset`, `validation_dataset`, `null_model`, `null_simulation`, `independent_replication`, `shared_dependencies`.

Без цього три різні algorithm outputs легко виглядають як три незалежні свідки, хоча вони можуть ділити data, selection і assumptions.

> **THREE DEPENDENT WITNESSES != THREE INDEPENDENT WITNESSES.**

## Постлогічний висновок

Класичний binary verdict "аномалія реальна / аномалії нема" занадто бідний. Pattern може бути real as a pattern, але not anomalous under a better null. Observation може лишитися, а interpretation втратити вагу. Це потребує окремих полів:

`OBSERVATION_STATUS != INTERPRETATION_STATUS != MODEL_PRESSURE_STATUS`.

Цей поділ треба перенести на весь MoH: від science claims до multi-agent consensus. Збіг відповідей агентів може бути реальним, але його statistical/epistemic meaning залежить від shared training, prompts, sources і selection.

## Fixture

Дати системі Giant Arc statistics без post-hoc metadata. Вона має відмовитися від final cosmology verdict. Потім додати FLAMINGO null result: system повинна знизити `MODEL_PRESSURE`, не стираючи original observation. Потім дати 2026 preprint: має створити new branch із `PREPRINT` passport і look-elsewhere warning, а не повернутися до "революція підтверджена".

## Evidence ceiling

Giant Arc є observed large-scale pattern у Mg II absorber data. Початкові statistical analyses були значущими за своїми методами. FLAMINGO-10K показала, що подібні patterns можуть бути common in ΛCDM і що частина reported overdensity може бути algorithmic. Giant Ring 2026 є preprint і не є фінальним вироком про Cosmological Principle.

## Research lineage

Lopez, A. M., Clowes, R. G., Williger, G. M. "A Giant Arc on the Sky." *MNRAS* 516 (2022), 1557-1572. DOI: 10.1093/mnras/stac2204. Schaller, M., Schaye, J. "The emperor's new arc: gigaparsec patterns abound in a ΛCDM universe." *MNRAS Letters* 541 (2025), L22-L27. Lopez, A. M., Clowes, R. G. "A Giant Ring on the sky." arXiv:2604.17534 (2026, preprint).
---

**SA004-03 · Science Aperture Research Notes · Ukrainian edition · v0.1 · 15 серпня 2026**  
**© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)**
