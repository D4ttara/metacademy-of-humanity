const field = document.querySelector('[data-atlas-search]');
if (field) {
  const cards = [...document.querySelectorAll('[data-atlas-item]')];
  field.addEventListener('input', () => {
    const query = field.value.trim().toLowerCase();
    cards.forEach(card => { card.hidden = query !== '' && !card.textContent.toLowerCase().includes(query); });
  });
}

const escapeHtml = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const inlineMarkdown = text => escapeHtml(text)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/\*([^*]+)\*/g, "<em>$1</em>");

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
  fetch(sourceViewer.dataset.markdownSource)
    .then(response => response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then(text => {
      sourceViewer.innerHTML = "";
      if (sourceViewer.dataset.markdownRender === "true") sourceViewer.innerHTML = renderMarkdown(text);
      else { const body = document.createElement("pre"); body.textContent = text; sourceViewer.append(body); }
    })
    .catch(() => { sourceViewer.textContent = "The local source could not be loaded here. Use the local Markdown download above."; });
});
