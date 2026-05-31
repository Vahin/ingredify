import { Icon } from '@/shared/ui/icon';
import { cn } from '@/shared/lib/utils';
import FireSVG from '../../assets/icons/fire.svg';
import ProteinSVG from '../../assets/icons/biceps.svg';
import FatSVG from '../../assets/icons/drop.svg';
import CarbsSVG from '../../assets/icons/wheat.svg';
import { NutritionVariant } from '../../model/types/nutrition-variant';

interface NutritionIconProps {
  variant: NutritionVariant;
}

const IconSVGs: Record<NutritionVariant, React.ElementType> = {
  calories: FireSVG,
  protein: ProteinSVG,
  fat: FatSVG,
  carbs: CarbsSVG,
};

const iconColors: Record<NutritionVariant, string> = {
  calories: 'text-orange-500',
  protein: 'text-accent',
  fat: 'text-amber-500',
  carbs: 'text-violet-500',
};

export const NutritionIcon = ({ variant }: NutritionIconProps) => {
  return (
    <span
      className={cn(
        'grid size-[30px] place-items-center rounded-full bg-card',
        iconColors[variant],
      )}
    >
      <Icon SVG={IconSVGs[variant]} className='size-5' />
    </span>
  );
};
