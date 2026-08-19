const field = document.querySelector('[data-atlas-search]');
if (field) {
  const cards = [...document.querySelectorAll('[data-atlas-item]')];
  field.addEventListener('input', () => {
    const query = field.value.trim().toLowerCase();
    cards.forEach(card => { card.hidden = query !== '' && !card.textContent.toLowerCase().includes(query); });
  });
}

const escapeHtml = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const escapeAttr = text => escapeHtml(text).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const safeHref = href => /^(?:https?:\/\/|mailto:|#|\/|\.\.?\/)/i.test(href) ? href : null;
const externalAttrs = href => /^https?:\/\//i.test(href) ? ' rel="external noopener noreferrer"' : '';

const inlineMarkdown = text => {
  const tokens = [];
  const stash = html => {
    const token = `\uE000MOH${tokens.length}\uE001`;
    tokens.push(html);
    return token;
  };

  let source = text
    .replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escapeHtml(code)}</code>`))
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label, href) => {
      const safe = safeHref(href);
      if (!safe) return whole;
      const body = escapeHtml(label)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return stash(`<a href="${escapeAttr(safe)}"${externalAttrs(safe)}>${body}</a>`);
    });

  source = escapeHtml(source)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/https?:\/\/[^\s<]+/g, raw => {
      let url = raw;
      let tail = '';
      while (/[.,;:!?)]$/.test(url)) { tail = url.slice(-1) + tail; url = url.slice(0, -1); }
      return `<a href="${escapeAttr(url)}" rel="external noopener noreferrer">${url}</a>${tail}`;
    });

  tokens.forEach((html, index) => { source = source.replace(`\uE000MOH${index}\uE001`, html); });
  return source;
};

const renderMarkdown = source => {
  let lines = source.replaceAll("\r\n", "\n").split("\n");
  if (lines[0] === "---") { const end = lines.indexOf("---", 1); if (end > 0) lines = lines.slice(end + 1); }
  const output = []; let paragraph = []; let list = [];
  const flushParagraph = () => { if (paragraph.length) { output.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`); paragraph = []; } };
  const flushList = () => { if (list.length) { output.push(`<ul>${list.map(item => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`); list = []; } };
  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); const level = heading[1].length; output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue; }
    if (line.startsWith("> ")) { flushParagraph(); flushList(); output.push(`<blockquote class="quote"><p>${inlineMarkdown(line.slice(2))}</p></blockquote>`); continue; }
    if (line.startsWith("- ")) { flushParagraph(); list.push(line.slice(2)); continue; }
    if (line.trim() === "---") { flushParagraph(); flushList(); output.push("<hr>"); continue; }
    if (line.trim() === "") { flushParagraph(); flushList(); continue; }
    paragraph.push(line.trim());
  }
  flushParagraph(); flushList(); return output.join("\n");
};

document.querySelectorAll('[data-markdown-source]').forEach(sourceViewer => {
  // Pages deployment pre-renders canonical Markdown with Pandoc. Never overwrite
  // that richer HTML (links, footnotes, semantics) with the lightweight fallback renderer.
  if (sourceViewer.dataset.staticRender === "true") return;
  fetch(sourceViewer.dataset.markdownSource)
    .then(response => response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then(text => {
      sourceViewer.innerHTML = "";
      if (sourceViewer.dataset.markdownRender === "true") sourceViewer.innerHTML = renderMarkdown(text);
      else { const body = document.createElement("pre"); body.textContent = text; sourceViewer.append(body); }
    })
    .catch(() => { sourceViewer.textContent = "The local source could not be loaded here. Use the local Markdown download above."; });
});

const canonicalShareUrl = () => document.querySelector('link[rel="canonical"]')?.href || location.href.split('#')[0];
const copyText = async text => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
  document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
};

const addShareControls = () => {
  const uk = document.documentElement.lang === 'uk';
  document.querySelectorAll('.edition-links').forEach(group => {
    if (group.querySelector('[data-copy-link]')) return;
    const copy = document.createElement('button');
    copy.type = 'button'; copy.className = 'button'; copy.dataset.copyLink = 'true'; copy.textContent = uk ? 'Копіювати посилання' : 'Copy link';
    copy.addEventListener('click', async () => {
      const original = copy.textContent;
      try { await copyText(canonicalShareUrl()); copy.textContent = uk ? 'Скопійовано ✓' : 'Copied ✓'; }
      catch { copy.textContent = uk ? 'Не вдалося скопіювати' : 'Copy failed'; }
      setTimeout(() => { copy.textContent = original; }, 1800);
    });
    group.append(copy);

    if (navigator.share) {
      const share = document.createElement('button');
      share.type = 'button'; share.className = 'button'; share.dataset.sharePage = 'true'; share.textContent = uk ? 'Поділитися' : 'Share';
      share.addEventListener('click', async () => {
        try { await navigator.share({ title: document.title, url: canonicalShareUrl() }); } catch (error) { if (error?.name !== 'AbortError') console.warn('Share failed', error); }
      });
      group.append(share);
    }

    const discuss = document.createElement('a');
    discuss.className = 'button';
    discuss.dataset.discussLink = 'true';
    discuss.href = 'https://github.com/D4ttara/metacademy-of-humanity/discussions';
    discuss.rel = 'external noopener noreferrer';
    discuss.textContent = uk ? 'Обговорити' : 'Discuss';
    group.append(discuss);
  });
};

addShareControls();
