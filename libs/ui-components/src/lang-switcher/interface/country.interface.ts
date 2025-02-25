export interface Country {
  name: string;
  language: string;
  code: string;
}

export interface RegionsData {
  africaMiddleEastIndia: Country[];
  asiaPacific: Country[];
  europe: Country[];
}
