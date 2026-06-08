import { type RecipeIngredientLine } from '@/entities/ingredient';
import { IngredientName } from '../ingredient-name/ingredient-name';
import { IngredientAmount } from '../ingredient-amount/ingredient-amount';
import { InteractiveRowSticker } from '../interactive-sticker/interactive-sticker';
import { IngredientWrapper } from '../ingredient-wrapper/ingredient-wrapper';

type IngredientRowProps = {
  line: RecipeIngredientLine;
  isAddingToCart?: boolean;
  isInCart?: boolean;
  isRemovingFromCart?: boolean;
  onAddToCart?: () => void;
  onRemoveFromCart?: () => void;
};

export const IngredientRow = ({
  line,
  isAddingToCart = false,
  isInCart = false,
  isRemovingFromCart = false,
  onAddToCart,
  onRemoveFromCart,
}: IngredientRowProps) => {
  const ingredientHref = `/ingredients/${line.ingredientId}`;

  return (
    <IngredientWrapper
      variant={isInCart ? 'accent-border' : 'default'}
      id={line.id}
    >
      <>
        <InteractiveRowSticker
          name={line.name}
          sticker={line.sticker}
          isInCart={isInCart}
          isRemovingFromCart={isRemovingFromCart}
          isAddingToCart={isAddingToCart}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
        />
        <IngredientName href={ingredientHref} name={line.name} />
        <IngredientAmount
          amountValue={line.amountValue}
          unitLabel={line.unit.label}
        />
      </>
    </IngredientWrapper>
  );
};
