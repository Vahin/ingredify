import { NutritionVariant } from '../../model/types/nutrition-variant';
import { NutritionIcon } from '../nutrition-icon/nutrition-icon';

interface NutritionCardProps {
  variant: NutritionVariant;
  stat: number;
}

const nutritionLabels: Record<NutritionVariant, string> = {
  calories: 'Калории',
  protein: 'Белки',
  fat: 'Жиры',
  carbs: 'Углеводы',
};

export const NutritionCard = ({ variant, stat }: NutritionCardProps) => {
  return (
    <div className='grid min-h-16 grid-cols-[34px_1fr] items-center gap-2.5 rounded-xl bg-muted p-3'>
      <NutritionIcon variant={variant} />
      <div className='min-w-0'>
        <p className='font-mono text-[17px] font-[850] leading-none tabular-nums'>
          {stat}
        </p>
        <p className='mt-1 text-[10px] text-secondary'>
          {nutritionLabels[variant]}
        </p>
      </div>
    </div>
  );
};
