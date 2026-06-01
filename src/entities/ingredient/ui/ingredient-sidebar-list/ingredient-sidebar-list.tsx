import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { IngredientSidebarGroup } from '../ingredient-sidebar-group/ingredient-sidebar-group';

type IngredientSidebarListProps = {
  groups: RecipeIngredientGroupView[];
  inCartIds?: Set<string>;
  isSelectionMode?: boolean;
  isLineSelected?: (lineId: string) => boolean;
  onToggleLine?: (lineId: string) => void;
};

export const IngredientSidebarList = ({
  groups,
  inCartIds,
  isSelectionMode = false,
  isLineSelected,
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
          onToggleLine={onToggleLine}
        />
      ))}
    </div>
  );
};
