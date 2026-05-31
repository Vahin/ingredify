-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "source_recipe_id" TEXT,
    "recipe_ingredient_id" TEXT,
    "name" TEXT NOT NULL,
    "sticker" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_id" TEXT NOT NULL,
    "is_sub_recipe" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartRecipeSync" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "synced_output_quantity" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartRecipeSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartRecipeLineSync" (
    "id" TEXT NOT NULL,
    "sync_id" TEXT NOT NULL,
    "recipe_ingredient_id" TEXT NOT NULL,
    "synced_quantity" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartRecipeLineSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");

-- CreateIndex
CREATE INDEX "Cart_user_id_idx" ON "Cart"("user_id");

-- CreateIndex
CREATE INDEX "CartItem_cart_id_idx" ON "CartItem"("cart_id");

-- CreateIndex
CREATE INDEX "CartItem_unit_id_idx" ON "CartItem"("unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cart_id_source_recipe_id_recipe_ingredient_id_key" ON "CartItem"("cart_id", "source_recipe_id", "recipe_ingredient_id");

-- CreateIndex
CREATE INDEX "CartRecipeSync_cart_id_idx" ON "CartRecipeSync"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartRecipeSync_cart_id_recipe_id_key" ON "CartRecipeSync"("cart_id", "recipe_id");

-- CreateIndex
CREATE INDEX "CartRecipeLineSync_sync_id_idx" ON "CartRecipeLineSync"("sync_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartRecipeLineSync_sync_id_recipe_ingredient_id_key" ON "CartRecipeLineSync"("sync_id", "recipe_ingredient_id");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartRecipeSync" ADD CONSTRAINT "CartRecipeSync_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartRecipeLineSync" ADD CONSTRAINT "CartRecipeLineSync_sync_id_fkey" FOREIGN KEY ("sync_id") REFERENCES "CartRecipeSync"("id") ON DELETE CASCADE ON UPDATE CASCADE;
