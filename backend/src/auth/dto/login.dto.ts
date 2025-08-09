import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is incorrect' })
  @Matches(/^(?!.*[а-яА-ЯіІєЄїЇ])(?!.*\.ru$)/, {
    message: 'Invalid email format or contains a restricted domain',
  })
  public readonly email: string;

  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  @Length(8, 20, { message: 'Must be between 8 and 20 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  public readonly password: string;
}
