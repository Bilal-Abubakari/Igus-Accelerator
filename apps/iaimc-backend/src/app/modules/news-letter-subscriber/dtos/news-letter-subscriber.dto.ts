import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class NewsLetterSubscriberDto {
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  public readonly firstName!: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  public readonly email!: string;
}
