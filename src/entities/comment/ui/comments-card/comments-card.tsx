import { type Recipe } from '@/entities/recipe';
import { Icon } from '@/shared/ui/icon';

export const CommentsCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <section
      aria-labelledby='comments-title'
      className='rounded-2xl border border-border bg-card p-[18px] shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]'
      data-od-id='comments'
      id='comments'
    >
      <h2
        className='mb-3.5 text-2xl font-[850] leading-[1.15] text-foreground'
        id='comments-title'
      >
        Комментарии (12)
      </h2>

      {recipe.comments.map((comment) => (
        <article
          className='mt-3 grid grid-cols-[36px_1fr] items-start gap-3'
          key={`${comment.name}-${comment.text}`}
        >
          <div className='grid size-9 place-items-center rounded-full bg-accent/15 text-xs font-extrabold text-accent'>
            {comment.initials}
          </div>
          <div className='min-w-0'>
            <p className='inline-flex flex-wrap items-center gap-2 text-sm font-bold text-foreground'>
              {comment.name}
              {comment.label ? (
                <span className='inline-flex h-5 items-center rounded-full bg-accent/15 px-2 text-[11px] font-bold text-accent'>
                  {comment.label}
                </span>
              ) : null}
            </p>
            <p className='mt-1.5 text-sm leading-[1.55] text-secondary'>
              {comment.text}
            </p>
          </div>
        </article>
      ))}

      <div className='mt-[18px] grid grid-cols-[1fr_44px] gap-2.5'>
        <label className='min-w-0'>
          <span className='sr-only'>Новый комментарий</span>
          <input
            className='h-11 w-full rounded-full border-0 bg-muted px-4 text-sm text-foreground outline-1 outline-transparent transition-[background-color,outline-color] placeholder:text-secondary focus:bg-card focus:outline-accent/45'
            placeholder='Написать комментарий...'
            type='text'
          />
        </label>
        <button
          aria-label='Отправить комментарий'
          className='grid size-11 place-items-center rounded-full bg-accent text-white transition hover:-translate-y-px hover:bg-accent-hover'
          type='button'
        >
          <Icon name='send' className='size-[18px]' />
        </button>
      </div>
    </section>
  );
};
