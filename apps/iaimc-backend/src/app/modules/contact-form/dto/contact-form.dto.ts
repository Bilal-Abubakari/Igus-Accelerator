import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ContactFormDto {
  @IsString()
  @IsNotEmpty()
  public firstName!: string;

  @IsString()
  @IsNotEmpty()
  public lastName!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public company!: string;

  @IsString()
  @IsNotEmpty()
  public postalCode!: string;

  @IsString()
  @IsNotEmpty()
  public country!: string;

  @IsString()
  @IsOptional()
  public telephone?: string;

  @IsString()
  @IsOptional()
  public message?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  public agreement!: boolean;
}
