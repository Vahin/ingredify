export const RecipeMainInfo = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className='grid gap-2.5'>
      <h1
        className='text-[clamp(30px,4vw,38px)] font-[850] leading-[1.05] text-foreground'
        id='recipe-title'
      >
        {title}
      </h1>
      <p className='max-w-[56ch] text-[15px] leading-[1.6] text-secondary'>
        {description}
      </p>
    </div>
  );
};
