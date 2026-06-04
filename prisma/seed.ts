import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "./client/client";
import { MEASUREMENT_UNITS } from "../src/entities/recipe/model/constants/measurement-units";
import type { RecipePhysicalOutputUnitShortName } from "../src/entities/recipe/model/constants/measurement-units";

const DEMO_USER_ID = "demo_user_ingredify";
const DEMO_USER_EMAIL = "test@test.ru";

/** Данные стартового рецепта */
const DEMO_AUTHOR_NAME = "Светка Тенькова";

type SeedIngredient = {
  name: string;
  sticker: string;
  quantity: number;
  unitShortName: (typeof MEASUREMENT_UNITS)[number]["shortName"];
};

type SeedGroupedIngredient = SeedIngredient & {
  groupLabel: "Паста" | "Соус";
};

type SeedRecipeOutput = {
  quantity: number;
  unitShortName: RecipePhysicalOutputUnitShortName;
  servings?: number;
};

/** Описание группы ингредиентов в seed-данных; null — без названия в UI */
type SeedIngredientGroupDef = {
  label: string | null;
};

/** Поля выхода рецепта для Prisma create */
function recipeOutputFields(
  output: SeedRecipeOutput,
  units: Map<string, string>,
) {
  return {
    outputQuantity: output.quantity,
    outputUnitId: units.get(output.unitShortName)!,
    servings: output.servings ?? null,
  };
}

/** Группы ингредиентов с базовым выходом, скопированным из рецепта */
function buildIngredientGroupCreates(
  output: SeedRecipeOutput,
  groups: readonly SeedIngredientGroupDef[],
  units: Map<string, string>,
) {
  return groups.map((group, order) => ({
    order,
    label: group.label,
    outputQuantity: output.quantity,
    outputUnitId: units.get(output.unitShortName)!,
  }));
}

const cherryCobblerIngredients: SeedIngredient[] = [
  {
    name: "Вишня без косточек",
    sticker: "/ingredients/cherry.png",
    quantity: 500,
    unitShortName: "г",
  },
  {
    name: "Сахар",
    sticker: "/ingredients/sugar.png",
    quantity: 120,
    unitShortName: "г",
  },
  {
    name: "Пшеничная мука",
    sticker: "/ingredients/flour.png",
    quantity: 145,
    unitShortName: "г",
  },
  {
    name: "Миндальная крошка",
    sticker: "/ingredients/almond-crumb.png",
    quantity: 35,
    unitShortName: "г",
  },
  {
    name: "Сливочное масло",
    sticker: "/ingredients/butter.png",
    quantity: 85,
    unitShortName: "г",
  },
  {
    name: "Молоко",
    sticker: "/ingredients/milk.png",
    quantity: 120,
    unitShortName: "мл",
  },
  {
    name: "Разрыхлитель",
    sticker: "/ingredients/baking-powder.png",
    quantity: 1,
    unitShortName: "ч.л.",
  },
];

/** Базовые продукты для подрецепта масла (не составные) */
const brownButterIngredients: SeedIngredient[] = [
  {
    name: "Несолёное сливочное масло",
    sticker: "/ingredients/unsalted-butter.png",
    quantity: 100,
    unitShortName: "г",
  },
  {
    name: "Сахар",
    sticker: "/ingredients/sugar.png",
    quantity: 5,
    unitShortName: "г",
  },
];

const pastaAlfredoIngredients: SeedIngredient[] = [
  {
    name: "Феттучине",
    sticker: "/ingredients/fettuccine.png",
    quantity: 320,
    unitShortName: "г",
  },
  {
    name: "Сливки 20%",
    sticker: "/ingredients/cream-20.png",
    quantity: 250,
    unitShortName: "мл",
  },
  {
    name: "Пармезан",
    sticker: "/ingredients/parmesan.png",
    quantity: 90,
    unitShortName: "г",
  },
  {
    name: "Сливочное масло 82%",
    sticker: "/ingredients/butter.png",
    quantity: 40,
    unitShortName: "г",
  },
  {
    name: "Чеснок",
    sticker: "/ingredients/garlic.png",
    quantity: 2,
    unitShortName: "шт",
  },
  {
    name: "Чёрный перец",
    sticker: "/ingredients/black-pepper.png",
    quantity: 1,
    unitShortName: "щепотка",
  },
];

