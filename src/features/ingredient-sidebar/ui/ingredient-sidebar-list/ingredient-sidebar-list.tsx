import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { IngredientSidebarGroup } from '../ingredient-sidebar-group/ingredient-sidebar-group';

type IngredientSidebarListProps = {
  groups: RecipeIngredientGroupView[];
  inCartIds?: Set<string>;
  isSelectionMode?: boolean;
  isLineSelected?: (lineId: string) => boolean;
  removingLineIds?: Set<string>;
  onRemoveLine?: (lineId: string) => void;
  onToggleLine?: (lineId: string) => void;
};

export const IngredientSidebarList = ({
  groups,
  inCartIds,
  isSelectionMode = false,
  isLineSelected,
  removingLineIds,
  onRemoveLine,
  onToggleLine,
}: IngredientSidebarListProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {groups.map((group) => (
        <IngredientSidebarGroup
          group={group}
          inCartIds={inCartIds}
          isLineSelected={isLineSelected}
          isSelectionMode={isSelectionMode}
          key={group.id}
          onRemoveLine={onRemoveLine}
          onToggleLine={onToggleLine}
          removingLineIds={removingLineIds}
        />
      ))}
    </div>
  );
};
