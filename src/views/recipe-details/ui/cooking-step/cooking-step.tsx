import Image from "next/image";

import { type Recipe } from "@/entities/recipe";

export const CookingStep = ({ recipe }: { recipe: Recipe }) => {
  return (
    <section aria-labelledby="steps-title" data-od-id="cooking-steps">
      <h2
        className="mb-3.5 text-2xl font-[850] leading-[1.15] text-foreground"
        id="steps-title"
      >
        Шаги приготовления
      </h2>
      <div className="flex flex-col gap-3.5">
        {recipe.steps.map((step, index) => (
          <article
            className={`grid min-h-[72px] grid-cols-[34px_1fr] items-center gap-4 rounded-2xl border border-border bg-card p-3.5 shadow-[0_6px_20px_color-mix(in_oklch,var(--foreground)_8%,transparent)] ${
              step.image ? "sm:grid-cols-[34px_1fr_104px] sm:min-h-[92px]" : ""
            }`}
            key={step.text}
          >
            <div className="grid size-[34px] place-items-center rounded-full bg-accent font-mono text-[13px] font-bold tabular-nums text-white">
              {index + 1}
            </div>
            <p className="min-w-0 text-[15px] leading-normal text-foreground">
              {step.text}
            </p>
            {step.image ? (
              <div className="relative col-start-2 h-16 w-[min(180px,100%)] overflow-hidden rounded-xl bg-muted shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_8%,transparent)] sm:col-auto sm:w-[104px]">
                <Image
                  alt={`Шаг приготовления ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 180px, 104px"
                  src={step.image}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};
