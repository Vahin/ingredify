import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { IngredientSidebarGroup } from '../ingredient-sidebar-group/ingredient-sidebar-group';

type IngredientSidebarListProps = {
  groups: RecipeIngredientGroupView[];
  addingLineIds?: Set<string>;
  inCartIds?: Set<string>;
  removingLineIds?: Set<string>;
  onAddLine?: (lineId: string) => void;
  onRemoveLine?: (lineId: string) => void;
};

export const IngredientSidebarList = ({
  groups,
  addingLineIds,
  inCartIds,
  removingLineIds,
  onAddLine,
  onRemoveLine,
}: IngredientSidebarListProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {groups.map((group) => (
        <IngredientSidebarGroup
          addingLineIds={addingLineIds}
          group={group}
          inCartIds={inCartIds}
          key={group.id}
          onAddLine={onAddLine}
          onRemoveLine={onRemoveLine}
          removingLineIds={removingLineIds}
        />
      ))}
    </div>
  );
};
