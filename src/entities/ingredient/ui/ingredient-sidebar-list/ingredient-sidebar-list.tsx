import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { IngredientSidebarGroup } from '../ingredient-sidebar-group/ingredient-sidebar-group';

type IngredientSidebarListProps = {
  groups: RecipeIngredientGroupView[];
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleLine?: (lineId: string) => void;
};

export const IngredientSidebarList = ({
  groups,
  isSelectionMode = false,
  selectedIds,
  onToggleLine,
}: IngredientSidebarListProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {groups.map((group) => (
        <IngredientSidebarGroup
          key={group.id}
          group={group}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleLine={onToggleLine}
        />
      ))}
    </div>
  );
};
