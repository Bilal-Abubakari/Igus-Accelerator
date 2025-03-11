export type ResistanceLevel = 'x' | 'o' | '+' | '-';

export interface ChemicalResistance {
  name: string;
  resistance: ResistanceLevel;
}

export interface InjectionMoldingMaterial {
  id: string;
  name: string;
  procedure: string;
  color: string;
  colorHex: string;
  minTemperature: number;
  maxTemperature: number;
  maxTemperatureShort: number;
  maxEnvironmentalTemperatureShort: number;
  maxMoistureAbsorption: number;
  maxWaterAbsorption: number;
  modulusOfElasticity: number;
  minCoefficientOfFriction: number;
  maxCoefficientOfFriction: number;
  density: number;
  bendingStrength: number;
  maxSurfacePressure: number;
  underWaterCompliant: boolean;
  foodContactFDACompliant: boolean;
  foodContactEUCompliant: boolean;
  electricallyConductive: boolean;
  PTFEFree: boolean;
  PFASFree: boolean;
  mouldResistant: boolean;
  dirtResistant: boolean;
  hardness: number;
  specificVolumeResistance: string;
  surfaceResistance: string;
  highChemicalResistance: boolean;
  lowWaterAbsorption: boolean;
  maxAllowedPressureVelocity: number;
  thermalConductivity: number;
  maxRotationalSpeed: number;
  maxLinearSpeed: number;
  maxPivotSpeed: number;
  chemicals: ChemicalResistance[];
  cavityIndex: number;
  heatedMold: boolean;
  shrinkage: number;
  producibilityLevel: number;
  injectionMoldingCalculability: boolean;
}

export type InjectionMoldingMaterialPropertyValueType =
  InjectionMoldingMaterial[keyof InjectionMoldingMaterial];

export type MaterialName =
  | 'A160'
  | 'A180'
  | 'A181'
  | 'A200'
  | 'A350'
  | 'A500'
  | 'AB'
  | 'B'
  | 'C'
  | 'C500'
  | 'D'
  | 'F'
  | 'F2'
  | 'G'
  | 'G1'
  | 'GLW'
  | 'GV0'
  | 'H'
  | 'H1'
  | 'H370'
  | 'H2'
  | 'H4'
  | 'HSD350'
  | 'J'
  | 'J2'
  | 'J200'
  | 'J260'
  | 'J3'
  | 'J350'
  | 'J4';
