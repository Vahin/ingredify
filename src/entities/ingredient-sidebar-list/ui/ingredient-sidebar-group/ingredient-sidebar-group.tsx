import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { IngredientRow } from '../ingredient-row/ingredient-row';

export const IngredientSidebarGroup = ({
  group,
}: {
  group: RecipeIngredientGroupView;
}) => {
  const plainMode = group.label === null;

  if (plainMode) {
    return (
      <div className='flex flex-col gap-2'>
        {group.lines.map((line) => (
          <IngredientRow line={line} key={line.id} />
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
        <IngredientRow line={line} key={line.id} />
      ))}
    </div>
  );
};