const pastaAlfredoHomemadeIngredients: SeedGroupedIngredient[] = [
  {
    name: "Пшеничная мука",
    sticker: "/ingredients/flour.png",
    quantity: 200,
    unitShortName: "г",
    groupLabel: "Паста",
  },
  {
    name: "Яйцо",
    sticker: "/ingredients/egg.png",
    quantity: 2,
    unitShortName: "шт",
    groupLabel: "Паста",
  },
  {
    name: "Соль",
    sticker: "/ingredients/salt.png",
    quantity: 1,
    unitShortName: "щепотка",
    groupLabel: "Паста",
  },
  {
    name: "Оливковое масло",
    sticker: "/ingredients/olive-oil.png",
    quantity: 1,
    unitShortName: "ч.л.",
    groupLabel: "Паста",
  },
  {
    name: "Сливки 20%",
    sticker: "/ingredients/cream-20.png",
    quantity: 250,
    unitShortName: "мл",
    groupLabel: "Соус",
  },
  {
    name: "Пармезан",
    sticker: "/ingredients/parmesan.png",
    quantity: 90,
    unitShortName: "г",
    groupLabel: "Соус",
  },
  {
    name: "Сливочное масло 82%",
    sticker: "/ingredients/butter.png",
    quantity: 40,
    unitShortName: "г",
    groupLabel: "Соус",
  },
  {
    name: "Чеснок",
    sticker: "/ingredients/garlic.png",
    quantity: 2,
    unitShortName: "шт",
    groupLabel: "Соус",
  },
  {
    name: "Чёрный перец",
    sticker: "/ingredients/black-pepper.png",
    quantity: 1,
    unitShortName: "щепотка",
    groupLabel: "Соус",
  },
];

const cherryCobbler = {
  title: "Вишневый коблер с миндальной крошкой",
  output: { quantity: 1800, unitShortName: "г" as const, servings: 6 },
  description:
    "Теплый домашний десерт с сочной вишневой начинкой, нежным миндалем и золотистой хрустящей шапкой. Хорош для воскресного ужина и отлично держит форму после остывания.",
  image: "/recipes/ingredify-cherry-cobbler-hero.png",
  nutrition: {
    calories: 385,
    protein: 6,
    fat: 15,
    carbs: 59,
  },
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
      text: "В отдельной миске соедините муку, миндальную крошку, разрыхлитель, соль и сахар. Добавьте сливочное масло (можно заранее приготовить коричневое по ссылке в ингредиентах) и разотрите в крупную крошку.",
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
  ingredientGroups: [{ label: null }],
} as const;

const brownButter = {
  title: "Коричневое сливочное масло",
  output: { quantity: 85, unitShortName: "г" as const },
  description:
    "Ароматное топлёное масло с ореховыми нотами. Используется в коблере вместо обычного холодного масла — даёт более выразительный вкус крошки.",
  image: "/recipes/ingredify-cherry-cobbler-hero.png",
  nutrition: {
    calories: 720,
    protein: 1,
    fat: 80,
    carbs: 1,
  },
  equipment: ["Сотейник с толстым дном", "Миска со льдом"],
  steps: [
    {
      text: "Нарежьте масло кубиками и растопите на среднем огне, помешивая. Когда пена осядёт, продолжайте готовить до золотистого цвета и орехового аромата, 4–6 минут.",
    },
    {
      text: "Снимите с огня и перелейте в холодную миску, чтобы остановить приготовление. Остудите до комнатной температуры перед использованием в тесте.",
    },
  ],
  comments: [
    {
      initials: "АК",
      name: "Алена Кравцова",
      text: "Не пережарьте: масло должно пахнуть фундуком, а не горечью. Из 100 г получается около 85 г готового продукта.",
    },
  ],
  ingredientGroups: [{ label: null }],
} as const;

