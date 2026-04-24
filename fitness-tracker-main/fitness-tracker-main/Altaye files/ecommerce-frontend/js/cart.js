/**
 * cart.js - Cart & Wishlist management
 */

import { Storage } from './storage.js';
import { getProductById, formatPrice } from './products.js';
import { showToast } from './ui.js';

const CART_KEY     = 'luxe_cart';
const WISHLIST_KEY = 'luxe_wishlist';

/* ============================================
   CART
   ============================================ */
export function getCart() {
  return Storage.get(CART_KEY, []);
}

function saveCart(cart) {
  Storage.set(CART_KEY, cart);
  updateCartBadge();
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
}

export function addToCart(productId, qty = 1, variant = {}) {
  const product = getProductById(productId);
  if (!product) return;

  const cart = getCart();
  const key  = `${productId}-${JSON.stringify(variant)}`;
  const idx  = cart.findIndex(i => i.key === key);

  if (idx > -1) {
    cart[idx].qty = Math.min(cart[idx].qty + qty, product.stock);
  } else {
    cart.push({ key, productId, qty, variant, addedAt: Date.now() });
  }

  saveCart(cart);
  showToast('success', 'Added to Cart', `${product.name} added successfully`);
}

export function removeFromCart(key) {
  const cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
  showToast('info', 'Removed', 'Item removed from cart');
}

export function updateCartQty(key, qty) {
  const cart = getCart();
  const idx  = cart.findIndex(i => i.key === key);
  if (idx === -1) return;

  if (qty <= 0) {
    removeFromCart(key);
    return;
  }

  const product = getProductById(cart[idx].productId);
  cart[idx].qty = Math.min(qty, product?.stock || 99);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const p = getProductById(item.productId);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

export function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ============================================
   WISHLIST
   ============================================ */
export function getWishlist() {
  return Storage.get(WISHLIST_KEY, []);
}

function saveWishlist(list) {
  Storage.set(WISHLIST_KEY, list);
  updateWishlistBadge();
  document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { list } }));
}

export function toggleWishlist(productId) {
  const list = getWishlist();
  const id   = Number(productId);
  const idx  = list.indexOf(id);
  const product = getProductById(id);

  if (idx > -1) {
    list.splice(idx, 1);
    showToast('info', 'Removed', `${product?.name} removed from wishlist`);
  } else {
    list.push(id);
    showToast('success', 'Saved ♥', `${product?.name} added to wishlist`);
  }

  saveWishlist(list);
  return idx === -1; // returns true if added
}

export function isWishlisted(productId) {
  return getWishlist().includes(Number(productId));
}

export function updateWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('.wishlist-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ============================================
   RECENTLY VIEWED
   ============================================ */
const RECENT_KEY = 'luxe_recent';

export function addRecentlyViewed(productId) {
  const list = Storage.get(RECENT_KEY, []);
  const id   = Number(productId);
  const filtered = list.filter(i => i !== id);
  filtered.unshift(id);
  Storage.set(RECENT_KEY, filtered.slice(0, 8));
}

export function getRecentlyViewed() {
  return Storage.get(RECENT_KEY, []);
}

/* ============================================
   COUPON
   ============================================ */
const COUPONS = {
  'LUXE10': 0.10,
  'SAVE20': 0.20,
  'FIRST30': 0.30
};

export function applyCoupon(code) {
  const discount = COUPONS[code.toUpperCase()];
  if (discount) {
    return { valid: true, discount, message: `${discount * 100}% discount applied!` };
  }
  return { valid: false, discount: 0, message: 'Invalid coupon code' };
}

/* ============================================
   CART RENDER HELPERS
   ============================================ */
export function renderCartItems(container) {
  const cart = getCart();

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="flex-center flex-col" style="padding: 60px 20px; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🛒</div>
        <h3 style="margin-bottom: 8px; color: var(--text-primary);">Your cart is empty</h3>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Add some products to get started</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => {
    const p = getProductById(item.productId);
    if (!p) return '';
    return `
      <div class="cart-item" data-key="${item.key}">
        <img class="cart-item__img" src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="cart-item__info">
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__variant">${Object.values(item.variant).join(' · ') || 'Standard'}</div>
          <div class="flex items-center gap-3">
            <div class="qty-control">
              <button class="qty-btn" data-action="dec" data-key="${item.key}" aria-label="Decrease quantity">−</button>
              <input class="qty-input" type="number" value="${item.qty}" min="1" max="${p.stock}" data-key="${item.key}" aria-label="Quantity" />
              <button class="qty-btn" data-action="inc" data-key="${item.key}" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-item__price">${formatPrice(p.price * item.qty)}</span>
          </div>
        </div>
        <button class="cart-item__remove remove-item-btn" data-key="${item.key}" aria-label="Remove ${p.name} from cart">✕</button>
      </div>
    `;
  }).join('');
}
