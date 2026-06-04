import Link from 'next/link';

export const IngredientName = ({
  name,
  href,
}: {
  name: string;
  href?: string;
}) => {
  if (href) {
    return (
      <Link
        className='block min-w-0 truncate text-sm font-normal text-foreground underline-offset-2 hover:underline'
        href={href}
        onClick={(event) => event.stopPropagation()}
        title={name}
      >
        {name}
      </Link>
    );
  }
  return (
    <span className='block min-w-0 truncate text-sm font-normal text-foreground' title={name}>
      {name}
    </span>
  );
};
