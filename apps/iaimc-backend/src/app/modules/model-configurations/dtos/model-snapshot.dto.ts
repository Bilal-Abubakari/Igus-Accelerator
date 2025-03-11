import { IsNotEmpty, IsString } from 'class-validator';

export class ModelSnapshotDto {
  @IsString()
  @IsNotEmpty()
  public snapshot!: string;
}
