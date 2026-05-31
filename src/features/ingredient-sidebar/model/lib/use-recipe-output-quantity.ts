import { useCallback, useMemo, useState } from 'react';
import type { RecipeIngredientGroupView } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import {
  clampOutputQuantity,
  getInitialSelectedOutputQuantity,
} from './output-quantity';
import { scaleIngredientGroups } from './scale-ingredient-groups';

export function useRecipeOutputQuantity(
  output: RecipeOutput,
  groups: RecipeIngredientGroupView[],
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

  const scaledGroups = useMemo(
    () => scaleIngredientGroups(groups, selectedOutputQuantity, output),
    [groups, selectedOutputQuantity, output],
  );

  return {
    selectedOutputQuantity,
    setOutputQuantity,
    increaseOutputQuantity,
    decreaseOutputQuantity,
    scaledGroups,
  };
}
