interface RecipeLayoutProps {
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

export const RecipeLayout = (props: RecipeLayoutProps) => {
  const { content, sidebar } = props;

  return (
    <main className='mx-auto grid w-full max-w-[1200px] gap-6 px-4 pt-[18px] md:px-6 md:pt-[26px] lg:grid-cols-[minmax(0,1fr)_296px] lg:items-start'>
      <div className='flex min-w-0 flex-col gap-[22px]'>{content}</div>

      <aside
        aria-label='Ингредиенты и инвентарь'
        className='grid min-w-0 gap-[22px] md:grid-cols-[minmax(0,1fr)_minmax(260px,0.78fr)] lg:sticky lg:top-[92px] lg:flex lg:flex-col'
      >
        {sidebar}
      </aside>
    </main>
  );
};
