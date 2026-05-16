import { IconOld } from '@/shared/ui/icon';

export const RecipeActions = ({ commentsCount }: { commentsCount: number }) => {
  return (
    <div className='flex flex-wrap gap-2.5'>
      <button
        className='inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-accent px-[17px] text-sm font-bold text-white shadow-[0_8px_18px_color-mix(in_oklch,var(--accent)_22%,transparent)] transition hover:-translate-y-px hover:bg-accent-hover focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent/25 active:translate-y-0'
        type='button'
      >
        <IconOld name='bookmark' className='size-[17px]' />
        Сохранить
      </button>
      <button
        className='inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-muted px-[17px] text-sm font-bold text-foreground transition hover:-translate-y-px hover:bg-border/70 active:translate-y-0'
        type='button'
      >
        <IconOld name='message' className='size-[17px] text-secondary' />
        {commentsCount}
      </button>
      <button
        aria-pressed='false'
        className='inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] bg-red-50 px-[17px] text-sm font-bold text-red-500 transition hover:-translate-y-px active:translate-y-0'
        type='button'
      >
        <IconOld name='heart' className='size-[17px]' />
        124
      </button>
    </div>
  );
};
