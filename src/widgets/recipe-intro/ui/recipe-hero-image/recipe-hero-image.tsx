import Image from 'next/image';

export const RecipeHeroImage = ({ image }: { image: string }) => {
  return (
    <div className='relative mx-auto aspect-9/18 w-[min(240px,100%)] overflow-hidden rounded-[14px] bg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] md:w-full'>
      <Image
        alt='Теплый вишневый коблер в керамической форме'
        className='object-cover'
        fill
        priority
        sizes='(max-width: 768px) 240px, 212px'
        src={image}
      />
    </div>
  );
};
