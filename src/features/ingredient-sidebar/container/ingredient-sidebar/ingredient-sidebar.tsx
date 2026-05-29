import type { RecipeIngredientSection, RecipeOutput } from '@/entities/recipe';
import { IngredientSidebarInteractive } from './ingredient-sidebar-interactive';

export const IngredientSidebar = ({
  sections,
  output,
}: {
  sections: RecipeIngredientSection[];
  output: RecipeOutput;
}) => {
  return (
    <IngredientSidebarInteractive sections={sections} output={output} />
  );
};
