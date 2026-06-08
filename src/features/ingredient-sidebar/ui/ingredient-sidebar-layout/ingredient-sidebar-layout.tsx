export const IngredientSidebarLayout = ({
  header,
  list,
  footer,
}: {
  header: React.ReactNode;
  list: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <section
      aria-labelledby='ingredients-title'
      className='relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]'
      data-od-id='ingredients'
    >
      <div className='p-[18px] pb-3'>{header}</div>
      <div className='border-t border-border/70 px-[18px] py-3'>{list}</div>
      {footer ? <div className='px-[18px] pb-[18px]'>{footer}</div> : null}
    </section>
  );
};
