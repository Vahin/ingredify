export const RecipeAuthor = ({ author }: { author: string }) => {
  return (
    <div className='flex items-center gap-2.5'>
      <div className='grid size-[34px] place-items-center rounded-full bg-accent/15 text-xs font-extrabold text-accent'>
        АК
      </div>
      <div>
        <p className='text-[13px] font-extrabold leading-none text-foreground'>
          {author}
        </p>
        <p className='mt-1 text-xs text-secondary'>Автор рецепта</p>
      </div>
    </div>
  );
};
