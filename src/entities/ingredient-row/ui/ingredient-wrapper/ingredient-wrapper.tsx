import { cn } from '@/shared/lib/utils';
import { INGREDIENT_ROW_ID_ATTRIBUTE } from '../../model/constants/ingredient-sidebar-dom';

interface IngredientWrapperProps {
  variant?: 'default' | 'accent-border';
  id: string;
  children: React.ReactNode;
}

export const IngredientWrapper = (props: IngredientWrapperProps) => {
  const { variant = 'default', id, children } = props;
  const rowDataAttributes = { [INGREDIENT_ROW_ID_ATTRIBUTE]: id };

  return (
    <div
      className={cn(
        'grid items-center gap-2 rounded-[10px] border border-border border-l-[3px] border-l-transparent bg-card py-1.5 px-2 shadow-sm',
        'grid-cols-[32px_minmax(0,1fr)_auto]',
        variant === 'accent-border' && 'border-l-accent-hover',
      )}
      {...rowDataAttributes}
    >
      {children}
    </div>
  );
};
