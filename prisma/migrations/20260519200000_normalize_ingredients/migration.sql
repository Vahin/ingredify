-- Справочник единиц измерения
CREATE TABLE "MeasurementUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementUnit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MeasurementUnit_short_name_key" ON "MeasurementUnit"("short_name");

INSERT INTO "MeasurementUnit" ("id", "name", "short_name", "created_at", "updated_at")
VALUES
    (replace(gen_random_uuid()::text, '-', ''), 'Грамм', 'г', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (replace(gen_random_uuid()::text, '-', ''), 'Килограмм', 'кг', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (replace(gen_random_uuid()::text, '-', ''), 'Миллилитр', 'мл', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (replace(gen_random_uuid()::text, '-', ''), 'Литр', 'л', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (replace(gen_random_uuid()::text, '-', ''), 'Штука', 'шт', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (replace(gen_random_uuid()::text, '-', ''), 'Чайная ложка', 'ч. л.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (replace(gen_random_uuid()::text, '-', ''), 'Столовая ложка', 'ст. л.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (replace(gen_random_uuid()::text, '-', ''), 'Щепотка', 'щепотка', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Справочник ингредиентов
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "recipe_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Ingredient_slug_key" ON "Ingredient"("slug");
CREATE UNIQUE INDEX "Ingredient_recipe_id_key" ON "Ingredient"("recipe_id");
CREATE INDEX "Ingredient_recipe_id_idx" ON "Ingredient"("recipe_id");

ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Новые поля в строках ингредиентов рецепта
ALTER TABLE "RecipeIngredient" ADD COLUMN "ingredient_id" TEXT;
ALTER TABLE "RecipeIngredient" ADD COLUMN "unit_id" TEXT;
ALTER TABLE "RecipeIngredient" ADD COLUMN "quantity" DECIMAL(10,2);

-- Каталог из уникальных имён
INSERT INTO "Ingredient" ("id", "name", "slug", "created_at", "updated_at")
SELECT
    replace(gen_random_uuid()::text, '-', ''),
    n."name",
    lower(regexp_replace(trim(n."name"), '\s+', '-', 'g')),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT trim("name") AS "name"
    FROM "RecipeIngredient"
) n;

-- Связь строк с каталогом
UPDATE "RecipeIngredient" ri
SET "ingredient_id" = i."id"
FROM "Ingredient" i
WHERE trim(ri."name") = i."name";

-- Количество и единица из текстового amount (формат «число единица»)
UPDATE "RecipeIngredient" ri
SET
    "quantity" = (regexp_match(trim(ri."amount"), '^([\d.,]+)\s+(.+)$'))[1]::decimal,
    "unit_id" = mu."id"
FROM "MeasurementUnit" mu
WHERE (regexp_match(trim(ri."amount"), '^([\d.,]+)\s+(.+)$'))[2] = mu."short_name";

-- Неподдержанный формат amount — ошибка миграции
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "RecipeIngredient"
        WHERE "ingredient_id" IS NULL
           OR "unit_id" IS NULL
           OR "quantity" IS NULL
    ) THEN
        RAISE EXCEPTION 'Не удалось распарсить amount или сопоставить ингредиент для всех строк RecipeIngredient';
    END IF;
END $$;

ALTER TABLE "RecipeIngredient" ALTER COLUMN "ingredient_id" SET NOT NULL;
ALTER TABLE "RecipeIngredient" ALTER COLUMN "unit_id" SET NOT NULL;
ALTER TABLE "RecipeIngredient" ALTER COLUMN "quantity" SET NOT NULL;

ALTER TABLE "RecipeIngredient" DROP COLUMN "name";
ALTER TABLE "RecipeIngredient" DROP COLUMN "amount";

CREATE INDEX "RecipeIngredient_ingredient_id_idx" ON "RecipeIngredient"("ingredient_id");
CREATE INDEX "RecipeIngredient_unit_id_idx" ON "RecipeIngredient"("unit_id");

ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
