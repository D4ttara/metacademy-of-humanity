const field = document.querySelector('[data-atlas-search]');
if (field) {
  const cards = [...document.querySelectorAll('[data-atlas-item]')];
  field.addEventListener('input', () => {
    const query = field.value.trim().toLowerCase();
    cards.forEach(card => { card.hidden = query !== '' && !card.textContent.toLowerCase().includes(query); });
  });
}
