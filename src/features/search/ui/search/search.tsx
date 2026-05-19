import { SearchIcon } from 'lucide-react';

export const Search = () => {
  return (
    <label className='relative order-3 col-span-full min-w-0 md:order-0 md:col-auto'>
      <span className='sr-only'>Поиск рецепта</span>
      <SearchIcon className='pointer-events-none absolute left-[18px] top-1/2 size-[18px] -translate-y-1/2 text-secondary' />
      <input
        className='h-11 w-full rounded-full border-0 bg-muted px-5 pl-12 text-sm text-foreground outline-1 outline-transparent transition-[background-color,outline-color] placeholder:text-secondary focus:bg-card focus:outline-accent/45'
        placeholder='Найти рецепт, ингредиент или кухню'
        type='search'
      />
    </label>
  );
};
