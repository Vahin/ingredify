import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { IngredientSidebarGroup } from '../ingredient-sidebar-group/ingredient-sidebar-group';

export const IngredientSidebarList = ({
  groups,
}: {
  groups: RecipeIngredientGroupView[];
}) => {
  return (
    <div className='flex flex-col gap-2'>
      {groups.map((group) => (
        <IngredientSidebarGroup key={group.id} group={group} />
      ))}
    </div>
  );
};
