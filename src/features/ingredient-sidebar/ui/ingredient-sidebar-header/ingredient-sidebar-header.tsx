'use client';

import { useState } from 'react';
import { hasRecipeServings } from '@/entities/recipe/lib/has-recipe-servings';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import { IconOld } from '@/shared/ui/icon';
import {
  clampOutputQuantity,
  getMaxOutputQuantity,
  parseOutputQuantityInput,
} from '../../model/lib/output-quantity';

const getPortionLabel = (count: number) => {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod100 >= 11 && mod100 <= 14) {
    return 'Порций';
  }

  if (mod10 === 1) {
    return 'Порция';
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return 'Порции';
  }

  return 'Порций';
};

type IngredientSidebarHeaderProps = {
  /** Управление количеством выхода рецепта (порции, граммы, мл и т.д.) */
  quantityControl: {
    value: number;
    output: RecipeOutput;
    onChange: (value: number) => void;
    onDecrease: () => void;
    onIncrease: () => void;
  };
  menu?: React.ReactNode;
};

export const IngredientSidebarHeader = ({
  quantityControl,
  menu,
}: IngredientSidebarHeaderProps) => {
  const { value, output, onChange, onDecrease, onIncrease } = quantityControl;
  const portionRecipe = hasRecipeServings(output);
  const [inputDraft, setInputDraft] = useState(String(value));
  const [isEditing, setIsEditing] = useState(false);
  const inputValue = isEditing ? inputDraft : String(value);

  const commitDraft = () => {
    const parsed = parseOutputQuantityInput(inputValue);

    if (parsed === null) {
      setIsEditing(false);
      return;
    }

    const next = clampOutputQuantity(parsed, output);
    onChange(next);
    setIsEditing(false);
  };

  const maxQuantity = getMaxOutputQuantity(output);
  const unitLabel = portionRecipe
    ? getPortionLabel(value)
    : output.unit.label;

  const quantityAriaLabel = portionRecipe
    ? 'Количество порций'
    : `Количество выхода, ${output.unit.label}`;

  return (
    <div className='mb-4 flex flex-col gap-2'>
      <div className='flex w-full items-start justify-between gap-2'>
        <h2
          className='min-w-0 text-[22px] font-[850] leading-[1.15] text-foreground'
          id='ingredients-title'
        >
          Ингредиенты
        </h2>
        {menu}
      </div>
      <div className='flex items-center gap-2'>
        <div
          aria-label={quantityAriaLabel}
          className='flex h-7 items-center gap-[3px] overflow-hidden rounded-full bg-muted p-0.5'
        >
          <button
            aria-label='Уменьшить количество'
            className='grid size-6 shrink-0 place-items-center rounded-full bg-card text-sm font-[850] leading-none text-secondary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_7%,transparent)] transition hover:-translate-y-px hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-40'
            disabled={value <= 1}
            onClick={onDecrease}
            type='button'
          >
            <IconOld name='minus' className='size-3.5' />
          </button>
          <input
            aria-label={quantityAriaLabel}
            className='h-6 w-12 min-w-0 border-0 bg-transparent px-0.5 text-center font-mono text-xs font-extrabold tabular-nums text-foreground outline-none focus:ring-0'
            inputMode='decimal'
            onBlur={commitDraft}
            onChange={(event) => {
              setIsEditing(true);
              setInputDraft(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitDraft();
              }
            }}
            type='text'
            value={inputValue}
          />
          <button
            aria-label='Увеличить количество'
            className='grid size-6 shrink-0 place-items-center rounded-full bg-card text-sm font-[850] leading-none text-secondary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_7%,transparent)] transition hover:-translate-y-px hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-40'
            disabled={value >= maxQuantity}
            onClick={onIncrease}
            type='button'
          >
            <IconOld name='plus' className='size-3.5' />
          </button>
        </div>
        <span className='text-xs font-extrabold tracking-[0.14em] text-secondary'>
          {unitLabel}
        </span>
      </div>
    </div>
  );
};
