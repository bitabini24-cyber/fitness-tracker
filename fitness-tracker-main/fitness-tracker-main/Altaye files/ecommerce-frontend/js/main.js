/**
 * main.js - Global initialization, shared across all pages
 */

import { initTheme, toggleTheme, initNavbar, initScrollTop,
         initRevealAnimations, initLazyImages, initModals,
         hidePageLoader, showToast, openModal, closeModal,
         sanitize, initQtyControls } from './ui.js';
import { initSearch } from './search.js';
import { updateCartBadge, updateWishlistBadge, addToCart,
         toggleWishlist, isWishlisted, getCart, getCartTotal,
         removeFromCart, updateCartQty, renderCartItems,
         applyCoupon, getWishlist, addRecentlyViewed, clearCart } from './cart.js';
import { PRODUCTS, CATEGORIES, buildProductCard, filterProducts,
         getProductById, getRelatedProducts, formatPrice,
         renderStars, discountPercent } from './products.js';
import { initCountdown, initCarousel, initTabs,
         initFilterToggle, initFilterSections, debounce } from './ui.js';
import { Storage } from './storage.js';

/* ============================================
   GLOBAL INIT (runs on every page)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initScrollTop();
  initModals();
  initSearch();
  updateCartBadge();
  updateWishlistBadge();
  hidePageLoader();

  // Theme toggle
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Delegated: Add to cart
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      e.preventDefault();
      addToCart(Number(addBtn.dataset.id));
      addBtn.classList.add('btn-loading');
      setTimeout(() => addBtn.classList.remove('btn-loading'), 800);
    }

    // Wishlist toggle
    const wishBtn = e.target.closest('.wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      const id = Number(wishBtn.dataset.id);
      const added = toggleWishlist(id);
      wishBtn.classList.toggle('active', added);
      wishBtn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
    }

    // Quick view
    const qvBtn = e.target.closest('.quickview-btn');
    if (qvBtn) {
      e.preventDefault();
      openQuickView(Number(qvBtn.dataset.id));
    }
  });

  // Page-specific init
  const page = document.body.dataset.page;
  switch (page) {
    case 'home':     initHomePage();     break;
    case 'shop':     initShopPage();     break;
    case 'product':  initProductPage();  break;
    case 'cart':     initCartPage();     break;
    case 'checkout': initCheckoutPage(); break;
    case 'account':  initAccountPage();  break;
  }

  // Reveal animations (after page-specific content rendered)
  setTimeout(initRevealAnimations, 100);
  initLazyImages();
});

/* ============================================
   QUICK VIEW MODAL
   ============================================ */
function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const wishlist = [];
  const discount = product.originalPrice ? discountPercent(product.price, product.originalPrice) : 0;

  const modal = document.getElementById('quickview-modal');
  if (!modal) return;

  modal.querySelector('.qv-info__category').textContent = product.category;
  modal.querySelector('.qv-info__title').textContent    = product.name;
  modal.querySelector('.qv-info__desc').textContent     = product.description;
  modal.querySelector('.qv-price-current').textContent  = formatPrice(product.price);
  modal.querySelector('.qv-price-original').textContent = product.originalPrice ? formatPrice(product.originalPrice) : '';
  modal.querySelector('.qv-discount').textContent       = discount > 0 ? `-${discount}%` : '';
  modal.querySelector('.qv-stars').innerHTML            = renderStars(product.rating);
  modal.querySelector('.qv-reviews').textContent        = `(${product.reviews.toLocaleString()} reviews)`;
  modal.querySelector('.qv-stock').textContent          = product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✕ Out of Stock';
  modal.querySelector('.qv-stock').style.color          = product.stock > 0 ? 'var(--success)' : 'var(--error)';

  // Gallery
  const mainImg = modal.querySelector('.qv-gallery__main img');
  if (mainImg) mainImg.src = product.image;

  // Colors
  const colorWrap = modal.querySelector('.qv-colors');
  if (colorWrap && product.colors) {
    colorWrap.innerHTML = product.colors.map((c, i) =>
      `<button class="color-btn ${i === 0 ? 'active' : ''}" style="background:${c}" data-color="${c}" aria-label="Color ${c}"></button>`
    ).join('');
    colorWrap.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        colorWrap.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // Add to cart from modal
  const addBtn = modal.querySelector('.qv-add-cart');
  if (addBtn) {
    addBtn.onclick = () => {
      const qty = parseInt(modal.querySelector('.qty-input')?.value || 1);
      const color = colorWrap?.querySelector('.color-btn.active')?.dataset.color || '';
      addToCart(productId, qty, { color });
    };
  }

  // Wishlist from modal
  const wishBtn = modal.querySelector('.qv-wishlist-btn');
  if (wishBtn) {
    const wished = isWishlisted(productId);
    wishBtn.classList.toggle('active', wished);
    wishBtn.onclick = () => {
      const added = toggleWishlist(productId);
      wishBtn.classList.toggle('active', added);
    };
  }

  openModal('quickview-modal');
}

