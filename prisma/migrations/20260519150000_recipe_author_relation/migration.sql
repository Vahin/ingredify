-- Удаляем дублирующие строковые поля автора
ALTER TABLE "Recipe" DROP COLUMN "author";
ALTER TABLE "Recipe" DROP COLUMN "author_role";

-- Переименовываем внешний ключ владельца в author_id
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_user_id_fkey";
DROP INDEX "Recipe_user_id_idx";
ALTER TABLE "Recipe" RENAME COLUMN "user_id" TO "author_id";
CREATE INDEX "Recipe_author_id_idx" ON "Recipe"("author_id");
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
