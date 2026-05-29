-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "group_id" TEXT;

-- CreateTable
CREATE TABLE "RecipeIngredientGroup" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeIngredientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeIngredientGroup_recipe_id_idx" ON "RecipeIngredientGroup"("recipe_id");

-- CreateIndex
CREATE INDEX "RecipeIngredient_group_id_idx" ON "RecipeIngredient"("group_id");

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "RecipeIngredientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredientGroup" ADD CONSTRAINT "RecipeIngredientGroup_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
