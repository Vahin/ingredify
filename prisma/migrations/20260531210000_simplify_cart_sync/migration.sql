-- Drop per-line sync table
DROP TABLE IF EXISTS "CartRecipeLineSync";

-- Add recipe title for cart grouping
ALTER TABLE "CartRecipeSync" ADD COLUMN "recipe_title" TEXT;
