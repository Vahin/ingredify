import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./client/client";

/** Данные стартового рецепта (раньше были в `src/entities/recipe/model/recipe.ts`) */
const CHERRY_COBBLER_SLUG = "cherry-cobbler";

const cherryCobbler = {
  author: "Алена Кравцова",
  authorRole: "автор рецепта",
  title: "Вишневый коблер с миндальной крошкой",
  description:
    "Теплый домашний десерт с сочной вишневой начинкой, нежным миндалем и золотистой хрустящей шапкой. Хорош для воскресного ужина и отлично держит форму после остывания.",
  image: "/recipes/ingredify-cherry-cobbler-hero.png",
  /** КБЖУ в БД; оформление карточек задаётся в коде приложения */
  nutrition: {
    calories: 385,
    protein: 6,
    fat: 15,
    carbs: 59,
  },
  ingredients: [
    { name: "Вишня без косточек", amount: "500 г", checked: true },
    { name: "Сахар", amount: "120 г", checked: false },
    { name: "Пшеничная мука", amount: "145 г", checked: false },
    { name: "Миндальная крошка", amount: "35 г", checked: false },
    { name: "Сливочное масло", amount: "85 г", checked: false },
    { name: "Молоко", amount: "120 мл", checked: false },
    { name: "Разрыхлитель", amount: "1 ч. л.", checked: false },
  ],
  equipment: [
    "Форма для запекания 22–24 см",
    "Миска для теста",
    "Силиконовая лопатка",
    "Духовка",
  ],
  steps: [
    {
      text: "Смешайте вишню с сахаром, лимонным соком и крахмалом. Переложите начинку в форму и распределите ровным слоем.",
      image: "/recipes/step-01-prepared-ingredients.png",
    },
    {
      text: "В отдельной миске соедините муку, миндальную крошку, разрыхлитель, соль и сахар. Добавьте холодное масло и разотрите в крупную крошку.",
    },
    {
      text: "Влейте молоко и быстро замесите мягкое тесто. Выложите его ложками поверх начинки, оставляя небольшие просветы.",
      image: "/recipes/step-03-milk-into-flour.png",
    },
    {
      text: "Выпекайте при 190 °C 35–40 минут, пока начинка не начнет пузыриться, а верх не станет золотистым. Дайте коблеру постоять 10 минут.",
    },
  ],
  comments: [
    {
      initials: "АК",
      name: "Алена Кравцова",
      label: "автор рецепта",
      text: "Для более насыщенного вкуса можно смешать свежую и замороженную вишню. Если начинка получилась очень сочной, добавьте еще половину ложки крахмала.",
    },
    {
      initials: "МС",
      name: "Марина Соколова",
      text: "Готовила вчера к чаю, получилось очень нежно. Миндальная крошка правда дает приятную текстуру, а не просто сладкую корочку.",
    },
    {
      initials: "ИВ",
      name: "Илья Воронов",
      text: "Уменьшил сахар до 90 г и добавил немного корицы в тесто. Вишня осталась яркой, десерт не стал приторным.",
    },
    {
      initials: "НР",
      name: "Надя Романова",
      text: "Спасибо за точные пропорции. После 10 минут отдыха начинка загустела как надо, коблер легко раскладывается ложкой.",
    },
  ],
} as const;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL не задан");
  }

  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });

  try {
    // Идемпотентно: пересоздаём рецепт по slug (каскад удалит дочерние строки)
    const existing = await prisma.recipe.findUnique({
      where: { slug: CHERRY_COBBLER_SLUG },
    });
    if (existing) {
      await prisma.recipe.delete({ where: { id: existing.id } });
    }

    await prisma.recipe.create({
      data: {
        slug: CHERRY_COBBLER_SLUG,
        author: cherryCobbler.author,
        authorRole: cherryCobbler.authorRole,
        title: cherryCobbler.title,
        description: cherryCobbler.description,
        image: cherryCobbler.image,
        nutrition: {
          create: cherryCobbler.nutrition,
        },
        ingredients: {
          create: cherryCobbler.ingredients.map((ing, i) => ({
            order: i,
            name: ing.name,
            amount: ing.amount,
            checked: ing.checked,
          })),
        },
        equipment: {
          create: cherryCobbler.equipment.map((label, i) => ({
            order: i,
            label,
          })),
        },
        steps: {
          create: cherryCobbler.steps.map((step, i) => ({
            order: i,
            text: step.text,
            image: "image" in step ? step.image ?? null : null,
          })),
        },
        comments: {
          create: cherryCobbler.comments.map((c, i) => ({
            order: i,
            initials: c.initials,
            name: c.name,
            text: c.text,
            label: "label" in c ? c.label : undefined,
          })),
        },
      },
    });

    console.log(`Seed: рецепт «${CHERRY_COBBLER_SLUG}» создан.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
