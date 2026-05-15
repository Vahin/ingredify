import { NutritionCard } from '../nutrition-card/nutrition-card';

type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export const NutritionStats = ({ nutrition }: { nutrition: Nutrition }) => {
  return (
    <div className='grid grid-cols-1 gap-2.5 min-[440px]:grid-cols-2 md:grid-cols-4'>
      <NutritionCard variant='calories' stat={nutrition.calories} />
      <NutritionCard variant='protein' stat={nutrition.protein} />
      <NutritionCard variant='fat' stat={nutrition.fat} />
      <NutritionCard variant='carbs' stat={nutrition.carbs} />
    </div>
  );
};
