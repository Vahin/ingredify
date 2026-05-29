import { NutritionStats } from '@/entities/nutrition';
import { type Recipe } from '@/entities/recipe';
import { RecipeHeroImage } from '../recipe-hero-image/recipe-hero-image';
import { RecipeAuthor } from '../recipe-author/recipe-author';
import { RecipeMainInfo } from '../recipe-main-info/recipe-main-info';
import { RecipeActions } from '../recipe-actions/recipe-actions';

export const RecipeIntro = ({ recipe }: { recipe: Recipe }) => {
  const commentsCount = recipe.comments.length;

  return (
    <section
      aria-labelledby='recipe-title'
      className='grid gap-[18px] rounded-2xl border border-border bg-card p-4 shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)] md:grid-cols-[clamp(188px,32%,300px)_1fr] md:items-start md:gap-[22px]'
      data-od-id='recipe-hero'
    >
      <RecipeHeroImage image={recipe.image} />

      <div className='flex min-w-0 flex-col justify-center gap-5 py-1'>
        <RecipeAuthor author={recipe.author} />
        <RecipeMainInfo title={recipe.title} description={recipe.description} />
        <NutritionStats nutrition={recipe.nutrition} />
        <RecipeActions commentsCount={commentsCount} />
      </div>
    </section>
  );
};
