-- Таблица КБЖУ вместо универсальных RecipeStat; UI остаётся в приложении
CREATE TABLE "RecipeNutrition" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" DECIMAL(6,2) NOT NULL,
    "fat" DECIMAL(6,2) NOT NULL,
    "carbs" DECIMAL(6,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeNutrition_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RecipeNutrition_recipe_id_key" ON "RecipeNutrition"("recipe_id");

ALTER TABLE "RecipeNutrition" ADD CONSTRAINT "RecipeNutrition_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Перенос из старых строк по подписи (как в сиде)
INSERT INTO "RecipeNutrition" ("id", "recipe_id", "calories", "protein", "fat", "carbs", "created_at", "updated_at")
SELECT
    replace(gen_random_uuid()::text, '-', ''),
    s."recipe_id",
    COALESCE(MAX(CASE WHEN s."label" = 'Калории' THEN NULLIF(regexp_replace(s."value", '[^0-9]', '', 'g'), '')::integer END), 0),
    COALESCE(MAX(CASE WHEN s."label" = 'Белки' THEN NULLIF(regexp_replace(s."value", '[^0-9.]', '', 'g'), '')::numeric END), 0),
    COALESCE(MAX(CASE WHEN s."label" = 'Жиры' THEN NULLIF(regexp_replace(s."value", '[^0-9.]', '', 'g'), '')::numeric END), 0),
    COALESCE(MAX(CASE WHEN s."label" = 'Углеводы' THEN NULLIF(regexp_replace(s."value", '[^0-9.]', '', 'g'), '')::numeric END), 0),
    MIN(s."created_at"),
    MAX(s."updated_at")
FROM "RecipeStat" s
GROUP BY s."recipe_id";

DROP TABLE "RecipeStat";
