import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

export enum FileStoreDirectory {
  MODELS = 'models',
  CONTACT_FORMS = 'contact_forms',
}

export type DatabaseConfig = {
  database: TypeOrmModuleOptions;
};

export type MulterFile = Express.Multer.File;

export enum Accepted3DModelType {
  STL = 'stl',
  STP = 'stp',
  STEP = 'step',
}

export interface ResponseObject<T = undefined> {
  message?: string;
  data?: T;
}

export type LOGGER_TYPE = 'log' | 'warn' | 'error' | 'debug';

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

export enum ReviewStatus {
  Unsubmitted = 'Unsubmitted',
  Unassigned = 'Unassigned',
  Assigned = 'Assigned',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum Role {
  Admin = 'Admin',
  Customer = 'Customer',
}
