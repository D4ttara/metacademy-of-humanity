# MET[Ȧ]CADEMY OF HUMANITY
## Academy Documents · Print / PDF Standard · v0.1 · UA

**Статус:** OWNER-DIRECTED WORKING STANDARD · 2026-08-14  
**Сфера:** лише нумеровані документи MET[Ȧ]CADEMY OF HUMANITY та їхні PDF/print-версії.  
**Не поширюється автоматично:** на книги MoH, МІЖ, Science Aperture Atlas, художні видання, IMAGO/MORPHO/MSL UI.

## 1. Принцип

Академічний документ має виглядати не як «офісний PDF із красивим логотипом», а як редакційно спроєктована публікація. Ієрархія має читатися до того, як читач починає розбирати речення. Повітря потрібне для ритму, а не для виробництва сторінок-привидів.

**READABLE != BORING.**  
**SPACIOUS != HALF-EMPTY.**  
**CONSISTENCY != CEREMONIAL WALLPAPER.**

Американський editorial/research дух тут означає: сильна ієрархія, стабільна сітка, стриманий колір, ясний інформаційний порядок, короткі службові рівні, достатній measure для читання, мінімум декоративного шуму. Це не означає копіювати US Letter або залишати пів аркуша порожнім заради «premium air».

## 2. Сторінка й поля

**Формат:** A4, 210 × 297 mm.

Робоча сітка v0.1: верхнє поле **76 pt ≈ 26.8 mm**; ліве поле **68 pt ≈ 24.0 mm**; праве та нижнє **54 pt ≈ 19.1 mm**; блакитна вертикальна смуга **5.2 pt ≈ 1.83 mm**, приблизно на 15% товща за попередні 4.5 pt. Metadata/номер документа мають мати видиме верхнє повітря.

## 3. Шрифти

Сімейство: **IBM Plex**. IBM Plex Sans використовується для wordmark, metadata, kicker, H1/H2/H3, операторів і службових підписів. IBM Plex Serif використовується для довгого наративного тексту та великих пояснювальних блоків. Production source мусить використовувати повні шрифти з підтримкою кирилиці, не випадкові PDF-subset fonts.

Робочі кеглі v0.1: body **9.95 pt** з leading близько **13.6 pt**; H1 **25 pt / 26.5 pt**; subtitle **11.9 pt**; H2 **14.1 pt**; H3 **10.55 pt**; footer/meta **6.7–6.8 pt**; короткі principle bodies у структурній двоколонці **8.85 pt**. Це implementation tokens, не вічні brand constants.

## 4. Набір і вирівнювання

Основний друкований текст у PDF набирається **по ширині**. Потрібні словникові переноси, останній рядок абзацу лишається ліворуч, заголовки та metadata не justify. Не допускаються ручні порізи слів і рядки з гігантськими пробілами. Widow/orphan guard: мінімум три рядки на стороні page break, де це дозволяє движок. Заголовок не лишається сам унизу сторінки.

## 5. Measure і ритм

Робочий measure довгого body приблизно **60–80 знаків на рядок**. Вузькі колонки лише для коротких однорідних структур. Paragraph rhythm робиться spacing, не пустими рядками.

## 6. Шапка

Ліворуч: `(MoH)` plaque і `MET[Ȧ]CADEMY OF HUMANITY`. Праворуч: номер/серія, class/version/language та sign strip по правому краю. Поточний publication sign: `· (A) · {Ȧ} · [Ả] · {Ã} · (Ā) ·`, де `[Ả]` має сильнішу вагу. Конфліктні Unicode-варіанти не нормалізуються без provenance.

## 7. Колір

Поточні робочі implementation tokens Document 005 v1.2: navy `#14324B`, light blue `#67AEEB`, secondary gray `#697681`, muted gray `#8D98A2`, pale blue panel `#EEF6FC`, rule `#D5DEE6`, paper `#FFFFFF`. Статус: **WORKING_IMPLEMENTATION_TOKEN**, не автоматично OWNER-APPROVED BRAND HEX.

## 8. Плашки й дві колонки

Плашка має мати функцію: research spine, evidence boundary, status, forecast або коротке ключове відношення. Не перетворювати кожен абзац на card. Дві колонки дозволені для коротких однорідних елементів. Для 10 принципів базове рішення 5 + 5; варіант 7 + 3 з білою ямою є layout failure.

## 9. Footer

На кожній сторінці: `© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)`. Праворуч `N / TOTAL`. Footer тихий, але читабельний.

## 10. Редакційний голос

Українська версія є адаптацією, не калькою. Academy voice: **ми**, якщо документ не є підписаною особистою колонкою. Гумор може відкривати складну думку, але не може змінювати evidence status.

## 11. QA перед публікацією

Документ не готовий після генерації PDF. Обов’язково: render усіх сторінок мінімум 180–200 dpi; візуальний огляд кожної сторінки; missing glyph scan; перевірка clipping, widows/orphans і overstretched justified lines; відмова від сторінок, що 50%+ порожні лише через невдалий break; PDF text extraction для критичних Unicode-рядків; фінальний read-back точного фінального файла.

**DECLARED SUCCESS != VERIFIED RESULT.**

## 12. Джерела й наступний крок

Standard спирається на Owner-правки до Document 005 від 2026-08-14, чинний `governance/PUBLICATION_CANON.md`, verified Academy Documents 003/004/005, U.S. Government Publishing Office Style Manual як модель стандартизації, U.S. Web Design System typography guidance як reference для measure/hierarchy/readability, та IBM Plex. IKAR Brandbook Harvest має звірити цей working standard із повною chat lineage. Owner-confirmed rules піднімаються до Brandbook; виміряні implementation values лишаються tokens до окремого схвалення.