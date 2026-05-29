import type { Metadata } from 'next';
import { forbidden } from 'next/navigation';
import { getRecipeForEdit } from '@/entities/recipe';
import { verifySession } from '@/shared/lib/auth';

type RecipeEditPageProps = {
  params: Promise<{
    recipeId: string;
  }>;
};

export async function generateMetadata({
  params,
}: RecipeEditPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  const recipe = await getRecipeForEdit(recipeId);

  return {
    title: `Редактирование: ${recipe.title}`,
  };
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { recipeId } = await params;
  const user = await verifySession();
  const recipe = await getRecipeForEdit(recipeId);

  if (recipe.authorId !== user.id) {
    forbidden();
  }

  return (
    <main className='mx-auto w-full max-w-[800px] px-4 py-10 md:px-6'>
      <div className='rounded-2xl border border-border bg-card p-6 md:p-8'>
        <h1 className='text-2xl font-bold text-foreground'>
          Редактирование рецепта
        </h1>
        <p className='mt-3 text-secondary'>
          «{recipe.title}» — форма редактирования появится позже.
        </p>
      </div>
    </main>
  );
}
