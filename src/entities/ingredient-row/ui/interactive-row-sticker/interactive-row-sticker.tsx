import { InteractiveSticker } from '@/shared/ui/interactive-sticker/interactive-sticker';

interface InteractiveIngredientStickerProps {
  name: string;
  sticker: string;
  isRemovingFromCart: boolean;
  isAddingToCart: boolean;
  isInCart?: boolean;
  onAddToCart?: () => void;
  onRemoveFromCart?: () => void;
}

export const InteractiveRowSticker = (
  props: InteractiveIngredientStickerProps,
) => {
  const {
    name,
    sticker,
    isRemovingFromCart,
    isAddingToCart,
    isInCart = false,
    onAddToCart,
    onRemoveFromCart,
  } = props;

  const canAddToCart = !isInCart && Boolean(onAddToCart);
  const canRemoveFromCart = isInCart && Boolean(onRemoveFromCart);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAddToCart?.();
  };

  const handleRemoveFromCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemoveFromCart?.();
  };

  if (canRemoveFromCart) {
    return (
      <InteractiveSticker
        variant='removing'
        sticker={sticker}
        name={name}
        isPending={isRemovingFromCart}
        onClick={handleRemoveFromCart}
      />
    );
  }

  if (canAddToCart) {
    return (
      <InteractiveSticker
        variant='adding'
        sticker={sticker}
        name={name}
        isPending={isAddingToCart}
        onClick={handleAddToCart}
      />
    );
  }

  return <InteractiveSticker variant='default' sticker={sticker} name={name} />;
};
