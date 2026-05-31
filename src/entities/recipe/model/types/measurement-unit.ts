import type {
  MeasurementUnitKind,
  MeasurementUnitShortName,
} from '../constants/measurement-units';

/** Единица измерения для UI и бизнес-логики */
export type MeasurementUnitView = {
  shortName: MeasurementUnitShortName;
  label: string;
  kind: MeasurementUnitKind;
  roundToInteger: boolean;
};
