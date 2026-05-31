import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { IngredientRow } from '../ingredient-row/ingredient-row';

type IngredientSidebarGroupProps = {
  group: RecipeIngredientGroupView;
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleLine?: (lineId: string) => void;
};

export const IngredientSidebarGroup = ({
  group,
  isSelectionMode = false,
  selectedIds,
  onToggleLine,
}: IngredientSidebarGroupProps) => {
  const plainMode = group.label === null;

  if (plainMode) {
    return (
      <div className='flex flex-col gap-2'>
        {group.lines.map((line) => (
          <IngredientRow
            isSelected={selectedIds?.has(line.id)}
            isSelectionMode={isSelectionMode}
            key={line.id}
            line={line}
            onToggleSelect={
              onToggleLine ? () => onToggleLine(line.id) : undefined
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2 rounded-lg border border-border bg-card p-2.5'>
      <h3 className='px-2.5 text-xs font-extrabold tracking-[0.14em] text-secondary'>
        {group.label}
      </h3>
      {group.lines.map((line) => (
        <IngredientRow
          isSelected={selectedIds?.has(line.id)}
          isSelectionMode={isSelectionMode}
          key={line.id}
          line={line}
          onToggleSelect={
            onToggleLine ? () => onToggleLine(line.id) : undefined
          }
        />
      ))}
    </div>
  );
};
