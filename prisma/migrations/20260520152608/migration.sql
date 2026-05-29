-- RenameForeignKey
ALTER TABLE "RecipeComment" RENAME CONSTRAINT "RecipeComment_recipeId_fkey" TO "RecipeComment_recipe_id_fkey";

-- RenameForeignKey
ALTER TABLE "RecipeEquipment" RENAME CONSTRAINT "RecipeEquipment_recipeId_fkey" TO "RecipeEquipment_recipe_id_fkey";

-- RenameForeignKey
ALTER TABLE "RecipeIngredient" RENAME CONSTRAINT "RecipeIngredient_recipeId_fkey" TO "RecipeIngredient_recipe_id_fkey";

-- RenameForeignKey
ALTER TABLE "RecipeStep" RENAME CONSTRAINT "RecipeStep_recipeId_fkey" TO "RecipeStep_recipe_id_fkey";

-- RenameIndex
ALTER INDEX "RecipeComment_recipeId_idx" RENAME TO "RecipeComment_recipe_id_idx";

-- RenameIndex
ALTER INDEX "RecipeEquipment_recipeId_idx" RENAME TO "RecipeEquipment_recipe_id_idx";

-- RenameIndex
ALTER INDEX "RecipeIngredient_recipeId_idx" RENAME TO "RecipeIngredient_recipe_id_idx";

-- RenameIndex
ALTER INDEX "RecipeStep_recipeId_idx" RENAME TO "RecipeStep_recipe_id_idx";
