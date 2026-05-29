-- DropIndex
DROP INDEX IF EXISTS "Recipe_slug_idx";

-- DropIndex
DROP INDEX IF EXISTS "Recipe_slug_key";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN IF EXISTS "slug";

-- DropIndex
DROP INDEX IF EXISTS "Ingredient_slug_key";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN IF EXISTS "slug";

-- Объединение дубликатов по name перед уникальным индексом
DROP TABLE IF EXISTS "_ingredient_canonical";

CREATE TABLE "_ingredient_canonical" AS
SELECT DISTINCT ON ("name") "id" AS keep_id, "name"
FROM "Ingredient"
ORDER BY "name", ("recipe_id" IS NOT NULL) DESC, "id" ASC;

UPDATE "RecipeIngredient" ri
SET "ingredient_id" = ic.keep_id
FROM "Ingredient" i
INNER JOIN "_ingredient_canonical" ic ON i."name" = ic."name"
WHERE ri."ingredient_id" = i."id" AND i."id" <> ic.keep_id;

UPDATE "Ingredient" keeper
SET "recipe_id" = d."recipe_id"
FROM "Ingredient" d
INNER JOIN "_ingredient_canonical" ic ON d."name" = ic."name"
WHERE keeper."id" = ic.keep_id
  AND d."id" <> ic.keep_id
  AND keeper."recipe_id" IS NULL
  AND d."recipe_id" IS NOT NULL;

DELETE FROM "Ingredient" i
USING "_ingredient_canonical" ic
WHERE i."name" = ic."name" AND i."id" <> ic.keep_id;

DROP TABLE "_ingredient_canonical";

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");
