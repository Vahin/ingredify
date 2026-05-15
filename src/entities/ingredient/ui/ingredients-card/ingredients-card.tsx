import { type Recipe } from '@/entities/recipe';
import { IconOld } from '@/shared/ui/icon';

export const IngredientsCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <section
      aria-labelledby='ingredients-title'
      className='rounded-2xl border border-border bg-card p-[18px] shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]'
      data-od-id='ingredients'
    >
      <div className='mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2'>
        <h2
          className='min-w-0 text-[22px] font-[850] leading-[1.15] text-foreground'
          id='ingredients-title'
        >
          Ингредиенты
        </h2>
        <div
          aria-label='Количество порций'
          className='grid h-7 w-[82px] grid-cols-[24px_24px_24px] items-center gap-[3px] overflow-hidden rounded-full bg-muted p-0.5'
        >
          <button
            aria-label='Уменьшить порции'
            className='grid size-6 place-items-center rounded-full bg-card text-sm font-[850] leading-none text-secondary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_7%,transparent)] transition hover:-translate-y-px hover:bg-accent hover:text-white'
            type='button'
          >
            <IconOld name='minus' className='size-3.5' />
          </button>
          <span className='text-center font-mono text-xs font-extrabold tabular-nums text-foreground'>
            2
          </span>
          <button
            aria-label='Увеличить порции'
            className='grid size-6 place-items-center rounded-full bg-card text-sm font-[850] leading-none text-secondary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_7%,transparent)] transition hover:-translate-y-px hover:bg-accent hover:text-white'
            type='button'
          >
            <IconOld name='plus' className='size-3.5' />
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {recipe.ingredients.map((ingredient) => (
          <div
            className={`grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] p-2.5 transition-colors hover:bg-muted ${
              ingredient.checked ? 'bg-accent/15' : ''
            }`}
            key={ingredient.name}
          >
            <span
              className={`grid size-[18px] place-items-center rounded-[5px] border ${
                ingredient.checked
                  ? 'border-accent bg-accent text-white'
                  : 'border-border'
              }`}
            >
              {ingredient.checked ? (
                <IconOld name='check' className='size-3' />
              ) : null}
            </span>
            <span
              className={`min-w-0 text-sm font-semibold text-foreground ${
                ingredient.checked ? 'opacity-70' : ''
              }`}
            >
              {ingredient.name}
            </span>
            <span
              className={`whitespace-nowrap font-mono text-xs tabular-nums text-secondary ${
                ingredient.checked ? 'opacity-70' : ''
              }`}
            >
              {ingredient.amount}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
