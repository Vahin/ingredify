import Link from 'next/link';

export const Logo = () => {
  return (
    <div className='flex min-w-0 items-center gap-2.5 text-[19px] font-extrabold text-foreground md:text-[21px]'>
      <Link href='/' className='flex items-center gap-2.5'>
        <div className='grid size-9 place-items-center rounded-[10px] bg-accent text-[21px] font-extrabold text-white'>
          i
        </div>
        <span>Ingredify</span>
      </Link>
    </div>
  );
};
