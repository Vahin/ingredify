import Image from 'next/image';

export const IngredientSticker = ({ src }: { src: string }) => {
  return (
    <Image
      alt=''
      className='size-8 shrink-0 rounded-[8px] object-contain shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_12%,transparent)]'
      height={32}
      src={src}
      width={32}
    />
  );
};
