import type { SessionCart } from '../model/types/cart';
import { emptyCart } from './apply-cart-delta';

export const SESSION_CART_STORAGE_KEY = 'ingredify:cart';

export function readSessionCart(): SessionCart {
  if (typeof window === 'undefined') {
    return emptyCart();
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_CART_STORAGE_KEY);
    if (!raw) {
      return emptyCart();
    }

    const parsed = JSON.parse(raw) as SessionCart;
    if (!Array.isArray(parsed.items) || !Array.isArray(parsed.recipeSyncs)) {
      return emptyCart();
    }

    return parsed;
  } catch {
    return emptyCart();
  }
}

export function writeSessionCart(cart: SessionCart): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(SESSION_CART_STORAGE_KEY, JSON.stringify(cart));
}

export function clearSessionCart(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(SESSION_CART_STORAGE_KEY);
}