/* ============================================
   HOME PAGE
   ============================================ */
function initHomePage() {
  // Hero carousel
  initCarousel('.hero-carousel');

  // Featured products
  const featuredGrid = document.getElementById('featured-products');
  if (featuredGrid) {
    const wishlist = [];
    const featured = PRODUCTS.slice(0, 8);
    featuredGrid.innerHTML = featured.map(p => buildProductCard(p, wishlist)).join('');
  }

  // Flash sale products
  const flashGrid = document.getElementById('flash-products');
  if (flashGrid) {
    const flashItems = PRODUCTS.filter(p => p.badge === 'sale' || p.badge === 'hot').slice(0, 4);
    flashGrid.innerHTML = flashItems.map(p => buildProductCard(p)).join('');
  }

  // Countdown timer (24h from now)
  const saleEnd = Date.now() + 24 * 3600 * 1000;
  initCountdown(saleEnd, {
    hours:   document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds')
  });

  // Categories
  const catGrid = document.getElementById('categories-grid');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map(cat => `
      <a href="shop.html?category=${cat.id}" class="category-card reveal" aria-label="Shop ${cat.name}">
        <img class="category-card__img" src="${cat.image}" alt="${cat.name}" loading="lazy" />
        <div class="category-card__overlay"></div>
        <div class="category-card__content">
          <div class="category-card__name">${cat.icon} ${cat.name}</div>
          <div class="category-card__count">${cat.count} Products</div>
        </div>
      </a>
    `).join('');
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (email) {
      showToast('success', 'Subscribed!', 'Welcome to our newsletter');
      newsletterForm.reset();
    }
  });
}

/* ============================================
   SHOP PAGE
   ============================================ */
function initShopPage() {
  const params   = new URLSearchParams(window.location.search);
  const grid     = document.getElementById('products-grid');
  const countEl  = document.getElementById('product-count');
  const sortSel  = document.getElementById('sort-select');
  const searchIn = document.getElementById('shop-search');

  let filters = {
    category: params.get('category') || 'all',
    search:   params.get('search') || '',
    minPrice: 0,
    maxPrice: 2500,
    minRating: 0,
    sort: 'popular'
  };

  // Pre-fill search
  if (searchIn && filters.search) searchIn.value = filters.search;

  // Set active category filter
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === filters.category);
    btn.addEventListener('click', () => {
      filters.category = btn.dataset.cat;
      document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });

  // Price range
  const priceRange = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  priceRange?.addEventListener('input', () => {
    filters.maxPrice = parseInt(priceRange.value);
    if (priceDisplay) priceDisplay.textContent = `$0 – $${filters.maxPrice}`;
    renderProducts();
  });

  // Rating filter
  document.querySelectorAll('.rating-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.minRating = parseFloat(btn.dataset.rating);
      document.querySelectorAll('.rating-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });

  // Sort
  sortSel?.addEventListener('change', () => {
    filters.sort = sortSel.value;
    renderProducts();
  });

  // Search
  searchIn?.addEventListener('input', debounce(() => {
    filters.search = searchIn.value.trim();
    renderProducts();
  }, 300));

  function renderProducts() {
    if (!grid) return;

    // Show skeletons
    grid.innerHTML = Array(8).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text-lg"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text-sm"></div>
      </div>
    `).join('');

    setTimeout(() => {
      const results = filterProducts(filters);
      if (countEl) countEl.textContent = `${results.length} Products`;

      if (results.length === 0) {
        grid.innerHTML = `
          <div class="col-span-3" style="text-align:center; padding: 60px 20px;">
            <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
            <h3 style="margin-bottom: 8px;">No products found</h3>
            <p style="color: var(--text-secondary);">Try adjusting your filters</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = results.map(p => buildProductCard(p)).join('');
      initRevealAnimations();
    }, 400);
  }

  renderProducts();
  initFilterToggle();
  initFilterSections();
}

