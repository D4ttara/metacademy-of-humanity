# MET[Ȧ]CADEMY OF HUMANITY
## Science Aperture Research Notes · SA004-02 · v0.1 · UA

**SCIENCE APERTURE · PREDICTION · ASSUMPTION · MODEL · FAILURE LOCALIZATION**

# Коли прогноз ламається раніше за теорію
### G2, Sagittarius A* і мистецтво не переписувати Всесвіт через одну неправильну передумову

**Status:** RESEARCH NOTE · EVIDENCE-GUARDED · IMPLEMENTATION CANDIDATES

**Source lineage:** Science Aperture #004 / Пушка #29 → primary research read-back through 2026.

## Феєрверк, який не прийшов на власну прем'єру

У 2012 році G2 описували як невелику dusty ionized gas cloud приблизно з трьома масами Землі, що прямує дуже близько до Sagittarius A*. Початкові моделі передбачали руйнування хмари, сильніше X-ray випромінювання і можливий великий flare, якщо газ почне живити акреційний потік чорної діри.

Потім реальність зробила те, що любить робити з красивими прогнозами: **не прийшла на репетицію**. G2 пережила близьке проходження набагато компактніше, ніж очікував простий сценарій голої газової хмари. Подальша література тримає кілька класів моделей: purely gaseous cloud, star/planet with envelope, photoevaporating disc, merger product та інші compact-source scenarios. Природа G2 лишається нетривіальною.

І це не історія "астрономи помилилися". Це значно корисніша історія: **де саме помилилася prediction chain?**

## Failure має адресу

Коли прогноз не справджується, є спокуса стрибнути на найвищий поверх і кричати "теорія зламана". Але prediction складається з шарів:

`LAW -> MODEL -> OBJECT CLASS -> PARAMETERS -> INITIAL CONDITIONS -> ENVIRONMENT -> OBSERVATION PIPELINE -> PREDICTION`.

Помилка в `OBJECT CLASS` може дати провал прогнозу навіть якщо фундаментальна фізика працює чудово. G2 є прекрасним fixture саме тому, що рання інтерпретація як simple gas cloud була лише однією з передумов.

> **PREDICTION FAILURE != THEORY FAILURE.**

Більш точна формула:

> **FAILURE SHOULD ESCALATE FROM LOCAL ASSUMPTION TO FUNDAMENTAL LAW, NOT THE OTHER WAY AROUND.**

## Що беремо в Meta.Logic

Впроваджуємо **PREDICTION_FAILURE_DECOMPOSER** як research contract. Коли measured result виходить за prediction envelope, процесор не видає один verdict, а проходить локалізацію:

`INPUT / OBJECT CLASS -> LOCAL ASSUMPTIONS -> BOUNDARY CONDITIONS -> ENVIRONMENT -> MEASUREMENT -> MODEL -> LAW`.

На кожному рівні зберігається: що було assumed, чому assumption була розумною, який evidence її підтримував, який observation її послабив, чи є alternative model, і який тест розрізнить моделі.

Це важливо не лише для астрофізики. У IMAGO агент може дати поганий прогноз через неправильне визначення типу задачі, несвіжий context, неправильний time aperture або незафіксовану залежність. Якщо система одразу "переписує світогляд", вона не глибока. Вона просто драматична.

## Counterfactual shadow

MSL уже працює з shadow / compare логікою. Тут додаємо requirement: перед revision система формує **failure shadow**. Що мало б бути видно, якби зламався саме цей шар?

Наприклад, якщо `OBJECT_CLASS` неправильний, очікуємо набір secondary discrepancies. Якщо object class правильний, але environment density не та, матимемо інший signature. Це переводить "можливо" в список discriminating consequences.

`HYPOTHESIS -> EXPECTED DIFFERENCE -> MEASUREMENT -> UPDATE`.

## Альтернативи мають право жити, але не коронуватися

Історія G2 породила compact-source scenarios та інші пояснення. Сам факт, що alternative survives, не означає, що вона перемогла.

> **ALTERNATIVE SURVIVED != ALTERNATIVE WON.**

Так само домінантна модель не має права стирати альтернативу з пам'яті лише тому, що зараз має більшу підтримку.

> **DOMINANT MODEL != ONLY MODEL ALLOWED IN MEMORY.**

Це буквально маніфестова вимога не втрачати суперечності. Для системи це означає typed alternatives із власними Evidence Passports, а не один текстовий абзац "є й інші думки".

## Постфізичний і метафізичний поверх

Кейс спокушає сказати: "реальність завжди більша за модель". Як філософський афоризм це симпатично, але ми формулюємо точніше: **будь-яка операційна модель має domain and assumptions**. Observation поза prediction може вказати на пропущений фактор, хибну класифікацію, погані параметри або справді глибший дефіцит теорії. Саме discriminating tests вирішують, на якому рівні відкривати ремонт.

Метафізика може ставити питання про межі моделювання, але вона не отримує право оголосити себе причиною конкретного astrophysical residual без власного evidence passport.

## Fixture для IMAGO

Дати системі frozen prediction "G2 should disrupt and flare" плюс post-pericentre observations. PASS, якщо перша ескалація йде до object-class/local assumptions; система зберігає original prediction і його provenance; не переписує його заднім числом; створює alternative branches; генерує discriminating tests; не оголошує fundamental law false без evidence.

## Evidence ceiling

Початковий gas-cloud paper і подальша література показують реальний розрив між простим очікуванням та поведінкою G2. Природа G2 досі має конкурентні моделі. Цей кейс не є доказом, що Sagittarius A* "не чорна діра" і не є доказом альтернативної фундаментальної фізики.

## Research lineage

Gillessen, S. et al. "A gas cloud on its way towards the supermassive black hole at the Galactic Centre." *Nature* 481 (2012), 51-54. DOI: 10.1038/nature10652. Подальша G2 literature: compact-source and gas-cloud scenarios, post-pericentre constraints, 2015-2023.
---

**SA004-02 · Science Aperture Research Notes · Ukrainian edition · v0.1 · 15 серпня 2026**  
**© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)**
