import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';

export const createMockMaterial = (
  overrides: Partial<InjectionMoldingMaterial> = {},
): InjectionMoldingMaterial => ({
  id: 'default-id',
  name: 'Default Material',
  procedure: 'Standard Procedure',
  color: 'Black',
  colorHex: '#000000',
  minTemperature: -50,
  maxTemperature: 150,
  maxTemperatureShort: 200,
  maxEnvironmentalTemperatureShort: 180,
  maxMoistureAbsorption: 0.5,
  maxWaterAbsorption: 0.3,
  modulusOfElasticity: 2500,
  minCoefficientOfFriction: 0.1,
  maxCoefficientOfFriction: 0.5,
  density: 1.2,
  bendingStrength: 80,
  maxSurfacePressure: 100,
  underWaterCompliant: true,
  foodContactFDACompliant: false,
  foodContactEUCompliant: false,
  electricallyConductive: false,
  PTFEFree: true,
  PFASFree: true,
  mouldResistant: false,
  dirtResistant: true,
  hardness: 75,
  specificVolumeResistance: '10^12 Ω·cm',
  surfaceResistance: '10^9 Ω',
  highChemicalResistance: true,
  lowWaterAbsorption: true,
  maxAllowedPressureVelocity: 5.0,
  thermalConductivity: 0.25,
  maxRotationalSpeed: 5000,
  maxLinearSpeed: 10,
  maxPivotSpeed: 2,
  chemicals: [
    { name: 'Acid', resistance: 'o' },
    { name: 'Water', resistance: 'x' },
  ],
  cavityIndex: 1,
  heatedMold: false,
  shrinkage: 0.02,
  producibilityLevel: 3,
  injectionMoldingCalculability: true,

  ...overrides,
});
