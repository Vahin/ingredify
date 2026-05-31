-- CreateEnum
CREATE TYPE "MeasurementUnitKind" AS ENUM ('mass', 'volume', 'count', 'informal', 'serving');

-- AlterTable
ALTER TABLE "MeasurementUnit" ADD COLUMN "kind" "MeasurementUnitKind",
ADD COLUMN "round_to_integer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "scalable_as_portion" BOOLEAN NOT NULL DEFAULT false;

-- Backfill существующих единиц
UPDATE "MeasurementUnit" SET "kind" = 'mass', "round_to_integer" = true, "scalable_as_portion" = false WHERE "short_name" = 'г';
UPDATE "MeasurementUnit" SET "kind" = 'mass', "round_to_integer" = false, "scalable_as_portion" = false WHERE "short_name" = 'кг';
UPDATE "MeasurementUnit" SET "kind" = 'volume', "round_to_integer" = true, "scalable_as_portion" = false WHERE "short_name" = 'мл';
UPDATE "MeasurementUnit" SET "kind" = 'volume', "round_to_integer" = false, "scalable_as_portion" = false WHERE "short_name" = 'л';
UPDATE "MeasurementUnit" SET "kind" = 'count', "round_to_integer" = true, "scalable_as_portion" = false WHERE "short_name" = 'шт';
UPDATE "MeasurementUnit" SET "kind" = 'volume', "round_to_integer" = false, "scalable_as_portion" = false WHERE "short_name" = 'ч. л.';
UPDATE "MeasurementUnit" SET "kind" = 'volume', "round_to_integer" = false, "scalable_as_portion" = false WHERE "short_name" = 'ст. л.';
UPDATE "MeasurementUnit" SET "kind" = 'informal', "round_to_integer" = true, "scalable_as_portion" = false WHERE "short_name" = 'щепотка';
UPDATE "MeasurementUnit" SET "kind" = 'serving', "round_to_integer" = true, "scalable_as_portion" = true WHERE "short_name" = 'порц.';

-- NOT NULL для kind после backfill
ALTER TABLE "MeasurementUnit" ALTER COLUMN "kind" SET NOT NULL;

-- Снять дефолты с boolean-колонок (значения уже заданы)
ALTER TABLE "MeasurementUnit" ALTER COLUMN "round_to_integer" DROP DEFAULT;
ALTER TABLE "MeasurementUnit" ALTER COLUMN "scalable_as_portion" DROP DEFAULT;
