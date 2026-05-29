-- Удаление статуса «отмечен» у строк ингредиентов рецепта
ALTER TABLE "RecipeIngredient" DROP COLUMN "checked";
