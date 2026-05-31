'use client';

import type { RecipeIngredientSection } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import { useRecipeOutputQuantity } from '../../model/lib/use-recipe-output-quantity';
import { IngredientSidebarHeader } from '../../ui/ingredient-sidebar-header/ingredient-sidebar-header';
import { IngredientSidebarList } from '../../ui/ingredient-sidebar-list/ingredient-sidebar-list';
import { IngredientSidebarLayout } from '../../ui/ingredient-sidebar-layout/ingredient-sidebar-layout';

type IngredientSidebarProps = {
  sections: RecipeIngredientSection[];
  output: RecipeOutput;
};

export const IngredientSidebar = ({
  sections,
  output,
}: IngredientSidebarProps) => {
  const {
    selectedOutputQuantity,
    setOutputQuantity,
    increaseOutputQuantity,
    decreaseOutputQuantity,
    scaledSections,
  } = useRecipeOutputQuantity(output, sections);

  return (
    <IngredientSidebarLayout
      header={
        <IngredientSidebarHeader
          quantityControl={{
            value: selectedOutputQuantity,
            output,
            onChange: setOutputQuantity,
            onDecrease: decreaseOutputQuantity,
            onIncrease: increaseOutputQuantity,
          }}
        />
      }
      list={<IngredientSidebarList sections={scaledSections} />}
    />
  );
};
