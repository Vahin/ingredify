-- Добавление иконки ингредиента
ALTER TABLE "Ingredient" ADD COLUMN "image" TEXT;

UPDATE "Ingredient"
SET "image" = CASE "name"
    WHEN 'Вишня без косточек' THEN '/ingredients/cherry.png'
    WHEN 'Сахар' THEN '/ingredients/sugar.png'
    WHEN 'Пшеничная мука' THEN '/ingredients/flour.png'
    WHEN 'Миндальная крошка' THEN '/ingredients/almond-crumb.png'
    WHEN 'Сливочное масло' THEN '/ingredients/butter.png'
    WHEN 'Молоко' THEN '/ingredients/milk.png'
    WHEN 'Разрыхлитель' THEN '/ingredients/baking-powder.png'
    WHEN 'Несолёное сливочное масло' THEN '/ingredients/unsalted-butter.png'
    ELSE '/ingredients/default.png'
END;

ALTER TABLE "Ingredient" ALTER COLUMN "image" SET NOT NULL;
