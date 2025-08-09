import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateSupportDto {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @Length(7, 254, { message: 'Must be between 7 and 254 characters' })
  @IsEmail({}, { message: 'Email is incorrect' })
  @Matches(/^(?!.*[а-яА-ЯґҐіІєЄїЇ])(?!.*\.ru$)/, {
    message: 'Invalid email format or contains a restricted domain',
  })
  @IsNotEmpty({ message: 'Email is required' })
  public readonly email: string;

  @ApiProperty({
    example: 'Request description',
    description: 'Request description',
  })
  @IsString({ message: 'Must be a string' })
  @Length(10, 1000, { message: 'Must be between 10 and 1000 characters' })
  @Matches(/^[0-9a-zA-Zа-яА-ЯґҐіІїЇєЄ'’ .,;:!?()\n\r-]{10,1000}$/, {
    message: 'Invalid text format',
  })
  @IsNotEmpty({ message: 'Request description is required' })
  public readonly request: string;
}
