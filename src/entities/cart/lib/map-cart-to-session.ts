import type { Prisma } from '@prisma';
import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import type {
  MeasurementUnitKind,
  MeasurementUnitShortName,
} from '@/entities/recipe/model/constants/measurement-units';
import type { MeasurementUnitView } from '@/entities/recipe/model/types/measurement-unit';
import type { CartItemView, CartRecipeSyncView, SessionCart } from '../model/types/cart';

type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    items: { include: { unit: true } };
    recipeSyncs: { include: { lineSyncs: true } };
  };
}>;

function mapUnit(row: CartWithRelations['items'][number]['unit']): MeasurementUnitView {
  return {
    shortName: row.shortName as MeasurementUnitShortName,
    label: row.shortName,
    kind: row.kind as MeasurementUnitKind,
    roundToInteger: row.roundToInteger,
  };
}

export function mapCartToSessionCart(cart: CartWithRelations): SessionCart {
  const items: CartItemView[] = cart.items.map((item) => {
    const unit = mapUnit(item.unit);
    const quantity = Number(item.quantity);

    return {
      id: item.id,
      sourceRecipeId: item.sourceRecipeId,
      recipeIngredientId: item.recipeIngredientId,
      name: item.name,
      sticker: item.sticker,
      quantity,
      amountValue: formatAmountValue(quantity, {
        roundToInteger: unit.roundToInteger,
      }),
      unit,
      unitId: item.unitId,
      isSubRecipe: item.isSubRecipe,
    };
  });

  const recipeSyncs: CartRecipeSyncView[] = cart.recipeSyncs.map((sync) => ({
    recipeId: sync.recipeId,
    syncedOutputQuantity: Number(sync.syncedOutputQuantity),
    lineSyncs: sync.lineSyncs.map((line) => ({
      recipeIngredientId: line.recipeIngredientId,
      syncedQuantity: Number(line.syncedQuantity),
    })),
  }));

  return { items, recipeSyncs };
}

export const cartInclude = {
  items: {
    orderBy: { createdAt: 'asc' as const },
    include: { unit: true },
  },
  recipeSyncs: {
    include: { lineSyncs: true },
  },
} satisfies Prisma.CartInclude;
