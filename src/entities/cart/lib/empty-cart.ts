import type { SessionCart } from '../model/types/cart';

export const emptyCart = (): SessionCart => ({
  items: [],
  recipeSyncs: [],
});
