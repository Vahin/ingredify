'use client';

import { useCallback } from 'react';

export const CART_HEADER_LINK_ID = 'cart-header-link';

const STAGGER_MS = 60;
const DURATION_MS = 650;

/** Анимирует стикеры ингредиентов, «улетающие» в иконку корзины в header */
export function useCartFlyAnimation() {
  const flyStickers = useCallback(
    (stickers: string[], sourceElements: Element[]) => {
      if (typeof window === 'undefined') {
        return;
      }

      const target = document.getElementById(CART_HEADER_LINK_ID);
      if (!target) {
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      stickers.forEach((sticker, index) => {
        const source = sourceElements[index];
        const sourceRect = source?.getBoundingClientRect();
        const left = sourceRect
          ? sourceRect.left + sourceRect.width / 2 - 16
          : targetX - 16;
        const top = sourceRect
          ? sourceRect.top + sourceRect.height / 2 - 16
          : targetY - 16;

        const node = document.createElement('div');
        node.className = 'pointer-events-none fixed z-[100] size-8 overflow-hidden rounded-md';
        node.style.left = `${left}px`;
        node.style.top = `${top}px`;
        node.innerHTML = `<img src="${sticker}" alt="" class="size-full object-contain" />`;
        document.body.appendChild(node);

        const deltaX = targetX - left - 16;
        const deltaY = targetY - top - 16;

        const animation = node.animate(
          [
            {
              transform: 'translate(0, 0) scale(1)',
              opacity: '1',
            },
            {
              transform: `translate(${deltaX}px, ${deltaY}px) scale(0.35)`,
              opacity: '0.15',
            },
          ],
          {
            duration: DURATION_MS,
            delay: index * STAGGER_MS,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards',
          },
        );

        animation.onfinish = () => {
          node.remove();
        };
      });
    },
    [],
  );

  return { flyStickers };
}
