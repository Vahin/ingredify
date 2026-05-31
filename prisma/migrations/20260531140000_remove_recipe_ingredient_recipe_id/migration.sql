-- Убираем прямую связь RecipeIngredient -> Recipe
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_recipe_id_fkey";
DROP INDEX "RecipeIngredient_recipe_id_idx";
ALTER TABLE "RecipeIngredient" DROP COLUMN "recipe_id";

-- Строки удаляются вместе с группой (цепочка Recipe -> Group -> Ingredient line)
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_group_id_fkey";
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_group_id_fkey"
  FOREIGN KEY ("group_id") REFERENCES "RecipeIngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