/* ============================================
   PRODUCT DETAIL PAGE
   ============================================ */
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  const product = getProductById(id);

  if (!product) {
    document.getElementById('product-detail')?.insertAdjacentHTML('beforeend',
      '<p style="text-align:center;padding:60px">Product not found. <a href="shop.html" class="text-primary">Back to shop</a></p>'
    );
    return;
  }

  // Update page title
  document.title = `${product.name} – LuxeShop`;

  // Breadcrumb
  const bc = document.getElementById('product-breadcrumb');
  if (bc) bc.innerHTML = `
    <a href="index.html" class="breadcrumb__item">Home</a>
    <span class="breadcrumb__sep">›</span>
    <a href="shop.html" class="breadcrumb__item">Shop</a>
    <span class="breadcrumb__sep">›</span>
    <a href="shop.html?category=${product.category.toLowerCase()}" class="breadcrumb__item">${product.category}</a>
    <span class="breadcrumb__sep">›</span>
    <span class="breadcrumb__item active">${product.name}</span>
  `;

  // Fill product info
  const fill = (sel, val, prop = 'textContent') => {
    const el = document.querySelector(sel);
    if (el) el[prop] = val;
  };

  fill('#pd-category', product.category);
  fill('#pd-name', product.name);
  fill('#pd-price', formatPrice(product.price));
  fill('#pd-original', product.originalPrice ? formatPrice(product.originalPrice) : '');
  fill('#pd-discount', product.originalPrice ? `-${discountPercent(product.price, product.originalPrice)}%` : '');
  fill('#pd-desc', product.description);
  fill('#pd-stock', product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of Stock');
  fill('#pd-reviews-count', `(${product.reviews.toLocaleString()} reviews)`);

  const starsEl = document.getElementById('pd-stars');
  if (starsEl) starsEl.innerHTML = renderStars(product.rating);

  // Gallery
  const mainImg = document.getElementById('pd-main-img');
  if (mainImg) { mainImg.src = product.image; mainImg.alt = product.name; }

  // Colors
  const colorWrap = document.getElementById('pd-colors');
  if (colorWrap && product.colors) {
    colorWrap.innerHTML = product.colors.map((c, i) =>
      `<button class="color-btn ${i === 0 ? 'active' : ''}" style="background:${c}" data-color="${c}" aria-label="Color ${c}"></button>`
    ).join('');
    colorWrap.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        colorWrap.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // Add to cart
  document.getElementById('pd-add-cart')?.addEventListener('click', () => {
    const qty   = parseInt(document.getElementById('pd-qty')?.value || 1);
    const color = colorWrap?.querySelector('.color-btn.active')?.dataset.color || '';
    addToCart(product.id, qty, { color });
  });

  // Wishlist
  const wishBtn = document.getElementById('pd-wishlist');
  if (wishBtn) {
    wishBtn.classList.toggle('active', isWishlisted(product.id));
    wishBtn.addEventListener('click', () => {
      const added = toggleWishlist(product.id);
      wishBtn.classList.toggle('active', added);
    });
  }

  // Related products
  const relGrid = document.getElementById('related-products');
  if (relGrid) {
    const related = getRelatedProducts(product, 4);
    relGrid.innerHTML = related.map(p => buildProductCard(p)).join('');
  }

  // Recently viewed (already imported at top)
  addRecentlyViewed(product.id);

  initTabs();
}

/* ============================================
   CART PAGE
   ============================================ */
function initCartPage() {
  const cartContainer = document.getElementById('cart-items');
  const subtotalEl    = document.getElementById('cart-subtotal');
  const totalEl       = document.getElementById('cart-total');
  const shippingEl    = document.getElementById('cart-shipping');
  const couponInput   = document.getElementById('coupon-input');
  const couponBtn     = document.getElementById('coupon-btn');
  const couponMsg     = document.getElementById('coupon-msg');

  let couponDiscount = 0;

  function updateSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 9.99;
    const discount = subtotal * couponDiscount;
    const total    = subtotal - discount + shipping;

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    if (totalEl)    totalEl.textContent    = formatPrice(total);
  }

  function refresh() {
    renderCartItems(cartContainer);
    updateSummary();

    // Bind remove buttons
    cartContainer?.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.key);
        refresh();
      });
    });
  }

  initQtyControls(cartContainer, (key, qty) => {
    updateCartQty(key, qty);
    updateSummary();
  });

  couponBtn?.addEventListener('click', () => {
    const code = couponInput?.value.trim();
    if (!code) return;
    const result = applyCoupon(code);
    couponDiscount = result.discount;
    if (couponMsg) {
      couponMsg.textContent = result.message;
      couponMsg.style.color = result.valid ? 'var(--success)' : 'var(--error)';
    }
    updateSummary();
  });

  refresh();
  document.addEventListener('cart:updated', refresh);
}

