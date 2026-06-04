import { CheckIcon } from "lucide-react";

export const InCartIndicator = () => (
  <span
    aria-label='В корзине'
    className='flex size-4 items-center justify-center text-accent'
  >
    <CheckIcon className='size-3.5' strokeWidth={2.5} />
  </span>
);