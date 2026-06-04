import Link from "next/link";


export const IngredientName = ({
  name,
  linkedRecipeId,
}: {
  name: string;
  linkedRecipeId?: string;
}) => {
  if (linkedRecipeId) {
    return (
      <Link
        className='min-w-0 text-sm font-normal text-foreground underline-offset-2 hover:underline'
        href={`/recipes/${linkedRecipeId}`}
        onClick={(event) => event.stopPropagation()}
      >
        {name}
      </Link>
    );
  }
  return (
    <span className='min-w-0 text-sm font-normal text-foreground'>
      {name}
    </span>
  );
};