/* ============================================
   CHECKOUT PAGE
   ============================================ */
function initCheckoutPage() {
  // ── Require login ──
  if (!getAuthUser()) {
    showToast('warning', 'Sign In Required', 'Please sign in to complete your purchase');
    setTimeout(() => { window.location.href = 'account.html'; }, 1200);
    return;
  }

  const steps    = document.querySelectorAll('.step');
  const panels   = document.querySelectorAll('.checkout-panel');
  const backBtns = document.querySelectorAll('.checkout-back');

  let currentStep = 0;
  let shippingCost = 0; // updated by shipping method selection
  const TAX_RATE = 0.08;

  // ── Step navigation ──
  function goToStep(idx) {
    currentStep = idx;
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
      s.classList.toggle('completed', i < idx);
    });
    panels.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backBtns.forEach(btn => btn.addEventListener('click', () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  }));

  // ── Sidebar summary ──
  function updateSidebar() {
    const subtotal = getCartTotal();
    const tax      = subtotal * TAX_RATE;
    const total    = subtotal + shippingCost + tax;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('sidebar-subtotal', formatPrice(subtotal));
    set('sidebar-shipping', shippingCost === 0 ? 'FREE' : formatPrice(shippingCost));
    set('sidebar-tax',      formatPrice(tax));
    set('checkout-total',   formatPrice(total));
  }

  // ── Render cart items in sidebar ──
  const summaryEl = document.getElementById('checkout-summary');
  if (summaryEl) {
    const cart = getCart();
    if (cart.length === 0) {
      summaryEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:16px 0;">Your cart is empty</p>';
    } else {
      summaryEl.innerHTML = cart.map(item => {
        const p = getProductById(item.productId);
        if (!p) return '';
        return `
          <div class="summary-item">
            <img class="summary-item__img" src="${p.image}" alt="${p.name}" loading="lazy" />
            <div style="flex:1;min-width:0;">
              <div class="summary-item__name">${sanitize(p.name)}</div>
              <div class="summary-item__qty">Qty: ${item.qty}</div>
            </div>
            <span class="summary-item__price">${formatPrice(p.price * item.qty)}</span>
          </div>
        `;
      }).join('');
    }
  }

  // ── Shipping method toggle ──
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('label.payment-option[id^="ship-"]').forEach(l => l.classList.remove('selected'));
      radio.closest('label')?.classList.add('selected');
      const costs = { standard: 0, express: 14.99, overnight: 29.99 };
      shippingCost = costs[radio.value] ?? 0;
      // Update standard label if subtotal < 100
      const stdPrice = document.getElementById('ship-standard-price');
      if (stdPrice) stdPrice.textContent = getCartTotal() >= 100 ? 'FREE' : '$9.99';
      updateSidebar();
    });
  });

  // Auto-set standard shipping cost based on subtotal
  const subtotal = getCartTotal();
  shippingCost = subtotal >= 100 ? 0 : 9.99;
  const stdPrice = document.getElementById('ship-standard-price');
  if (stdPrice) stdPrice.textContent = subtotal >= 100 ? 'FREE' : '$9.99';
  updateSidebar();

  // ── Payment method toggle ──
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('label.payment-option[id^="pay-"]').forEach(l => l.classList.remove('selected'));
      radio.closest('label')?.classList.add('selected');
      const cardFields = document.getElementById('card-fields');
      const altMsg     = document.getElementById('alt-payment-msg');
      if (radio.value === 'card') {
        cardFields?.classList.add('visible');
        if (altMsg) altMsg.style.display = 'none';
      } else {
        cardFields?.classList.remove('visible');
        if (altMsg) altMsg.style.display = 'block';
      }
    });
  });

  // ── Billing address toggle ──
  document.getElementById('same-as-shipping')?.addEventListener('change', e => {
    const billingFields = document.getElementById('billing-fields');
    if (billingFields) billingFields.style.display = e.target.checked ? 'none' : 'block';
  });

  // ── Card number formatting ──
  document.getElementById('card-number')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  // ── Expiry formatting ──
  document.getElementById('card-expiry')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    e.target.value = v;
  });

  // ── Form validation helpers ──
  function showError(inputId, errId) {
    document.getElementById(inputId)?.classList.add('error');
    document.getElementById(errId)?.classList.add('visible');
  }
  function clearError(inputId, errId) {
    document.getElementById(inputId)?.classList.remove('error');
    document.getElementById(errId)?.classList.remove('visible');
  }
  function validateShipping() {
    let valid = true;
    const fields = [
      ['first-name', 'err-first-name'],
      ['last-name',  'err-last-name'],
      ['address',    'err-address'],
      ['city',       'err-city'],
      ['state',      'err-state'],
      ['zip',        'err-zip'],
    ];
    fields.forEach(([id, err]) => {
      const el = document.getElementById(id);
      if (!el?.value.trim()) { showError(id, err); valid = false; }
      else clearError(id, err);
    });
    // Email
    const email = document.getElementById('email');
    if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError('email', 'err-email'); valid = false;
    } else clearError('email', 'err-email');
    return valid;
  }
  function validatePayment() {
    const method = document.querySelector('input[name="payment"]:checked')?.value;
    if (method !== 'card') return true;
    let valid = true;
    if (!document.getElementById('card-name')?.value.trim()) { showError('card-name', 'err-card-name'); valid = false; } else clearError('card-name', 'err-card-name');
    const num = document.getElementById('card-number')?.value.replace(/\s/g, '');
    if (!num || num.length < 15) { showError('card-number', 'err-card-number'); valid = false; } else clearError('card-number', 'err-card-number');
    if (!document.getElementById('card-expiry')?.value.trim()) { showError('card-expiry', 'err-card-expiry'); valid = false; } else clearError('card-expiry', 'err-card-expiry');
    const cvv = document.getElementById('card-cvv')?.value;
    if (!cvv || cvv.length < 3) { showError('card-cvv', 'err-card-cvv'); valid = false; } else clearError('card-cvv', 'err-card-cvv');
    return valid;
  }

  // ── Populate review step ──
  function populateReview() {
    const sub      = getCartTotal();
    const tax      = sub * TAX_RATE;
    const total    = sub + shippingCost + tax;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('review-subtotal', formatPrice(sub));
    set('review-shipping', shippingCost === 0 ? 'FREE' : formatPrice(shippingCost));
    set('review-tax',      formatPrice(tax));
    set('review-total',    formatPrice(total));

    // Address
    const addr = document.getElementById('review-address');
    if (addr) {
      const get = id => document.getElementById(id)?.value || '';
      addr.textContent = `${get('first-name')} ${get('last-name')}, ${get('address')}${get('address2') ? ', ' + get('address2') : ''}, ${get('city')}, ${get('state')} ${get('zip')}, ${document.getElementById('country')?.options[document.getElementById('country').selectedIndex]?.text || ''}`;
    }

    // Payment
    const method = document.querySelector('input[name="payment"]:checked')?.value || 'card';
    const payEl  = document.getElementById('review-payment');
    if (payEl) {
      if (method === 'card') {
        const last4 = document.getElementById('card-number')?.value.replace(/\s/g, '').slice(-4) || '****';
        payEl.textContent = `Credit/Debit Card ending in ${last4}`;
      } else if (method === 'paypal') {
        payEl.textContent = 'PayPal';
      } else {
        payEl.textContent = 'Apple Pay';
      }
    }

    // Review items
    const reviewItems = document.getElementById('review-items');
    if (reviewItems) {
      const cart = getCart();
      reviewItems.innerHTML = cart.map(item => {
        const p = getProductById(item.productId);
        if (!p) return '';
        return `
          <div class="summary-item">
            <img class="summary-item__img" src="${p.image}" alt="${p.name}" loading="lazy" />
            <div style="flex:1;min-width:0;">
              <div class="summary-item__name">${sanitize(p.name)}</div>
              <div class="summary-item__qty">Qty: ${item.qty}</div>
            </div>
            <span class="summary-item__price">${formatPrice(p.price * item.qty)}</span>
          </div>
        `;
      }).join('');
    }
  }

  // ── Step 0 form submit ──
  document.getElementById('shipping-form')?.addEventListener('submit', e => {
    e.preventDefault();
    if (validateShipping()) goToStep(1);
  });

  // ── Step 1 form submit ──
  document.getElementById('payment-form')?.addEventListener('submit', e => {
    e.preventDefault();
    if (validatePayment()) { populateReview(); goToStep(2); }
  });

  // ── Place order ──
  document.getElementById('place-order-btn')?.addEventListener('click', () => {
    const btn = document.getElementById('place-order-btn');
    btn.classList.add('btn-loading');
    btn.disabled = true;

    setTimeout(() => {
      const sub   = getCartTotal();
      const tax   = sub * TAX_RATE;
      const total = sub + shippingCost + tax;
      const orderId = 'LX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      const method  = document.querySelector('input[name="payment"]:checked')?.value || 'card';
      const ship    = document.querySelector('input[name="shipping"]:checked')?.value || 'standard';
      const deliveryMap = { standard: '5–7 business days', express: '2–3 business days', overnight: 'Next business day' };

      document.getElementById('confirm-order-id').textContent  = '#' + orderId;
      document.getElementById('confirm-total').textContent     = formatPrice(total);
      document.getElementById('confirm-delivery').textContent  = deliveryMap[ship] || '5–7 business days';
      document.getElementById('confirm-city').textContent      = document.getElementById('city')?.value || '—';
      document.getElementById('confirm-payment').textContent   = method === 'card'
        ? 'Card ···' + (document.getElementById('card-number')?.value.replace(/\s/g, '').slice(-4) || '****')
        : method === 'paypal' ? 'PayPal' : 'Apple Pay';

      clearCart();
      goToStep(3);
      btn.classList.remove('btn-loading');
      btn.disabled = false;
    }, 1200);
  });

  goToStep(0);
}

