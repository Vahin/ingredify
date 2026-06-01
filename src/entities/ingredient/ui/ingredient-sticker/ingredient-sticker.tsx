import Image from 'next/image';

export const IngredientSticker = ({ src }: { src: string }) => {
  return (
    <Image
      alt=''
      className='size-8 shrink-0 object-contain'
      height={32}
      src={src}
      width={32}
    />
  );
};
