import { IngredientRow } from '@/entities/ingredient-row';
import type { RecipeIngredientGroupView } from '@/entities/recipe';


type IngredientSidebarGroupProps = {
  group: RecipeIngredientGroupView;
  inCartIds?: Set<string>;
  isSelectionMode?: boolean;
  isLineSelected?: (lineId: string) => boolean;
  removingLineIds?: Set<string>;
  onRemoveLine?: (lineId: string) => void;
  onToggleLine?: (lineId: string) => void;
};

export const IngredientSidebarGroup = ({
  group,
  inCartIds,
  isSelectionMode = false,
  isLineSelected,
  removingLineIds,
  onRemoveLine,
  onToggleLine,
}: IngredientSidebarGroupProps) => {
  const plainMode = group.label === null;

  const renderLine = (line: (typeof group.lines)[number]) => {
    const isInCart = inCartIds?.has(line.id) ?? false;

    return (
      <IngredientRow
        isInCart={isInCart}
        isRemovingFromCart={removingLineIds?.has(line.id) ?? false}
        key={line.id}
        line={line}
        onRemoveFromCart={onRemoveLine ? () => onRemoveLine(line.id) : undefined}
        selection={{
          enabled: isSelectionMode,
          isLocked: isInCart,
          isSelected: isLineSelected?.(line.id) ?? false,
          onToggle: onToggleLine ? () => onToggleLine(line.id) : undefined,
        }}
      />
    );
  };

  if (plainMode) {
    return (
      <div className='flex flex-col gap-2'>
        {group.lines.map(renderLine)}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2 rounded-lg border border-border bg-card p-2.5'>
      <h3 className='px-2.5 text-xs font-extrabold tracking-[0.14em] text-secondary'>
        {group.label}
      </h3>
      {group.lines.map(renderLine)}
    </div>
  );
};
