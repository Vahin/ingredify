/** Семантический тип единицы измерения */
export const MEASUREMENT_UNIT_KINDS = [
  'mass',
  'volume',
  'count',
  'informal',
  'serving',
] as const;

export type MeasurementUnitKind = (typeof MEASUREMENT_UNIT_KINDS)[number];

/** Допустимые kind для физического выхода рецепта */
export const RECIPE_OUTPUT_UNIT_KINDS = ['mass', 'volume'] as const;

export type RecipeOutputUnitKind = (typeof RECIPE_OUTPUT_UNIT_KINDS)[number];

export function isRecipePhysicalOutputKind(
  kind: MeasurementUnitKind,
): kind is RecipeOutputUnitKind {
  return (RECIPE_OUTPUT_UNIT_KINDS as readonly string[]).includes(kind);
}

export type MeasurementUnitDefinition = {
  shortName: string;
  name: string;
  kind: MeasurementUnitKind;
  roundToInteger: boolean;
};

/** Канонический справочник единиц измерения (синхронизируется с seed и БД) */
export const MEASUREMENT_UNITS = [
  {
    shortName: 'г',
    name: 'Грамм',
    kind: 'mass',
    roundToInteger: true,
  },
  {
    shortName: 'кг',
    name: 'Килограмм',
    kind: 'mass',
    roundToInteger: false,
  },
  {
    shortName: 'мл',
    name: 'Миллилитр',
    kind: 'volume',
    roundToInteger: true,
  },
  {
    shortName: 'л',
    name: 'Литр',
    kind: 'volume',
    roundToInteger: false,
  },
  {
    shortName: 'шт',
    name: 'Штука',
    kind: 'count',
    roundToInteger: true,
  },
  {
    shortName: 'ч. л.',
    name: 'Чайная ложка',
    kind: 'volume',
    roundToInteger: false,
  },
  {
    shortName: 'ст. л.',
    name: 'Столовая ложка',
    kind: 'volume',
    roundToInteger: false,
  },
  {
    shortName: 'щепотка',
    name: 'Щепотка',
    kind: 'informal',
    roundToInteger: true,
  },
  {
    shortName: 'порц.',
    name: 'Порция',
    kind: 'serving',
    roundToInteger: true,
  },
] as const satisfies readonly MeasurementUnitDefinition[];

export type MeasurementUnitShortName =
  (typeof MEASUREMENT_UNITS)[number]['shortName'];

/** Физический выход рецепта: только mass/volume */
export type RecipePhysicalOutputUnitShortName = Extract<
  MeasurementUnitShortName,
  'г' | 'кг' | 'мл' | 'л'
>;

export const MEASUREMENT_UNIT_BY_SHORT_NAME = Object.fromEntries(
  MEASUREMENT_UNITS.map((unit) => [unit.shortName, unit]),
) as Record<
  MeasurementUnitShortName,
  (typeof MEASUREMENT_UNITS)[number]
>;
