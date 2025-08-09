import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({ example: 'token', description: 'Confirmation token' })
  @IsNotEmpty({ message: 'Token is required' })
  @IsString({ message: 'Must be a string' })
  public readonly token: string;

  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @Length(7, 254, { message: 'Must be between 7 and 254 characters' })
  @IsEmail({}, { message: 'Email is incorrect' })
  @Matches(/^(?!.*[а-яА-ЯґҐіІєЄїЇ])(?!.*\.ru$)/, {
    message: 'Invalid email format or contains a restricted domain',
  })
  @IsNotEmpty({ message: 'Email is required' })
  public readonly email: string;
}
