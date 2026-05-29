-- Единица «порция» для выхода обычных рецептов
INSERT INTO "MeasurementUnit" ("id", "name", "short_name", "created_at", "updated_at")
SELECT replace(gen_random_uuid()::text, '-', ''), 'Порция', 'порц.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "MeasurementUnit" WHERE "short_name" = 'порц.'
);

ALTER TABLE "Recipe" ADD COLUMN "output_quantity" DECIMAL(10, 2);
ALTER TABLE "Recipe" ADD COLUMN "output_unit_id" TEXT;

-- Рецепты-заготовки (есть связанный Ingredient): выход в граммах
UPDATE "Recipe" r
SET
    "output_quantity" = 85,
    "output_unit_id" = (SELECT "id" FROM "MeasurementUnit" WHERE "short_name" = 'г' LIMIT 1)
WHERE EXISTS (
    SELECT 1 FROM "Ingredient" i WHERE i."recipe_id" = r."id"
);

-- Остальные рецепты: выход в порциях
UPDATE "Recipe" r
SET
    "output_quantity" = 6,
    "output_unit_id" = (SELECT "id" FROM "MeasurementUnit" WHERE "short_name" = 'порц.' LIMIT 1)
WHERE "output_quantity" IS NULL;

ALTER TABLE "Recipe" ALTER COLUMN "output_quantity" SET NOT NULL;
ALTER TABLE "Recipe" ALTER COLUMN "output_unit_id" SET NOT NULL;

CREATE INDEX "Recipe_output_unit_id_idx" ON "Recipe"("output_unit_id");

ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_output_unit_id_fkey" FOREIGN KEY ("output_unit_id") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
