/**
 * Проверка доступности БД через Prisma (db execute).
 * Подхватывает DATABASE_URL из `.env` в корне проекта.
 */
import { config } from "dotenv";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: join(root, ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "Нет DATABASE_URL. Скопируйте .env.example в .env и задайте строку подключения.",
  );
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["prisma", "db", "execute", "--stdin"],
  {
    cwd: root,
    input: "SELECT 1 AS prisma_ok;",
    stdio: ["pipe", "inherit", "inherit"],
    env: { ...process.env, DATABASE_URL: url },
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("Prisma: запрос к БД выполнен успешно.");
