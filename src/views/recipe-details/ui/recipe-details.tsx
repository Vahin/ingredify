import { Icon } from "@/shared/ui/icon";
import { Header } from "@/widgets/header";
import Image from "next/image";

type RecipeDetailsProps = {
  recipeId: string;
};

const recipe = {
  author: "Алена Кравцова",
  authorRole: "автор рецепта",
  title: "Вишневый коблер с миндальной крошкой",
  description:
    "Теплый домашний десерт с сочной вишневой начинкой, нежным миндалем и золотистой хрустящей шапкой. Хорош для воскресного ужина и отлично держит форму после остывания.",
  image: "/recipes/ingredify-cherry-cobbler-hero.png",
  stats: [
    {
      icon: "/icons/kbju/calories.svg",
      label: "Калории",
      value: "385",
      tone: "text-orange-500",
    },
    {
      icon: "/icons/kbju/protein.svg",
      label: "Белки",
      value: "6 г",
      tone: "text-accent",
    },
    {
      icon: "/icons/kbju/fat.svg",
      label: "Жиры",
      value: "15 г",
      tone: "text-amber-500",
    },
    {
      icon: "/icons/kbju/carbs.svg",
      label: "Углеводы",
      value: "59 г",
      tone: "text-violet-500",
    },
  ],
  ingredients: [
    { name: "Вишня без косточек", amount: "500 г", checked: true },
    { name: "Сахар", amount: "120 г" },
    { name: "Пшеничная мука", amount: "145 г" },
    { name: "Миндальная крошка", amount: "35 г" },
    { name: "Сливочное масло", amount: "85 г" },
    { name: "Молоко", amount: "120 мл" },
    { name: "Разрыхлитель", amount: "1 ч. л." },
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
};

function RecipeHero() {
  return (
    <section
      aria-labelledby="recipe-title"
      className="grid gap-[18px] rounded-2xl border border-border bg-card p-4 shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)] md:grid-cols-[clamp(188px,24%,212px)_1fr] md:items-center md:gap-[22px]"
      data-od-id="recipe-hero"
    >
      <div className="relative mx-auto aspect-[9/18] w-[min(240px,100%)] overflow-hidden rounded-[14px] bg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] md:w-full">
        <Image
          alt="Теплый вишневый коблер в керамической форме"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 768px) 240px, 212px"
          src={recipe.image}
        />
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-5 py-1">
        <div className="flex items-center gap-2.5">
          <div className="grid size-[34px] place-items-center rounded-full bg-accent/15 text-xs font-extrabold text-accent">
            АК
          </div>
          <div>
            <p className="text-[13px] font-extrabold leading-none text-foreground">
              {recipe.author}
            </p>
            <p className="mt-1 text-xs text-secondary">{recipe.authorRole}</p>
          </div>
        </div>

        <div className="grid gap-2.5">
          <h1
            className="text-[clamp(30px,4vw,38px)] font-[850] leading-[1.05] text-foreground"
            id="recipe-title"
          >
            {recipe.title}
          </h1>
          <p className="max-w-[56ch] text-[15px] leading-[1.6] text-secondary">
            {recipe.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 min-[440px]:grid-cols-2 md:grid-cols-4">
          {recipe.stats.map((stat) => (
            <div
              className="grid min-h-16 grid-cols-[34px_1fr] items-center gap-2.5 rounded-xl bg-muted p-3"
              key={stat.label}
            >
              <span
                className={`grid size-[30px] place-items-center rounded-full bg-card ${stat.tone}`}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-4"
                  height={16}
                  src={stat.icon}
                  unoptimized
                  width={16}
                />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[17px] font-[850] leading-none tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] text-secondary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            className="inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-accent px-[17px] text-sm font-bold text-white shadow-[0_8px_18px_color-mix(in_oklch,var(--accent)_22%,transparent)] transition hover:-translate-y-px hover:bg-accent-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent/25 active:translate-y-0"
            type="button"
          >
            <Icon name="bookmark" className="size-[17px]" />
            Сохранить
          </button>
          <button
            className="inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-muted px-[17px] text-sm font-bold text-foreground transition hover:-translate-y-px hover:bg-border/70 active:translate-y-0"
            type="button"
          >
            <Icon name="message" className="size-[17px] text-secondary" />
            12
          </button>
          <button
            aria-pressed="false"
            className="inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-red-50 px-[17px] text-sm font-bold text-red-500 transition hover:-translate-y-px active:translate-y-0"
            type="button"
          >
            <Icon name="heart" className="size-[17px]" />
            124
          </button>
        </div>
      </div>
    </section>
  );
}

function IngredientsCard() {
  return (
    <section
      aria-labelledby="ingredients-title"
      className="rounded-2xl border border-border bg-card p-[18px] shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]"
      data-od-id="ingredients"
    >
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <h2
          className="min-w-0 text-[22px] font-[850] leading-[1.15] text-foreground"
          id="ingredients-title"
        >
          Ингредиенты
        </h2>
        <div
          aria-label="Количество порций"
          className="grid h-7 w-[82px] grid-cols-[24px_24px_24px] items-center gap-[3px] overflow-hidden rounded-full bg-muted p-0.5"
        >
          <button
            aria-label="Уменьшить порции"
            className="grid size-6 place-items-center rounded-full bg-card text-sm font-[850] leading-none text-secondary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_7%,transparent)] transition hover:-translate-y-px hover:bg-accent hover:text-white"
            type="button"
          >
            <Icon name="minus" className="size-3.5" />
          </button>
          <span className="text-center font-mono text-xs font-extrabold tabular-nums text-foreground">
            2
          </span>
          <button
            aria-label="Увеличить порции"
            className="grid size-6 place-items-center rounded-full bg-card text-sm font-[850] leading-none text-secondary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_7%,transparent)] transition hover:-translate-y-px hover:bg-accent hover:text-white"
            type="button"
          >
            <Icon name="plus" className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {recipe.ingredients.map((ingredient) => (
          <div
            className={`grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] p-2.5 transition-colors hover:bg-muted ${
              ingredient.checked ? "bg-accent/15" : ""
            }`}
            key={ingredient.name}
          >
            <span
              className={`grid size-[18px] place-items-center rounded-[5px] border ${
                ingredient.checked
                  ? "border-accent bg-accent text-white"
                  : "border-border"
              }`}
            >
              {ingredient.checked ? (
                <Icon name="check" className="size-3" />
              ) : null}
            </span>
            <span
              className={`min-w-0 text-sm font-semibold text-foreground ${
                ingredient.checked ? "opacity-70" : ""
              }`}
            >
              {ingredient.name}
            </span>
            <span
              className={`whitespace-nowrap font-mono text-xs tabular-nums text-secondary ${
                ingredient.checked ? "opacity-70" : ""
              }`}
            >
              {ingredient.amount}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EquipmentCard() {
  return (
    <section
      aria-labelledby="equipment-title"
      className="rounded-2xl border border-border bg-card p-[18px] shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]"
      data-od-id="equipment"
    >
      <h2
        className="mb-4 text-[22px] font-[850] leading-[1.15] text-foreground"
        id="equipment-title"
      >
        Инвентарь
      </h2>
      <ul className="grid gap-2 pl-[18px] text-[15px] text-foreground">
        {recipe.equipment.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function CookingSteps() {
  return (
    <section aria-labelledby="steps-title" data-od-id="cooking-steps">
      <h2
        className="mb-3.5 text-2xl font-[850] leading-[1.15] text-foreground"
        id="steps-title"
      >
        Шаги приготовления
      </h2>
      <div className="flex flex-col gap-3.5">
        {recipe.steps.map((step, index) => (
          <article
            className={`grid min-h-[72px] grid-cols-[34px_1fr] items-center gap-4 rounded-2xl border border-border bg-card p-3.5 shadow-[0_6px_20px_color-mix(in_oklch,var(--foreground)_8%,transparent)] ${
              step.image ? "sm:grid-cols-[34px_1fr_104px] sm:min-h-[92px]" : ""
            }`}
            key={step.text}
          >
            <div className="grid size-[34px] place-items-center rounded-full bg-accent font-mono text-[13px] font-bold tabular-nums text-white">
              {index + 1}
            </div>
            <p className="min-w-0 text-[15px] leading-normal text-foreground">
              {step.text}
            </p>
            {step.image ? (
              <div className="relative col-start-2 h-16 w-[min(180px,100%)] overflow-hidden rounded-xl bg-muted shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_8%,transparent)] sm:col-auto sm:w-[104px]">
                <Image
                  alt={`Шаг приготовления ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 180px, 104px"
                  src={step.image}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function CommentsCard() {
  return (
    <section
      aria-labelledby="comments-title"
      className="rounded-2xl border border-border bg-card p-[18px] shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]"
      data-od-id="comments"
      id="comments"
    >
      <h2
        className="mb-3.5 text-2xl font-[850] leading-[1.15] text-foreground"
        id="comments-title"
      >
        Комментарии (12)
      </h2>

      {recipe.comments.map((comment) => (
        <article
          className="mt-3 grid grid-cols-[36px_1fr] items-start gap-3"
          key={`${comment.name}-${comment.text}`}
        >
          <div className="grid size-9 place-items-center rounded-full bg-accent/15 text-xs font-extrabold text-accent">
            {comment.initials}
          </div>
          <div className="min-w-0">
            <p className="inline-flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
              {comment.name}
              {comment.label ? (
                <span className="inline-flex h-5 items-center rounded-full bg-accent/15 px-2 text-[11px] font-bold text-accent">
                  {comment.label}
                </span>
              ) : null}
            </p>
            <p className="mt-1.5 text-sm leading-[1.55] text-secondary">
              {comment.text}
            </p>
          </div>
        </article>
      ))}

      <div className="mt-[18px] grid grid-cols-[1fr_44px] gap-2.5">
        <label className="min-w-0">
          <span className="sr-only">Новый комментарий</span>
          <input
            className="h-11 w-full rounded-full border-0 bg-muted px-4 text-sm text-foreground outline outline-1 outline-transparent transition-[background-color,outline-color] placeholder:text-secondary focus:bg-card focus:outline-accent/45"
            placeholder="Написать комментарий..."
            type="text"
          />
        </label>
        <button
          aria-label="Отправить комментарий"
          className="grid size-11 place-items-center rounded-full bg-accent text-white transition hover:-translate-y-px hover:bg-accent-hover"
          type="button"
        >
          <Icon name="send" className="size-[18px]" />
        </button>
      </div>
    </section>
  );
}

export function RecipeDetails({ recipeId }: RecipeDetailsProps) {
  return (
    <div className="min-h-screen bg-background pb-14" data-recipe-id={recipeId}>
      <Header />

      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 pt-[18px] md:px-6 md:pt-[26px] lg:grid-cols-[minmax(0,1fr)_296px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-[22px]">
          <RecipeHero />
          <CookingSteps />
          <CommentsCard />
        </div>

        <aside
          aria-label="Ингредиенты и инвентарь"
          className="grid min-w-0 gap-[22px] md:grid-cols-[minmax(0,1fr)_minmax(260px,0.78fr)] lg:sticky lg:top-[92px] lg:flex lg:flex-col"
        >
          <IngredientsCard />
          <EquipmentCard />
        </aside>
      </main>
    </div>
  );
}
