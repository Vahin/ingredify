-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Демо-пользователь для существующих рецептов (пароль: password123)
INSERT INTO "User" ("id", "email", "password_hash", "name", "created_at", "updated_at")
VALUES (
    'demo_user_ingredify',
    'demo@ingredify.local',
    '$2b$12$K1mY9Ay5zzGzmkxyBhxwL.dg8fVST72ZPNjGciQecNvh.j4pa.gZq',
    'Алена Кравцова',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- AlterTable: сначала nullable, затем заполняем и делаем NOT NULL
ALTER TABLE "Recipe" ADD COLUMN "user_id" TEXT;

UPDATE "Recipe" SET "user_id" = 'demo_user_ingredify' WHERE "user_id" IS NULL;

ALTER TABLE "Recipe" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Recipe_user_id_idx" ON "Recipe"("user_id");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
