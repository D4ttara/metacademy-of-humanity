import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const docs = {
  '010': {
    slug: 'manifestation-time-genesis-time',
    stem: 'METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME',
    titleEn: 'MANIFESTATION TIME ≠ GENESIS TIME',
    titleUa: 'ЧАС ПРОЯВУ ≠ ЧАС ЗАРОДЖЕННЯ',
    min: 3, max: 8
  },
  '011': {
    slug: 'the-third-body',
    stem: 'METACADEMY_DOCUMENT_011_THIRD_BODY',
    titleEn: 'THE THIRD BODY',
    titleUa: 'ТРЕТЄ ТІЛО',
    min: 4, max: 9
  },
  '012': {
    slug: 'myoga-astrology-overview',
    stem: 'METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW',
    titleEn: "M{Y}OGA: WHAT HAPPENS IF WE DON'T LAUGH AT ASTROLOGY FOR THE FIRST FIVE MINUTES",
    titleUa: 'M{Y}OGA: ЩО БУДЕ, ЯКЩО НЕ СМІЯТИСЯ З АСТРОЛОГІЇ ПЕРШІ П’ЯТЬ ХВИЛИН',
    min: 3, max: 8
  }
};

const receiptPath = 'publications/PUBLICATION_BUILD_RECEIPT_010_012_v1.0.json';
if (!existsSync(receiptPath)) throw new Error(`Missing ${receiptPath}`);
const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
const registry = readFileSync('publications/PUBLICATION_REGISTRY.yml', 'utf8');
const indexEn = readFileSync('documents/index.html', 'utf8');
const indexUa = readFileSync('uk/documents/index.html', 'utf8');

const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const output = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' });

for (const [doc, cfg] of Object.entries(docs)) {
  if (!registry.includes(`number: "${doc}"`) || !registry.includes(`canonical_slug: ${cfg.slug}`)) throw new Error(`Registry missing ${doc}`);
  if (!indexEn.includes(`${doc}-${cfg.slug}/en/`) || !indexUa.includes(`${doc}-${cfg.slug}/ua/`)) throw new Error(`Document index missing ${doc}`);

  for (const lang of ['en', 'ua']) {
    const suffix = lang === 'en' ? 'EN' : 'UA';
    const dir = `documents/${doc}-${cfg.slug}`;
    const md = `${dir}/${cfg.stem}_${suffix}_v1.0.md`;
    const pdf = `${dir}/${cfg.stem}_${suffix}_v1.0.pdf`;
    const html = `${dir}/${lang}/index.html`;
    for (const p of [md, pdf, html]) if (!existsSync(p)) throw new Error(`Missing ${p}`);

    const htmlText = readFileSync(html, 'utf8');
    for (const token of ['data-markdown-render="true"', 'data-static-render="true"', 'application/pdf', 'text/markdown', '2026-08-19']) {
      if (!htmlText.includes(token)) throw new Error(`${doc} ${lang} HTML missing ${token}`);
    }
    if (/Loading canonical Markdown|Завантаження canonical Markdown/.test(htmlText)) throw new Error(`${doc} ${lang} HTML placeholder survived`);
    if (/ПІДТРИМАТИ ПОЛЕ|SUPPORT THE FIELD/.test(htmlText)) throw new Error(`${doc} ${lang} file-only support leaked into HTML`);

    const mdText = readFileSync(md, 'utf8');
    if (!mdText.includes('date: 2026-08-19') || !mdText.includes('© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)')) throw new Error(`${doc} ${lang} metadata/copyright incomplete`);
    if (!mdText.includes('https://d4ttara.github.io/metacademy-of-humanity/')) throw new Error(`${doc} ${lang} Academy URL missing`);

    const info = output('pdfinfo', [pdf]);
    const pages = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
    if (!(pages >= cfg.min && pages <= cfg.max)) throw new Error(`${doc} ${lang} pages=${pages}, expected ${cfg.min}-${cfg.max}`);
    if (!/Page size:\s+595\.\d+ x 841\.\d+ pts \(A4\)/.test(info)) throw new Error(`${doc} ${lang} not A4`);

    const fonts = output('pdffonts', [pdf]);
    if (!fonts.includes('IBMPlexSans') || !fonts.includes('IBMPlexMono')) throw new Error(`${doc} ${lang} IBM Plex embedding incomplete`);

    const allText = output('pdftotext', [pdf, '-']);
    const expectedTitle = lang === 'en' ? cfg.titleEn : cfg.titleUa;
    if (!allText.toUpperCase().includes(expectedTitle.toUpperCase())) throw new Error(`${doc} ${lang} title missing from PDF text`);
    if (!allText.includes('© 2026 Ievgen Karogod / Dattara')) throw new Error(`${doc} ${lang} copyright missing from PDF`);

    const lastText = output('pdftotext', ['-f', String(pages), '-l', String(pages), pdf, '-']);
    if (!/SUPPORT THE FIELD|ПІДТРИМАТИ ПОЛЕ/.test(lastText)) throw new Error(`${doc} ${lang} final page is not support page`);
    for (const token of ['Monobank', 'PayPal', 'USDT']) if (!lastText.includes(token)) throw new Error(`${doc} ${lang} support page missing ${token}`);

    const r = receipt.documents?.[doc]?.[lang];
    if (!r || !r.separate_support_page || r.page_count !== pages) throw new Error(`${doc} ${lang} receipt mismatch`);
    if (r.markdown_sha256 !== sha(md) || r.pdf_sha256 !== sha(pdf)) throw new Error(`${doc} ${lang} receipt SHA mismatch`);
  }
}

console.log('DOCUMENTS_010_012_VERIFY=PASS editions=6 html=STATIC pdf=A4+IBM_PLEX support=FINAL_PAGE registry=PASS receipt=PASS copyright=PASS date=2026-08-19');
