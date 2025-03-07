import { IsOptional, IsString } from 'class-validator';

export class MaterialsDataImportDto {
  @IsString()
  public file!: string;

  @IsOptional()
  @IsString()
  public outputFile?: string; // defaults to the name of the xlsx file if not specified
}
