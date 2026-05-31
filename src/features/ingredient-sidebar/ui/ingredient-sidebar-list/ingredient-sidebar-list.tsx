import { IngredientLine, IngredientSection } from '../../model/types/ingredient-line';
import Link from 'next/link';
import { IngredientSticker } from '@/entities/ingredient';

const IngredientName = ({
  name,
  linkedRecipeId,
}: {
  name: string;
  linkedRecipeId?: string;
}) => {
  if (linkedRecipeId) {
    return (
      <Link
        className='min-w-0 text-sm font-semibold text-foreground underline-offset-2 hover:underline'
        href={`/recipes/${linkedRecipeId}`}
      >
        {name}
      </Link>
    );
  }
  return (
    <span className='min-w-0 text-sm font-semibold text-foreground'>
      {name}
    </span>
  );
};

const IngredientAmount = ({
  amountValue,
  unitLabel,
}: {
  amountValue: string;
  unitLabel: string;
}) => {
  return (
    <span className='whitespace-nowrap font-mono text-xs tabular-nums text-secondary'>
      <span>{amountValue}</span>
      <span className='ml-1'>{unitLabel}</span>
    </span>
  );
};

const IngredientRow = ({ ingredient }: { ingredient: IngredientLine }) => {
  return (
    <div className='grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] p-2.5 transition-colors hover:bg-muted'>
      <IngredientSticker src={ingredient.sticker} />
      <IngredientName
        name={ingredient.name}
        linkedRecipeId={ingredient.linkedRecipeId}
      />
      <IngredientAmount
        amountValue={ingredient.amountValue}
        unitLabel={ingredient.unit.label}
      />
    </div>
  );
};

export const IngredientSidebarList = ({
  sections,
}: {
  sections: IngredientSection[];
}) => {
  const plainMode = sections.length === 1 && sections[0]?.label === null;

  if (plainMode) {
    return (
      <div className='flex flex-col gap-2'>
        {sections[0]!.lines.map((ingredient) => (
          <IngredientRow ingredient={ingredient} key={ingredient.id} />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {sections.map((section) => (
        <div className='flex flex-col gap-2' key={section.id}>
          {section.label ? (
            <h3 className='px-2.5 text-xs font-extrabold tracking-[0.14em] text-secondary'>
              {section.label}
            </h3>
          ) : null}
          {section.lines.map((ingredient) => (
            <IngredientRow ingredient={ingredient} key={ingredient.id} />
          ))}
        </div>
      ))}
    </div>
  );
};
