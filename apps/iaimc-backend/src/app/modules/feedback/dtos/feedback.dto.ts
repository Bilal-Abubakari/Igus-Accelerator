import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  public readonly rating?: number;

@IsOptional()
@IsString()
public readonly comment?: string;

}
