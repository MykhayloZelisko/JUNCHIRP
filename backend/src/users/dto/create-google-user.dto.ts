import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateGoogleUserDto {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @Length(7, 254, { message: 'Must be between 7 and 254 characters' })
  @IsEmail({}, { message: 'Email is incorrect' })
  @Matches(/^(?!.*[а-яА-ЯіІєЄїЇ])(?!.*\.ru$)/, {
    message: 'Invalid email format or contains a restricted domain',
  })
  @IsNotEmpty({ message: 'Email is required' })
  public readonly email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @Matches(/^[a-zA-Zа-яА-ЯґҐїЇєЄ' -]{2,50}$/, {
    message: 'First name is incorrect',
  })
  @IsNotEmpty({ message: 'First name is required' })
  public readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @Matches(/^[a-zA-Zа-яА-ЯґҐїЇєЄ' -]{2,50}$/, {
    message: 'First name is incorrect',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  public readonly lastName: string;

  @ApiProperty({
    example: '113273902301932041645',
    description: 'Google identifier',
  })
  @IsString({ message: 'Must be a string' })
  public readonly googleId: string;
}
