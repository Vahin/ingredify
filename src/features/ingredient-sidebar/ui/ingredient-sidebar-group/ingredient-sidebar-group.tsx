import { IngredientRow } from '@/entities/ingredient-row';
import type { RecipeIngredientGroupView } from '@/entities/recipe';


type IngredientSidebarGroupProps = {
  group: RecipeIngredientGroupView;
  addingLineIds?: Set<string>;
  inCartIds?: Set<string>;
  removingLineIds?: Set<string>;
  onAddLine?: (lineId: string) => void;
  onRemoveLine?: (lineId: string) => void;
};

export const IngredientSidebarGroup = ({
  group,
  addingLineIds,
  inCartIds,
  removingLineIds,
  onAddLine,
  onRemoveLine,
}: IngredientSidebarGroupProps) => {
  const plainMode = group.label === null;

  const renderLine = (line: (typeof group.lines)[number]) => {
    const isInCart = inCartIds?.has(line.id) ?? false;

    return (
      <IngredientRow
        isAddingToCart={addingLineIds?.has(line.id) ?? false}
        isInCart={isInCart}
        isRemovingFromCart={removingLineIds?.has(line.id) ?? false}
        key={line.id}
        line={line}
        onAddToCart={onAddLine ? () => onAddLine(line.id) : undefined}
        onRemoveFromCart={onRemoveLine ? () => onRemoveLine(line.id) : undefined}
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
