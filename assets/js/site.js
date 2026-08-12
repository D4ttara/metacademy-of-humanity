const field = document.querySelector('[data-atlas-search]');
if (field) {
  const cards = [...document.querySelectorAll('[data-atlas-item]')];
  field.addEventListener('input', () => {
    const query = field.value.trim().toLowerCase();
    cards.forEach(card => { card.hidden = query !== '' && !card.textContent.toLowerCase().includes(query); });
  });
}

const sourceViewer = document.querySelector('[data-markdown-source]');
if (sourceViewer) {
  fetch(sourceViewer.dataset.markdownSource)
    .then(response => response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then(text => { sourceViewer.innerHTML = ""; const body = document.createElement("pre"); body.textContent = text; sourceViewer.append(body); })
    .catch(() => { sourceViewer.textContent = "The literary body could not be loaded here. Use the local Markdown download above."; });
}
