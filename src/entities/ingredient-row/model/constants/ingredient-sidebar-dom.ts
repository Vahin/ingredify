export const INGREDIENT_ROW_ID_ATTRIBUTE = 'data-ingredient-row-id';
export const INGREDIENT_STICKER_ATTRIBUTE = 'data-ingredient-sticker';

const escapeAttributeValue = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

export const getIngredientStickerSelector = (lineId: string) =>
  `[${INGREDIENT_ROW_ID_ATTRIBUTE}="${escapeAttributeValue(lineId)}"] [${INGREDIENT_STICKER_ATTRIBUTE}]`;
