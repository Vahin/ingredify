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
      className='relative rounded-2xl border border-border bg-card p-[18px] shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]'
      data-od-id='ingredients'
    >
      {header}
      {list}
      {footer}
    </section>
  );
};
