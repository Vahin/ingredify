import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/shared/lib/prisma';

export default async function Home() {
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      author: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className='mx-auto w-full max-w-[800px] px-4 py-10 md:px-6'>
      <h1 className='text-2xl font-bold text-foreground'>Рецепты</h1>
      {recipes.length === 0 ? (
        <p className='mt-4 text-secondary'>Пока нет рецептов.</p>
      ) : (
        <ul className='mt-6 flex flex-col gap-3'>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link
                className='flex gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted'
                href={`/recipes/${recipe.id}`}
              >
                <Image
                  alt=''
                  className='size-20 shrink-0 rounded-xl object-cover'
                  height={80}
                  src={recipe.image}
                  width={80}
                />
                <div className='min-w-0 flex-1'>
                  <h2 className='text-lg font-semibold text-foreground'>
                    {recipe.title}
                  </h2>
                  <p className='mt-1 text-sm text-secondary'>
                    {recipe.author.name}
                  </p>
                  <p className='mt-2 line-clamp-2 text-sm text-secondary'>
                    {recipe.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
