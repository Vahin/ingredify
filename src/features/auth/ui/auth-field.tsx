import { cn } from '@/shared/lib/utils';

type AuthFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  errors?: string[];
};

export function AuthField({
  id,
  label,
  name,
  type = 'text',
  autoComplete,
  errors,
}: AuthFieldProps) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor={id} className='text-sm font-medium text-foreground'>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        className={cn(
          'h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow]',
          'placeholder:text-secondary focus:border-accent/45 focus:ring-2 focus:ring-accent/20',
          errors && errors.length > 0 && 'border-destructive',
        )}
      />
      {errors && errors.length > 0 ? (
        <p className='text-xs text-destructive'>{errors[0]}</p>
      ) : null}
    </div>
  );
}