import { useCallback, useMemo, useState } from 'react';
import type { RecipeIngredientSection } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import {
  clampOutputQuantity,
  getInitialSelectedOutputQuantity,
} from './output-quantity';
import { scaleIngredientSections } from './scale-ingredient-sections';

export function useRecipeOutputQuantity(
  output: RecipeOutput,
  sections: RecipeIngredientSection[],
) {
  const [selectedOutputQuantity, setSelectedOutputQuantity] = useState(
    () => getInitialSelectedOutputQuantity(output),
  );

  const setOutputQuantity = useCallback(
    (next: number) => {
      setSelectedOutputQuantity(clampOutputQuantity(next, output));
    },
    [output],
  );

  const increaseOutputQuantity = useCallback(() => {
    setSelectedOutputQuantity((current) =>
      clampOutputQuantity(current + 1, output),
    );
  }, [output]);

  const decreaseOutputQuantity = useCallback(() => {
    setSelectedOutputQuantity((current) =>
      clampOutputQuantity(current - 1, output),
    );
  }, [output]);

  const scaledSections = useMemo(
    () => scaleIngredientSections(sections, selectedOutputQuantity),
    [sections, selectedOutputQuantity],
  );

  return {
    selectedOutputQuantity,
    setOutputQuantity,
    increaseOutputQuantity,
    decreaseOutputQuantity,
    scaledSections,
  };
}