const pastaAlfredo = {
  title: "Паста Альфредо с пармезаном",
  output: { quantity: 1200, unitShortName: "г" as const, servings: 4 },
  description:
    "Кремовая паста с бархатным сливочным соусом, пармезаном и лёгким чесночным ароматом. Готовится быстро, а соус получается гладким за счёт крахмалистой воды от пасты.",
  image: "/recipes/pasta-alfredo-hero.png",
  nutrition: {
    calories: 540,
    protein: 18,
    fat: 28,
    carbs: 54,
  },
  equipment: [
    "Большая кастрюля",
    "Сковорода с толстым дном",
    "Тёрка для сыра",
    "Щипцы для пасты",
  ],
  steps: [
    {
      text: "Отварите феттучине в хорошо подсоленной воде до состояния al dente. Сохраните около стакана воды от пасты перед сливом.",
    },
    {
      text: "Растопите сливочное масло на среднем огне, добавьте раздавленный чеснок и прогрейте 30–40 секунд, не давая ему потемнеть.",
    },
    {
      text: "Влейте сливки, добавьте половину пармезана и немного воды от пасты. Перемешивайте, пока соус не станет однородным.",
    },
    {
      text: "Добавьте пасту в сковороду, всыпьте оставшийся пармезан и чёрный перец. Активно перемешайте, подливая воду от пасты до нужной кремовой текстуры.",
    },
  ],
  comments: [
    {
      initials: "АК",
      name: "Алена Кравцова",
      label: "автор рецепта",
      text: "Не кипятите соус после добавления сыра: так пармезан плавится мягко и не собирается в комки.",
    },
    {
      initials: "ДС",
      name: "Дмитрий Сазонов",
      text: "Получилось очень сливочно. В конце добавил ещё немного перца и пару ложек воды от пасты — соус отлично обволакивает феттучине.",
    },
  ],
  ingredientGroups: [{ label: null }],
} as const;

const pastaAlfredoHomemade = {
  title: "Паста Альфредо с домашней феттучине",
  output: { quantity: 1200, unitShortName: "г" as const, servings: 4 },
  description:
    "Домашняя феттучине и сливочный соус Альфредо в одном рецепте. Ингредиенты разделены по этапам, чтобы удобно готовить тесто и соус отдельно.",
  image: "/recipes/pasta-alfredo-hero.png",
  nutrition: {
    calories: 565,
    protein: 20,
    fat: 29,
    carbs: 56,
  },
  equipment: [
    "Большая миска",
    "Скалка или паста-машина",
    "Большая кастрюля",
    "Сковорода с толстым дном",
  ],
  steps: [
    {
      text: "Смешайте муку, яйца, соль и оливковое масло, замесите плотное тесто и дайте ему отдохнуть 20 минут.",
    },
    {
      text: "Раскатайте тесто и нарежьте феттучине. Отварите пасту до al dente, сохранив часть воды.",
    },
    {
      text: "Для соуса растопите сливочное масло, прогрейте чеснок, влейте сливки и вмешайте пармезан до однородности.",
    },
    {
      text: "Соедините пасту с соусом, добавьте чёрный перец и при необходимости доведите текстуру водой от пасты.",
    },
  ],
  comments: [
    {
      initials: "АК",
      name: "Алена Кравцова",
      label: "автор рецепта",
      text: "Если тесто кажется сухим, добавьте чайную ложку воды. Готовые полоски феттучине слегка подпылите мукой.",
    },
  ],
  ingredientGroups: [{ label: "Паста" }, { label: "Соус" }],
} as const;

async function upsertUnits(prisma: PrismaClient) {
  const units = new Map<string, string>();

  for (const unit of MEASUREMENT_UNITS) {
    const row = await prisma.measurementUnit.upsert({
      where: { shortName: unit.shortName },
      update: {
        name: unit.name,
        kind: unit.kind,
        roundToInteger: unit.roundToInteger,
      },
      create: {
        shortName: unit.shortName,
        name: unit.name,
        kind: unit.kind,
        roundToInteger: unit.roundToInteger,
      },
    });
    units.set(unit.shortName, row.id);
  }

  return units;
}

