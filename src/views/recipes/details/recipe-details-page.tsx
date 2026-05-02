import Image from "next/image";

type RecipeDetailsPageProps = {
  recipeId: string;
};

type IconName =
  | "bookmark"
  | "check"
  | "heart"
  | "message"
  | "minus"
  | "plus"
  | "search"
  | "send";

const recipe = {
  author: "Тимофей Алексеев",
  authorRole: "Домашний десерт",
  title: "Вишнёвый коблер",
  description:
    "Тёплый домашний десерт с сочной вишнёвой начинкой и нежной золотистой корочкой. Подходит к семейным завтракам, морозному вечеру или густым сливкам.",
  image: "/recipes/cherry-cobbler.png",
  stats: [
    { label: "ккал", value: "365", tone: "bg-red-50 text-red-500" },
    { label: "белки", value: "6 г", tone: "bg-emerald-50 text-emerald-600" },
    { label: "жиры", value: "14 г", tone: "bg-amber-50 text-amber-500" },
    { label: "углеводы", value: "58 г", tone: "bg-violet-50 text-violet-500" },
  ],
  ingredients: [
    { name: "Вишня без косточек", amount: "500 г", checked: true },
    { name: "Сахар", amount: "120 г" },
    { name: "Пшеничная мука", amount: "160 г" },
    { name: "Сливочное масло", amount: "80 г" },
    { name: "Молоко", amount: "120 мл" },
    { name: "Разрыхлитель", amount: "1 ч. л." },
  ],
  equipment: [
    "Форма для запекания",
    "Миска для теста",
    "Силиконовая лопатка",
    "Духовка",
  ],
  steps: [
    {
      text: "Смешайте вишню с сахаром, лимонным соком и крахмалом. Переложите начинку в форму и распределите ровным слоем.",
      image: "/recipes/cherry-step.png",
    },
    {
      text: "В отдельной миске соедините муку, разрыхлитель, соль и сахар. Добавьте холодное масло и разотрите в крошку.",
    },
    {
      text: "Влейте молоко и быстро замесите мягкое тесто. Выложите его ложками поверх вишнёвой начинки, оставляя небольшие просветы.",
      image: "/recipes/cherry-cobbler.png",
    },
    {
      text: "Выпекайте при 190 °C 35-40 минут, пока начинка не начнёт пузыриться, а верх не станет золотистым.",
    },
  ],
};

const iconPaths: Record<IconName, React.ReactNode> = {
  bookmark: (
    <path d="M6.75 4.75A2.25 2.25 0 0 1 9 2.5h6a2.25 2.25 0 0 1 2.25 2.25v14.5L12 16.25l-5.25 3V4.75Z" />
  ),
  check: <path d="m5 12 4 4L19 6" />,
  heart: (
    <path d="M20.5 8.8c0 5.1-8.5 9.7-8.5 9.7s-8.5-4.6-8.5-9.7A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.8Z" />
  ),
  message: (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9H13a8.48 8.48 0 0 1 8 8v.5Z" />
  ),
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  send: <path d="m22 2-7 20-4-9-9-4 20-7ZM11 13l4-4" />,
};

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {iconPaths[name]}
    </svg>
  );
}

function Header() {
  return (
    <header className="flex h-auto min-h-20 w-full justify-center border-b border-border bg-card py-4 md:h-20 md:py-0">
      <div className="flex w-full max-w-[1200px] flex-col gap-4 px-5 md:flex-row md:items-center md:gap-8 lg:px-6">
        <div className="flex h-10 items-center gap-2.5 md:w-[220px]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
            I
          </div>
          <span className="text-[22px] font-bold text-foreground">Ingredify</span>
        </div>

        <label className="relative flex h-11 min-w-0 flex-1 items-center rounded-full bg-muted px-4 text-secondary">
          <span className="sr-only">Поиск рецепта</span>
          <Icon name="search" className="mr-2.5 size-[18px] text-muted-foreground" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-secondary"
            placeholder="Найти десерт, ингредиент или кухню"
            type="search"
          />
        </label>

        <button
          aria-label="Открыть профиль"
          className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-white md:flex"
          type="button"
        >
          D
        </button>
      </div>
    </header>
  );
}

