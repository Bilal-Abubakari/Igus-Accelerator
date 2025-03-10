export interface ChemicalResistance {
  name: string;
  resistance?: string;
}

export interface Material {
  id: string;
  name: string;
  procedure: string;
  color: string;
  colorhex: string;
  textColor?: string;
  mintemperature: number;
  maxtemperature: number;
  maxtemperatureshort: number;
  maxenvironmentaltemperatureshort: number;
  maxmoistureabsorption: number;
  maxwaterabsorption: number;
  modulusofelasticity: number;
  mincoefficientoffriction: number;
  maxcoefficientoffriction: number;
  density: number;
  bendingstrength: number;
  maxsurfacepressure: number;
  underwatercompliant: boolean;
  foodcontactfdacompliant: boolean;
  foodcontacteucompliant: boolean;
  electricallyconductive: boolean;
  ptfefree: boolean;
  pfasfree: boolean;
  mouldresistant: boolean;
  dirtresistant: boolean;
  hardness: number;
  specificvolumeresistance: string;
  surfaceresistance: string;
  highchemicalresistance: boolean;
  lowwaterabsorption: boolean;
  maxallowedpressurevelocity: number;
  thermalconductivity: number;
  maxrotationalspeed: number;
  maxlinearspeed: number;
  maxpivotspeed: number;
  chemicals: ChemicalResistance[];
  cavityindex: number;
  heatedmold: boolean;
  shrinkage: number;
  producibilitylevel: number;
  injectionmoldingcalculability: boolean;
}
