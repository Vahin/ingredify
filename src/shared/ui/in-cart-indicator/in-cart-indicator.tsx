import { Icon } from "../icon";
import Cart from './cart.svg'

export const InCartIndicator = () => (
  <span
    aria-label='В корзине'
    className='flex size-4 items-center justify-center text-accent'
  >
    <Icon className='size-3.5 text-accent-hover' SVG={Cart} />
  </span>
);
