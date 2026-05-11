import { type Recipe } from '@/entities/recipe';

export const EquipmentCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <section
      aria-labelledby='equipment-title'
      className='rounded-2xl border border-border bg-card p-[18px] shadow-[0_12px_34px_color-mix(in_oklch,var(--foreground)_10%,transparent)]'
      data-od-id='equipment'
    >
      <h2
        className='mb-4 text-[22px] font-[850] leading-[1.15] text-foreground'
        id='equipment-title'
      >
        Инвентарь
      </h2>
      <ul className='grid gap-2 pl-[18px] text-[15px] text-foreground'>
        {recipe.equipment.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};
