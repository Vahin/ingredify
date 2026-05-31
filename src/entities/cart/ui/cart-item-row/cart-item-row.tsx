import type { CartItemView } from '../../model/types/cart';
import { IngredientSticker } from '@/entities/ingredient/ui/ingredient-sticker/ingredient-sticker';

type CartItemRowProps = {
  item: CartItemView;
  actions?: React.ReactNode;
};

export const CartItemRow = ({ item, actions }: CartItemRowProps) => {
  return (
    <div className='grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-border bg-card p-2.5'>
      <IngredientSticker src={item.sticker} />
      <div className='min-w-0'>
        <p className='truncate text-sm font-semibold text-foreground'>{item.name}</p>
        {item.isSubRecipe ? (
          <p className='text-xs text-secondary'>Подрецепт</p>
        ) : null}
      </div>
      <div className='flex items-center gap-2'>
        <span className='whitespace-nowrap font-mono text-xs tabular-nums text-secondary'>
          <span>{item.amountValue}</span>
          <span className='ml-1'>{item.unit.label}</span>
        </span>
        {actions}
      </div>
    </div>
  );
};