function RecipeHero() {
  return (
    <section className="rounded-2xl bg-card p-4 [box-shadow:0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:h-[480px]">
          <Image
            alt="Вишнёвый коблер в форме для запекания"
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 240px"
            src={recipe.image}
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-4 py-1">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-accent-hover">
              TA
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{recipe.author}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {recipe.authorRole}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-[1.1] text-foreground">
              {recipe.title}
            </h1>
            <p className="max-w-xl text-base leading-[1.45] text-secondary">
              {recipe.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recipe.stats.map((stat) => (
              <div
                className={`rounded-xl px-3 py-2 text-center ${stat.tone}`}
                key={stat.label}
              >
                <p className="text-lg font-bold leading-none">{stat.value}</p>
                <p className="mt-1 text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              type="button"
            >
              <Icon name="bookmark" className="size-[18px]" />
              Сохранить
            </button>
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-muted px-4 text-sm font-medium text-foreground"
              type="button"
            >
              <Icon name="message" className="size-[18px] text-secondary" />
              12
            </button>
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-medium text-red-500"
              type="button"
            >
              <Icon name="heart" className="size-[18px]" />
              124
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function IngredientsCard() {
  return (
    <section className="rounded-2xl bg-card p-4 [box-shadow:0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex h-11 items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-foreground">Ингредиенты</h2>
        <div className="flex h-9 w-[116px] items-center justify-between rounded-full bg-muted px-2">
          <button aria-label="Уменьшить порции" type="button">
            <Icon name="minus" className="size-4 text-secondary" />
          </button>
          <span className="text-sm font-medium text-foreground">2</span>
          <button aria-label="Увеличить порции" type="button">
            <Icon name="plus" className="size-4 text-secondary" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {recipe.ingredients.map((ingredient) => (
          <div
            className={`flex h-12 items-center gap-2.5 rounded-xl px-3 ${
              ingredient.checked ? "bg-green-100/80" : "bg-card"
            }`}
            key={ingredient.name}
          >
            <span
              className={`flex size-4 items-center justify-center rounded border ${
                ingredient.checked
                  ? "border-accent bg-accent text-white"
                  : "border-border"
              }`}
            >
              {ingredient.checked ? (
                <Icon name="check" className="size-3" />
              ) : null}
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
              {ingredient.name}
            </span>
            <span className="text-sm font-medium text-secondary">
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
    <section className="rounded-2xl bg-card p-4 [box-shadow:0_4px_12px_rgba(0,0,0,0.08)]">
      <h2 className="mb-4 text-2xl font-bold text-foreground">Инвентарь</h2>
      <ul className="space-y-3 text-base text-foreground">
        {recipe.equipment.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="text-secondary">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CookingSteps() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Шаги приготовления</h2>
      {recipe.steps.map((step, index) => (
        <article
          className="flex items-center gap-4 rounded-2xl bg-card p-4 [box-shadow:0_4px_12px_rgba(0,0,0,0.08)]"
          key={step.text}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {index + 1}
          </div>
          <p className="min-w-0 flex-1 text-base leading-[1.45] text-foreground">
            {step.text}
          </p>
          {step.image ? (
            <div className="relative hidden h-[84px] w-32 shrink-0 overflow-hidden rounded-xl sm:block">
              <Image
                alt={`Шаг приготовления ${index + 1}`}
                className="object-cover"
                fill
                sizes="128px"
                src={step.image}
              />
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function CommentsCard() {
  return (
    <section className="rounded-2xl bg-card p-4 [box-shadow:0_4px_12px_rgba(0,0,0,0.08)]">
      <h2 className="mb-4 text-2xl font-bold text-foreground">Комментарии (12)</h2>

      <div className="mb-4 flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-accent-hover">
          АК
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-foreground">Анна Котова</p>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-accent-hover">
              Уже готовила
            </span>
          </div>
          <p className="mt-1 text-sm leading-[1.45] text-secondary">
            Для более насыщенного вкуса можно смешать свежую и замороженную
            вишню. Дайте коблеру постоять 10 минут после духовки, чтобы начинка
            загустела.
          </p>
        </div>
      </div>

      <div className="flex h-12 gap-2.5">
        <label className="flex min-w-0 flex-1 items-center rounded-full bg-muted px-4">
          <span className="sr-only">Новый комментарий</span>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-secondary"
            placeholder="Написать комментарий..."
            type="text"
          />
        </label>
        <button
          aria-label="Отправить комментарий"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
          type="button"
        >
          <Icon name="send" className="size-[18px]" />
        </button>
      </div>
    </section>
  );
}

export function RecipeDetailsPage({ recipeId }: RecipeDetailsPageProps) {
  return (
    <div className="min-h-screen bg-background" data-recipe-id={recipeId}>
      <Header />

      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-5 py-6 lg:grid-cols-[minmax(0,792px)_336px] lg:px-6 lg:pb-12">
        <div className="space-y-6">
          <RecipeHero />
          <CookingSteps />
          <CommentsCard />
        </div>

        <aside className="space-y-6">
          <IngredientsCard />
          <EquipmentCard />
        </aside>
      </main>
    </div>
  );
}
