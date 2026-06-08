import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addItems } from './add-items';
import { mergeCartItems } from './merge-cart-items';
import {
  removeCartItemFromSession,
  removeCartItemsFromSession,
} from './remove-cart-item';
import { updateRecipeCartQuantities } from './update-recipe-cart-quantities';
import type { AddableCartLine, SessionCart } from '../model/types/cart';
import type { MeasurementUnitView } from '@/entities/recipe/model/types/measurement-unit';

const gramUnit: MeasurementUnitView = {
  shortName: 'г',
  label: 'г',
  kind: 'mass',
  roundToInteger: true,
};

const butterLine: AddableCartLine = {
  recipeIngredientId: 'line-butter',
  name: 'Масло',
  sticker: '/ingredients/butter.png',
  quantity: 100,
  amountValue: '100',
  unit: gramUnit,
  unitId: 'unit-g',
  isSubRecipe: false,
};

const sugarLine: AddableCartLine = {
  recipeIngredientId: 'line-sugar',
  name: 'Сахар',
  sticker: '/ingredients/sugar.png',
  quantity: 50,
  amountValue: '50',
  unit: gramUnit,
  unitId: 'unit-g',
  isSubRecipe: false,
};

const emptyCart = (): SessionCart => ({
  items: [],
  recipeSyncs: [],
});

describe('cart lib', () => {
  it('adds only new recipe lines and tracks recipe sync', () => {
    const result = addItems(emptyCart(), {
      recipeId: 'recipe-1',
      recipeTitle: 'Пирог',
      outputQuantity: 4,
      lines: [butterLine, butterLine],
      createId: () => 'item-butter',
    });

    assert.equal(result.cart.items.length, 1);
    assert.equal(result.addedItems.length, 1);
    assert.equal(result.skippedCount, 1);
    assert.deepEqual(result.cart.recipeSyncs, [
      {
        recipeId: 'recipe-1',
        recipeTitle: 'Пирог',
        syncedOutputQuantity: 4,
      },
    ]);
  });

  it('updates recipe quantities proportionally', () => {
    const cart = addItems(emptyCart(), {
      recipeId: 'recipe-1',
      recipeTitle: 'Пирог',
      outputQuantity: 4,
      lines: [butterLine],
      createId: () => 'item-butter',
    }).cart;

    const result = updateRecipeCartQuantities(cart, {
      recipeId: 'recipe-1',
      newOutputQuantity: 8,
    });

    assert.equal(result.updatedCount, 1);
    assert.equal(result.cart.items[0]?.quantity, 200);
    assert.equal(result.cart.recipeSyncs[0]?.syncedOutputQuantity, 8);
  });

  it('removes recipe sync when the last recipe item disappears', () => {
    const cart = addItems(emptyCart(), {
      recipeId: 'recipe-1',
      recipeTitle: 'Пирог',
      outputQuantity: 4,
      lines: [butterLine, sugarLine],
      createId: () => crypto.randomUUID(),
    }).cart;

    const oneItemLeft = removeCartItemFromSession(cart, cart.items[0].id);
    assert.equal(oneItemLeft.recipeSyncs.length, 1);

    const noItemsLeft = removeCartItemsFromSession(
      oneItemLeft,
      oneItemLeft.items.map((item) => item.id),
    );
    assert.equal(noItemsLeft.recipeSyncs.length, 0);
  });

  it('merges equal cart items by name, unit and sub-recipe flag', () => {
    const cart = addItems(emptyCart(), {
      recipeId: 'recipe-1',
      recipeTitle: 'Пирог',
      outputQuantity: 4,
      lines: [butterLine],
      createId: () => 'item-butter-1',
    }).cart;

    cart.items.push({
      ...cart.items[0],
      id: 'item-butter-2',
      sourceRecipeId: 'recipe-2',
      quantity: 50,
      amountValue: '50',
    });

    const merged = mergeCartItems(cart.items);

    assert.equal(merged.length, 1);
    assert.equal(merged[0]?.quantity, 150);
    assert.deepEqual(merged[0]?.sourceItemIds, [
      'item-butter-1',
      'item-butter-2',
    ]);
  });
});
