import { Icon } from "@/shared/ui/icon";

export const Header = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-[14px]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5 md:grid-cols-[190px_minmax(280px,1fr)_54px] md:gap-6 md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-2.5 text-[19px] font-extrabold text-foreground md:text-[21px]">
          <div className="grid size-9 place-items-center rounded-[10px] bg-accent text-[21px] font-extrabold text-white">
            i
          </div>
          <span>Ingredify</span>
        </div>

        <label className="relative order-3 col-span-full min-w-0 md:order-none md:col-auto">
          <span className="sr-only">Поиск рецепта</span>
          <Icon
            name="search"
            className="pointer-events-none absolute left-[18px] top-1/2 size-[18px] -translate-y-1/2 text-secondary"
          />
          <input
            className="h-11 w-full rounded-full border-0 bg-muted px-5 pl-12 text-sm text-foreground outline outline-1 outline-transparent transition-[background-color,outline-color] placeholder:text-secondary focus:bg-card focus:outline-accent/45"
            placeholder="Найти рецепт, ингредиент или кухню"
            type="search"
          />
        </label>

        <button
          aria-label="Открыть профиль"
          className="grid size-[38px] place-items-center justify-self-end rounded-full bg-accent text-base font-extrabold text-white shadow-[0_0_0_5px_color-mix(in_oklch,var(--accent)_12%,transparent)]"
          type="button"
        >
          D
        </button>
      </div>
    </header>
  );
};
