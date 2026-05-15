import { IconOld } from '@/shared/ui/icon';
import Image from 'next/image';

import { type Recipe } from '@/entities/recipe';
import { NutritionStats } from '@/entities/nutrition';

export const RecipeHero = ({ recipe }: { recipe: Recipe }) => {
  return (
    <section
      aria-labelledby='recipe-title'
      className='grid gap-[18px] rounded-2xl border border-border bg-card p-4 shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)] md:grid-cols-[clamp(188px,24%,212px)_1fr] md:items-center md:gap-[22px]'
      data-od-id='recipe-hero'
    >
      <div className='relative mx-auto aspect-9/18 w-[min(240px,100%)] overflow-hidden rounded-[14px] bg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] md:w-full'>
        <Image
          alt='Теплый вишневый коблер в керамической форме'
          className='object-cover'
          fill
          priority
          sizes='(max-width: 768px) 240px, 212px'
          src={recipe.image}
        />
      </div>

      <div className='flex min-w-0 flex-col justify-center gap-5 py-1'>
        <div className='flex items-center gap-2.5'>
          <div className='grid size-[34px] place-items-center rounded-full bg-accent/15 text-xs font-extrabold text-accent'>
            АК
          </div>
          <div>
            <p className='text-[13px] font-extrabold leading-none text-foreground'>
              {recipe.author}
            </p>
            <p className='mt-1 text-xs text-secondary'>{recipe.authorRole}</p>
          </div>
        </div>

        <div className='grid gap-2.5'>
          <h1
            className='text-[clamp(30px,4vw,38px)] font-[850] leading-[1.05] text-foreground'
            id='recipe-title'
          >
            {recipe.title}
          </h1>
          <p className='max-w-[56ch] text-[15px] leading-[1.6] text-secondary'>
            {recipe.description}
          </p>
        </div>

        <NutritionStats nutrition={recipe.nutrition} />

        <div className='flex flex-wrap gap-2.5'>
          <button
            className='inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-accent px-[17px] text-sm font-bold text-white shadow-[0_8px_18px_color-mix(in_oklch,var(--accent)_22%,transparent)] transition hover:-translate-y-px hover:bg-accent-hover focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent/25 active:translate-y-0'
            type='button'
          >
            <IconOld name='bookmark' className='size-[17px]' />
            Сохранить
          </button>
          <button
            className='inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-muted px-[17px] text-sm font-bold text-foreground transition hover:-translate-y-px hover:bg-border/70 active:translate-y-0'
            type='button'
          >
            <IconOld name='message' className='size-[17px] text-secondary' />
            12
          </button>
          <button
            aria-pressed='false'
            className='inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-red-50 px-[17px] text-sm font-bold text-red-500 transition hover:-translate-y-px active:translate-y-0'
            type='button'
          >
            <IconOld name='heart' className='size-[17px]' />
            124
          </button>
        </div>
      </div>
    </section>
  );
};
