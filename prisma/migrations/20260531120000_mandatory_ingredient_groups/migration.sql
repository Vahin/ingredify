-- Добавляем выход группы (сначала nullable для backfill)
ALTER TABLE "RecipeIngredientGroup" ADD COLUMN IF NOT EXISTS "output_quantity" DECIMAL(10, 2);
ALTER TABLE "RecipeIngredientGroup" ADD COLUMN IF NOT EXISTS "output_unit_id" TEXT;

-- Неименованные группы
ALTER TABLE "RecipeIngredientGroup" ALTER COLUMN "label" DROP NOT NULL;

-- Копируем выход из рецепта в существующие группы
UPDATE "RecipeIngredientGroup" AS g
SET
  "output_quantity" = r."output_quantity",
  "output_unit_id" = r."output_unit_id"
FROM "Recipe" AS r
WHERE g."recipe_id" = r."id";

-- Для рецептов с ингредиентами без групп создаём одну неименованную группу
INSERT INTO "RecipeIngredientGroup" (
  "id",
  "recipe_id",
  "order",
  "label",
  "output_quantity",
  "output_unit_id",
  "created_at",
  "updated_at"
)
SELECT
  'cm' || substr(md5(random()::text || r."id" || clock_timestamp()::text), 1, 23),
  r."id",
  0,
  NULL,
  r."output_quantity",
  r."output_unit_id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Recipe" AS r
WHERE EXISTS (
  SELECT 1 FROM "RecipeIngredient" AS ri WHERE ri."recipe_id" = r."id"
)
AND NOT EXISTS (
  SELECT 1 FROM "RecipeIngredientGroup" AS g WHERE g."recipe_id" = r."id"
);

-- Привязываем ингредиенты без группы к первой группе рецепта
UPDATE "RecipeIngredient" AS ri
SET "group_id" = (
  SELECT g."id"
  FROM "RecipeIngredientGroup" AS g
  WHERE g."recipe_id" = ri."recipe_id"
  ORDER BY g."order" ASC
  LIMIT 1
)
WHERE ri."group_id" IS NULL;

-- Обязательный выход группы
ALTER TABLE "RecipeIngredientGroup" ALTER COLUMN "output_quantity" SET NOT NULL;
ALTER TABLE "RecipeIngredientGroup" ALTER COLUMN "output_unit_id" SET NOT NULL;

-- Обязательная группа у ингредиента
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_group_id_fkey";
ALTER TABLE "RecipeIngredient" ALTER COLUMN "group_id" SET NOT NULL;
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_group_id_fkey"
  FOREIGN KEY ("group_id") REFERENCES "RecipeIngredientGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Связь группы с единицей выхода
CREATE INDEX "RecipeIngredientGroup_output_unit_id_idx" ON "RecipeIngredientGroup"("output_unit_id");
ALTER TABLE "RecipeIngredientGroup" ADD CONSTRAINT "RecipeIngredientGroup_output_unit_id_fkey"
  FOREIGN KEY ("output_unit_id") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