async function upsertIngredient(
  prisma: PrismaClient,
  data: SeedIngredient,
  recipeId?: string,
) {
  return prisma.ingredient.upsert({
    where: { name: data.name },
    update: {
      sticker: data.sticker,
      ...(recipeId ? { recipeId } : { recipeId: null }),
    },
    create: {
      name: data.name,
      sticker: data.sticker,
      ...(recipeId ? { recipeId } : {}),
    },
  });
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL не задан");
  }

  const demoPassword = process.env.SEED_DEMO_PASSWORD ?? "password123";
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {
        name: DEMO_AUTHOR_NAME,
        email: DEMO_USER_EMAIL,
        passwordHash,
      },
      create: {
        id: DEMO_USER_ID,
        email: DEMO_USER_EMAIL,
        name: DEMO_AUTHOR_NAME,
        passwordHash,
      },
    });

    const units = await upsertUnits(prisma);

    await prisma.recipe.deleteMany({ where: { authorId: DEMO_USER_ID } });

    const butterRecipe = await prisma.recipe.create({
      data: {
        authorId: DEMO_USER_ID,
        title: brownButter.title,
        description: brownButter.description,
        image: brownButter.image,
        ...recipeOutputFields(brownButter.output, units),
        nutrition: { create: brownButter.nutrition },
        ingredientGroups: {
          create: buildIngredientGroupCreates(
            brownButter.output,
            brownButter.ingredientGroups,
            units,
          ),
        },
        equipment: {
          create: brownButter.equipment.map((label, i) => ({
            order: i,
            label,
          })),
        },
        steps: {
          create: brownButter.steps.map((step, i) => ({
            order: i,
            text: step.text,
          })),
        },
        comments: {
          create: brownButter.comments.map((c, i) => ({
            order: i,
            initials: c.initials,
            name: c.name,
            text: c.text,
          })),
        },
      },
      include: {
        ingredientGroups: true,
      },
    });

    const butterGroupId = butterRecipe.ingredientGroups[0]!.id;

    const butterBaseCatalog = await Promise.all(
      brownButterIngredients.map((ing) => upsertIngredient(prisma, ing)),
    );

    await prisma.recipeIngredient.createMany({
      data: brownButterIngredients.map((ing, i) => ({
        groupId: butterGroupId,
        ingredientId: butterBaseCatalog[i]!.id,
        unitId: units.get(ing.unitShortName)!,
        order: i,
        quantity: ing.quantity,
      })),
    });

    const butterIngredient = await upsertIngredient(
      prisma,
      cherryCobblerIngredients.find((i) => i.name === "Сливочное масло")!,
      butterRecipe.id,
    );

    const catalogIngredients = await Promise.all(
      cherryCobblerIngredients.map((ing) =>
        ing.name === "Сливочное масло"
          ? Promise.resolve(butterIngredient)
          : upsertIngredient(prisma, ing),
      ),
    );

    const cobblerRecipe = await prisma.recipe.create({
      data: {
        authorId: DEMO_USER_ID,
        title: cherryCobbler.title,
        description: cherryCobbler.description,
        image: cherryCobbler.image,
        ...recipeOutputFields(cherryCobbler.output, units),
        nutrition: { create: cherryCobbler.nutrition },
        ingredientGroups: {
          create: buildIngredientGroupCreates(
            cherryCobbler.output,
            cherryCobbler.ingredientGroups,
            units,
          ),
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
      include: {
        ingredientGroups: true,
      },
    });

    const cobblerGroupId = cobblerRecipe.ingredientGroups[0]!.id;

    await prisma.recipeIngredient.createMany({
      data: cherryCobblerIngredients.map((ing, i) => ({
        groupId: cobblerGroupId,
        ingredientId: catalogIngredients[i]!.id,
        unitId: units.get(ing.unitShortName)!,
        order: i,
        quantity: ing.quantity,
      })),
    });

    const pastaCatalogIngredients = await Promise.all(
      pastaAlfredoIngredients.map((ing) => upsertIngredient(prisma, ing)),
    );

    const alfredoRecipe = await prisma.recipe.create({
      data: {
        authorId: DEMO_USER_ID,
        title: pastaAlfredo.title,
        description: pastaAlfredo.description,
        image: pastaAlfredo.image,
        ...recipeOutputFields(pastaAlfredo.output, units),
        nutrition: { create: pastaAlfredo.nutrition },
        ingredientGroups: {
          create: buildIngredientGroupCreates(
            pastaAlfredo.output,
            pastaAlfredo.ingredientGroups,
            units,
          ),
        },
        equipment: {
          create: pastaAlfredo.equipment.map((label, i) => ({
            order: i,
            label,
          })),
        },
        steps: {
          create: pastaAlfredo.steps.map((step, i) => ({
            order: i,
            text: step.text,
          })),
        },
        comments: {
          create: pastaAlfredo.comments.map((c, i) => ({
            order: i,
            initials: c.initials,
            name: c.name,
            text: c.text,
            label: "label" in c ? c.label : undefined,
          })),
        },
      },
      include: {
        ingredientGroups: true,
      },
    });

    const alfredoGroupId = alfredoRecipe.ingredientGroups[0]!.id;

    await prisma.recipeIngredient.createMany({
      data: pastaAlfredoIngredients.map((ing, i) => ({
        groupId: alfredoGroupId,
        ingredientId: pastaCatalogIngredients[i]!.id,
        unitId: units.get(ing.unitShortName)!,
        order: i,
        quantity: ing.quantity,
      })),
    });

    const pastaAlfredoHomemadeCatalogIngredients = await Promise.all(
      pastaAlfredoHomemadeIngredients.map((ing) => upsertIngredient(prisma, ing)),
    );

    const homemadeAlfredoRecipe = await prisma.recipe.create({
      data: {
        authorId: DEMO_USER_ID,
        title: pastaAlfredoHomemade.title,
        description: pastaAlfredoHomemade.description,
        image: pastaAlfredoHomemade.image,
        ...recipeOutputFields(pastaAlfredoHomemade.output, units),
        nutrition: { create: pastaAlfredoHomemade.nutrition },
        ingredientGroups: {
          create: buildIngredientGroupCreates(
            pastaAlfredoHomemade.output,
            pastaAlfredoHomemade.ingredientGroups,
            units,
          ),
        },
        equipment: {
          create: pastaAlfredoHomemade.equipment.map((label, i) => ({
            order: i,
            label,
          })),
        },
        steps: {
          create: pastaAlfredoHomemade.steps.map((step, i) => ({
            order: i,
            text: step.text,
          })),
        },
        comments: {
          create: pastaAlfredoHomemade.comments.map((c, i) => ({
            order: i,
            initials: c.initials,
            name: c.name,
            text: c.text,
            label: "label" in c ? c.label : undefined,
          })),
        },
      },
      include: {
        ingredientGroups: true,
      },
    });

    const groupIdByLabel = new Map(
      homemadeAlfredoRecipe.ingredientGroups.map((group) => [group.label, group.id]),
    );

    await prisma.recipeIngredient.createMany({
      data: pastaAlfredoHomemadeIngredients.map((ing, i) => ({
        groupId: groupIdByLabel.get(ing.groupLabel)!,
        ingredientId: pastaAlfredoHomemadeCatalogIngredients[i]!.id,
        unitId: units.get(ing.unitShortName)!,
        order: i,
        quantity: ing.quantity,
      })),
    });

    console.log(
      `Seed: пользователь ${DEMO_USER_EMAIL}, рецепты «${cherryCobbler.title}», «${brownButter.title}», «${pastaAlfredo.title}» и «${pastaAlfredoHomemade.title}» готовы.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
