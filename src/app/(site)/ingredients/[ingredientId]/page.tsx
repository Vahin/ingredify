import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getIngredient } from '@/entities/ingredient/api/get-ingredient';
import { Button } from '@/shared/ui/button';

type IngredientPageProps = {
  params: Promise<{
    ingredientId: string;
  }>;
};

export async function generateMetadata({
  params,
}: IngredientPageProps): Promise<Metadata> {
  const { ingredientId } = await params;
  const ingredient = await getIngredient(ingredientId);

  return {
    title: ingredient.name,
    description: ingredient.linkedRecipe?.description ?? ingredient.name,
  };
}

export default async function IngredientPage({ params }: IngredientPageProps) {
  const { ingredientId } = await params;
  const ingredient = await getIngredient(ingredientId);
  const isPreparedIngredient = Boolean(ingredient.linkedRecipe);

  return (
    <main className='mx-auto w-full max-w-[760px] px-4 py-10 md:px-6'>
      <section className='rounded-lg border border-border bg-card p-5 shadow-sm'>
        <div className='grid grid-cols-[64px_minmax(0,1fr)] gap-4'>
          <div className='grid size-16 place-items-center rounded-lg bg-muted'>
            <Image
              alt=''
              className='size-12 object-contain'
              height={48}
              src={ingredient.sticker}
              width={48}
            />
          </div>
          <div className='min-w-0'>
            <p className='mb-1 text-xs font-extrabold uppercase tracking-[0.14em] text-secondary'>
              {isPreparedIngredient ? 'Заготовка' : 'Ингредиент'}
            </p>
            <h1 className='truncate text-2xl font-bold text-foreground'>
              {ingredient.name}
            </h1>
            <p className='mt-2 text-sm text-secondary'>
              Используется в рецептах: {ingredient.usageCount}
            </p>
          </div>
        </div>

        {ingredient.linkedRecipe ? (
          <div className='mt-6 border-t border-border pt-5'>
            <h2 className='text-base font-semibold text-foreground'>
              Рецепт приготовления
            </h2>
            <p className='mt-2 text-sm leading-6 text-secondary'>
              {ingredient.linkedRecipe.description}
            </p>
            <Button asChild className='mt-4' variant='outline'>
              <Link href={`/recipes/${ingredient.linkedRecipe.id}`}>
                Открыть рецепт
              </Link>
            </Button>
          </div>
        ) : (
          <p className='mt-6 border-t border-border pt-5 text-sm leading-6 text-secondary'>
            Это базовая карточка ингредиента. Здесь будет общая информация,
            варианты продуктов или описание переиспользуемой заготовки.
          </p>
        )}
      </section>
    </main>
  );
}