/* ============================================
   ACCOUNT PAGE
   ============================================ */

// ── Auth state (persisted in sessionStorage for demo) ──
const AUTH_KEY = 'luxe_auth_user';

function getAuthUser() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)); } catch { return null; }
}
function setAuthUser(user) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
function clearAuthUser() {
  sessionStorage.removeItem(AUTH_KEY);
}

// Known customers (used for testimonials only)
const KNOWN_CUSTOMERS = [
  { name: 'Pogba Mengstu',     email: 'pogba@luxeshop.com',    initials: 'PM' },
  { name: 'Bitaniya Biniyam',  email: 'bitaniya@luxeshop.com', initials: 'BB' },
  { name: 'Sisay Wondfraw',    email: 'sisay@luxeshop.com',    initials: 'SW' },
];

function initAccountPage() {
  const MOCK_ORDERS = [
    { id: 'LX-A1B2C3', date: 'Mar 10, 2026', status: 'delivered', items: [1, 3], total: 1248.98 },
    { id: 'LX-D4E5F6', date: 'Feb 22, 2026', status: 'shipped',   items: [5, 7], total: 389.98 },
    { id: 'LX-G7H8I9', date: 'Jan 15, 2026', status: 'delivered', items: [2],    total: 1299.00 },
  ];

  const authUser = getAuthUser();
  const isLoggedIn = !!authUser;

  // ── Show/hide account vs auth section ──
  const accountLayout = document.querySelector('.account-layout');
  const authSection   = document.getElementById('auth-section');
  if (accountLayout) accountLayout.style.display = isLoggedIn ? 'grid' : 'none';
  if (authSection)   authSection.style.display   = isLoggedIn ? 'none' : 'block';

  // ── Populate sidebar with logged-in user ──
  if (isLoggedIn) {
    const parts    = authUser.name.split(' ');
    const initials = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('nav-name',  authUser.name);
    setEl('nav-email', authUser.email);
    const navAvatar = document.getElementById('nav-avatar');
    if (navAvatar) {
      if (authUser.photo) {
        navAvatar.innerHTML = `<img src="${authUser.photo}" alt="${authUser.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
      } else {
        navAvatar.textContent = initials.toUpperCase();
      }
    }
    // Pre-fill profile form
    const nameParts = authUser.name.split(' ');
    const pfFirst = document.getElementById('pf-first');
    const pfLast  = document.getElementById('pf-last');
    const pfEmail = document.getElementById('pf-email');
    if (pfFirst) pfFirst.value = nameParts[0] || '';
    if (pfLast)  pfLast.value  = nameParts.slice(1).join(' ') || '';
    if (pfEmail) pfEmail.value = authUser.email || '';
    // Profile avatar
    updateProfileAvatar();
  }

  // ── Panel navigation ──
  function showPanel(panelId) {
    document.querySelectorAll('.account-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.account-nav__link[data-panel]').forEach(l => {
      l.classList.toggle('active', l.dataset.panel === panelId);
      l.setAttribute('aria-selected', l.dataset.panel === panelId ? 'true' : 'false');
    });
    document.getElementById(`panel-${panelId}`)?.classList.add('active');
    if (panelId === 'wishlist') renderWishlist();
  }

  document.querySelectorAll('[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => showPanel(btn.dataset.panel));
  });

  if (window.location.hash === '#wishlist') showPanel('wishlist');

  // ── Stats ──
  const wishCount  = getWishlist().length;
  const totalSpent = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('stat-orders',   MOCK_ORDERS.length);
  setEl('stat-wishlist', wishCount);
  setEl('stat-spent',    formatPrice(totalSpent));

  // ── Render order card ──
  function renderOrderCard(order) {
    const statusMap = {
      delivered:  { cls: 'order-status--delivered',  icon: '✅', label: 'Delivered' },
      shipped:    { cls: 'order-status--shipped',     icon: '🚚', label: 'Shipped' },
      processing: { cls: 'order-status--processing',  icon: '⏳', label: 'Processing' },
      cancelled:  { cls: 'order-status--cancelled',   icon: '❌', label: 'Cancelled' },
    };
    const s = statusMap[order.status] || statusMap.processing;
    const imgs = order.items.map(id => {
      const p = getProductById(id);
      return p ? `<img class="order-card__img" src="${p.image}" alt="${p.name}" loading="lazy" title="${p.name}" />` : '';
    }).join('');
    return `
      <div class="order-card">
        <div class="order-card__header">
          <div>
            <div class="order-card__id">${order.id}</div>
            <div class="order-card__date">${order.date}</div>
          </div>
          <span class="order-status ${s.cls}">${s.icon} ${s.label}</span>
        </div>
        <div class="order-card__items">${imgs}</div>
        <div class="order-card__footer">
          <span style="font-size:0.8rem;color:var(--text-muted);">${order.items.length} item${order.items.length > 1 ? 's' : ''}</span>
          <span class="order-card__total">${formatPrice(order.total)}</span>
          <button class="btn btn-ghost btn-sm">View Details</button>
        </div>
      </div>
    `;
  }

  const recentPreview = document.getElementById('recent-orders-preview');
  if (recentPreview) recentPreview.innerHTML = MOCK_ORDERS.slice(0, 2).map(renderOrderCard).join('');

  function renderOrders(filter = 'all') {
    const list = document.getElementById('orders-list');
    if (!list) return;
    const filtered = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);
    list.innerHTML = filtered.length === 0
      ? `<div class="empty-state"><div class="empty-state__icon">📦</div><div class="empty-state__title">No orders found</div><div class="empty-state__text">Try a different filter</div></div>`
      : filtered.map(renderOrderCard).join('');
  }
  renderOrders();
  document.getElementById('order-filter')?.addEventListener('change', e => renderOrders(e.target.value));

  // ── Wishlist ──
  function renderWishlist() {
    const wishGrid = document.getElementById('wishlist-grid');
    if (!wishGrid) return;
    const ids = getWishlist();
    setEl('stat-wishlist', ids.length);
    wishGrid.innerHTML = ids.length === 0
      ? `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state__icon">♥</div><div class="empty-state__title">Your wishlist is empty</div><div class="empty-state__text">Save items you love</div><a href="shop.html" class="btn btn-primary">Browse Shop</a></div>`
      : ids.map(id => { const p = getProductById(id); return p ? buildProductCard(p) : ''; }).join('');
  }
  renderWishlist();
  document.addEventListener('wishlist:updated', renderWishlist);

  // ── Profile avatar update ──
  function updateProfileAvatar() {
    const user = getAuthUser();
    const first = document.getElementById('pf-first')?.value.trim()[0] || '';
    const last  = document.getElementById('pf-last')?.value.trim()[0] || '';
    const initials = (first + last).toUpperCase() || 'JD';

    const avatarEl = document.getElementById('profile-avatar-initials');
    if (avatarEl) {
      if (user?.photo) {
        avatarEl.innerHTML = `<img src="${user.photo}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
      } else {
        avatarEl.textContent = initials;
        avatarEl.innerHTML = '';
        avatarEl.textContent = initials;
      }
    }
    // Update sidebar avatar too
    const navAvatar = document.getElementById('nav-avatar');
    if (navAvatar) {
      if (user?.photo) {
        navAvatar.innerHTML = `<img src="${user.photo}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
      } else {
        navAvatar.textContent = initials;
      }
    }
    const navName = document.getElementById('nav-name');
    if (navName) navName.textContent = `${document.getElementById('pf-first')?.value || ''} ${document.getElementById('pf-last')?.value || ''}`.trim();
  }

  document.getElementById('pf-first')?.addEventListener('input', updateProfileAvatar);
  document.getElementById('pf-last')?.addEventListener('input', updateProfileAvatar);

  // ── Profile image upload ──
  document.getElementById('avatar-upload-btn')?.addEventListener('click', () => {
    document.getElementById('avatar-file-input')?.click();
  });
  document.getElementById('avatar-upload-btn-text')?.addEventListener('click', () => {
    document.getElementById('avatar-file-input')?.click();
  });
  document.getElementById('avatar-file-input')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('error', 'Invalid File', 'Please select an image file'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const user = getAuthUser() || {};
      user.photo = ev.target.result;
      setAuthUser(user);
      updateProfileAvatar();
      showToast('success', 'Photo Updated', 'Your profile photo has been changed');
    };
    reader.readAsDataURL(file);
  });

  // ── Profile form submit ──
  document.getElementById('profile-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const newPw  = document.getElementById('pf-new-pw')?.value;
    const confPw = document.getElementById('pf-confirm-pw')?.value;
    if (newPw && newPw !== confPw) { showToast('error', 'Password Mismatch', 'New passwords do not match'); return; }
    const user = getAuthUser() || {};
    user.name  = `${document.getElementById('pf-first')?.value || ''} ${document.getElementById('pf-last')?.value || ''}`.trim();
    user.email = document.getElementById('pf-email')?.value || user.email;
    setAuthUser(user);
    setEl('nav-name',  user.name);
    setEl('nav-email', user.email);
    updateProfileAvatar();
    showToast('success', 'Profile Updated', 'Your changes have been saved');
  });

  // ── Password visibility toggles ──
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    });
  });

  // ── Auth tab switching ──
  function switchAuthTab(tab) {
    const isLogin = tab === 'login';
    document.getElementById('tab-login')?.classList.toggle('active', isLogin);
    document.getElementById('tab-register')?.classList.toggle('active', !isLogin);
    document.getElementById('login-form')?.classList.toggle('active', isLogin);
    document.getElementById('register-form')?.classList.toggle('active', !isLogin);
  }
  document.getElementById('tab-login')?.addEventListener('click',    () => switchAuthTab('login'));
  document.getElementById('tab-register')?.addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('show-register')?.addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('show-login')?.addEventListener('click',    () => switchAuthTab('login'));

  // ── Login ──
  document.getElementById('login-form-el')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const known = KNOWN_CUSTOMERS.find(c => c.email.toLowerCase() === email.toLowerCase());
    const user  = known
      ? { name: known.name, email: known.email, initials: known.initials }
      : { name: email.split('@')[0], email };
    setAuthUser(user);
    showToast('success', `Welcome back, ${user.name.split(' ')[0]}!`, 'You are now signed in');
    setTimeout(() => location.reload(), 800);
  });

  // ── Register ──
  document.getElementById('register-form-el')?.addEventListener('submit', e => {
    e.preventDefault();
    const first = document.getElementById('reg-first')?.value.trim();
    const last  = document.getElementById('reg-last')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const user  = { name: `${first} ${last}`.trim(), email };
    setAuthUser(user);
    showToast('success', `Welcome, ${first}!`, 'Your account has been created');
    setTimeout(() => location.reload(), 800);
  });

  // ── Sign out ──
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    clearAuthUser();
    showToast('info', 'Signed Out', 'See you next time!');
    setTimeout(() => location.reload(), 600);
  });

  // ── Address / Settings ──
  document.getElementById('add-address-btn')?.addEventListener('click',  () => showToast('info', 'Coming Soon', 'Address management coming soon'));
  document.getElementById('add-address-card')?.addEventListener('click', () => showToast('info', 'Coming Soon', 'Address management coming soon'));
  document.getElementById('delete-account-btn')?.addEventListener('click', () => showToast('warning', 'Are you sure?', 'This action cannot be undone'));
}

