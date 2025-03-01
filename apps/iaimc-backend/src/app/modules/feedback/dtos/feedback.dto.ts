import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  public readonly rating?: number;

  @IsString()
  public readonly comment?: string;
}
