-- Переименование колонок под @map (snake_case) без потери данных
ALTER TABLE "Recipe" RENAME COLUMN "authorRole" TO "author_role";
ALTER TABLE "Recipe" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Recipe" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "RecipeStat" RENAME COLUMN "recipeId" TO "recipe_id";
ALTER TABLE "RecipeStat" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "RecipeStat" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "RecipeIngredient" RENAME COLUMN "recipeId" TO "recipe_id";
ALTER TABLE "RecipeIngredient" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "RecipeIngredient" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "RecipeEquipment" RENAME COLUMN "recipeId" TO "recipe_id";
ALTER TABLE "RecipeEquipment" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "RecipeEquipment" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "RecipeStep" RENAME COLUMN "recipeId" TO "recipe_id";
ALTER TABLE "RecipeStep" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "RecipeStep" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "RecipeComment" RENAME COLUMN "recipeId" TO "recipe_id";
ALTER TABLE "RecipeComment" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "RecipeComment" RENAME COLUMN "updatedAt" TO "updated_at";
