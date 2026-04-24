/**
 * search.js - Live search with dropdown
 */

import { PRODUCTS, formatPrice } from './products.js';
import { debounce, sanitize } from './ui.js';

export function initSearch() {
  const input    = document.querySelector('.navbar__search-input');
  const dropdown = document.querySelector('.search-dropdown');
  if (!input || !dropdown) return;

  const doSearch = debounce(query => {
    if (!query || query.length < 2) {
      dropdown.classList.remove('active');
      return;
    }

    const q = query.toLowerCase();
    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 6);

    if (results.length === 0) {
      dropdown.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.875rem;">No results for "${sanitize(query)}"</div>`;
    } else {
      dropdown.innerHTML = results.map(p => `
        <a class="search-dropdown__item" href="product.html?id=${p.id}">
          <img class="search-dropdown__img" src="${p.image}" alt="${sanitize(p.name)}" loading="lazy" />
          <div>
            <div class="search-dropdown__name">${sanitize(p.name)}</div>
            <div class="search-dropdown__price">${formatPrice(p.price)}</div>
          </div>
        </a>
      `).join('');
    }

    dropdown.classList.add('active');
  }, 250);

  input.addEventListener('input', e => doSearch(e.target.value.trim()));

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
    }
    if (e.key === 'Escape') {
      dropdown.classList.remove('active');
      input.blur();
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar__search')) {
      dropdown.classList.remove('active');
    }
  });
}
