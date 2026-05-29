'use client';

import { useCallback, useMemo, useState } from 'react';
import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import type { RecipeIngredientSection } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import {
  clampOutputQuantity,
  getBaseOutputQuantity,
  getInitialSelectedOutputQuantity,
  getMaxOutputQuantity,
} from '../../lib/output-quantity';
import { IngredientSidebarHeader } from '../../ui/ingredient-sidebar-header/ingredient-sidebar-header';
import { IngredientSidebarList } from '../../ui/ingredient-sidebar-list/ingredient-sidebar-list';
import { IngredientSidebarLayout } from '../../ui/ingredient-sidebar-layout/ingredient-sidebar-layout';
import type { IngredientSection } from '../../model/types/ingredient-line';

type IngredientSidebarInteractiveProps = {
  sections: RecipeIngredientSection[];
  output: RecipeOutput;
};

export const IngredientSidebarInteractive = ({
  sections,
  output,
}: IngredientSidebarInteractiveProps) => {
  const baseOutputQuantity = getBaseOutputQuantity(output);
  const [selectedOutputQuantity, setSelectedOutputQuantity] = useState(
    getInitialSelectedOutputQuantity(output),
  );

  const setOutputQuantity = useCallback(
    (next: number) => {
      setSelectedOutputQuantity(clampOutputQuantity(next, output));
    },
    [output],
  );

  const scaledSections = useMemo<IngredientSection[]>(() => {
    const factor = selectedOutputQuantity / baseOutputQuantity;

    return sections.map((section) => {
      const lines = section.lines.map((line) => {
        const scaled = line.amountNumeric * factor;

        return {
          ...line,
          amountValue: formatAmountValue(scaled, {
            unitShortName: line.amountUnitLabel,
          }),
        };
      });

      return {
        id: section.id,
        label: section.label,
        lines,
      };
    });
  }, [baseOutputQuantity, sections, selectedOutputQuantity]);

  const maxOutputQuantity = getMaxOutputQuantity(output);

  return (
    <IngredientSidebarLayout
      header={
        <IngredientSidebarHeader
          quantityControl={{
            value: selectedOutputQuantity,
            output,
            onChange: setOutputQuantity,
            onDecrease: () =>
              setOutputQuantity(selectedOutputQuantity - 1),
            onIncrease: () =>
              setOutputQuantity(
                Math.min(maxOutputQuantity, selectedOutputQuantity + 1),
              ),
          }}
        />
      }
      list={<IngredientSidebarList sections={scaledSections} />}
    />
  );
};
