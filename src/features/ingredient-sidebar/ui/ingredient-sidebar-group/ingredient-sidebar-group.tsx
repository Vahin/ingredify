import { IngredientRow } from '@/entities/ingredient-row';
import type { RecipeIngredientGroupView } from '@/entities/recipe';


type IngredientSidebarGroupProps = {
  group: RecipeIngredientGroupView;
  inCartIds?: Set<string>;
  isSelectionMode?: boolean;
  isLineSelected?: (lineId: string) => boolean;
  onToggleLine?: (lineId: string) => void;
};

export const IngredientSidebarGroup = ({
  group,
  inCartIds,
  isSelectionMode = false,
  isLineSelected,
  onToggleLine,
}: IngredientSidebarGroupProps) => {
  const plainMode = group.label === null;

  const renderLine = (line: (typeof group.lines)[number]) => {
    const isInCart = inCartIds?.has(line.id) ?? false;

    return (
      <IngredientRow
        isInCart={isInCart}
        key={line.id}
        line={line}
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
