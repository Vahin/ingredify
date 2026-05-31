import type { MeasurementUnitView } from './measurement-unit';

/** Физический выход: масса или объём */
export type PhysicalOutput = {
  quantity: number;
  unit: MeasurementUnitView;
};
