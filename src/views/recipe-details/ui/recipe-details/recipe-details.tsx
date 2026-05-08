import { Header } from "@/widgets/header";
import { RecipeHero } from "../recipe-hero/recipe-hero";
import { recipe } from "../../model/recipe";
import { IngredientsCard } from "../ingredient-card/ingredient-card";
import { EquipmentCard } from "../equipment-card/equipment-card";
import { CookingStep } from "../coocking-step/coocking-step";
import { CommentsCard } from "../comments-card/comments-card";

type RecipeDetailsProps = {
  recipeId: string;
};

export function RecipeDetails({ recipeId }: RecipeDetailsProps) {
  return (
    <div className="min-h-screen bg-background pb-14" data-recipe-id={recipeId}>
      <Header />

      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 pt-[18px] md:px-6 md:pt-[26px] lg:grid-cols-[minmax(0,1fr)_296px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-[22px]">
          <RecipeHero recipe={recipe} />
          <CookingStep recipe={recipe} />
          <CommentsCard recipe={recipe} />
        </div>

        <aside
          aria-label="Ингредиенты и инвентарь"
          className="grid min-w-0 gap-[22px] md:grid-cols-[minmax(0,1fr)_minmax(260px,0.78fr)] lg:sticky lg:top-[92px] lg:flex lg:flex-col"
        >
          <IngredientsCard recipe={recipe} />
          <EquipmentCard recipe={recipe} />
        </aside>
      </main>
    </div>
  );
}
