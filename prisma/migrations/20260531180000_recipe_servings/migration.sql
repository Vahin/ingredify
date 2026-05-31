-- Опциональное количество порций на рецепте
ALTER TABLE "Recipe" ADD COLUMN "servings" INTEGER;

-- Рецепты с выходом в порциях: перенос в servings, физический выход — placeholder (seed уточнит)
UPDATE "Recipe" r
SET
    "servings" = r."output_quantity"::integer,
    "output_quantity" = 1000,
    "output_unit_id" = (SELECT "id" FROM "MeasurementUnit" WHERE "short_name" = 'г' LIMIT 1)
FROM "MeasurementUnit" mu
WHERE r."output_unit_id" = mu."id"
  AND mu."short_name" = 'порц.';

-- Группы ингредиентов: только физический выход
UPDATE "RecipeIngredientGroup" rig
SET
    "output_quantity" = 1000,
    "output_unit_id" = (SELECT "id" FROM "MeasurementUnit" WHERE "short_name" = 'г' LIMIT 1)
FROM "MeasurementUnit" mu
WHERE rig."output_unit_id" = mu."id"
  AND mu."short_name" = 'порц.';

ALTER TABLE "MeasurementUnit" DROP COLUMN "scalable_as_portion";
