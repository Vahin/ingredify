# RecipeDetails

## Описание

`RecipeDetails` загружает рецепт по `recipeId` и собирает страницу деталей рецепта.

## Поведение

Компонент является асинхронным: получает данные через `getRecipe`, передаёт основной контент в `RecipeDetailsContent`, а сайдбар формирует из `IngredientsCard` и `EquipmentCard` внутри `RecipeLayout`.

## Тесты

Тестов нет.

## Todo

Задач нет
