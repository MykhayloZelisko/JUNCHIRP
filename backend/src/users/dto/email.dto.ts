import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class EmailDto {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is incorrect' })
  @Matches(/^(?!.*[а-яА-ЯіІєЄїЇ])(?!.*\.ru$)/, {
    message: 'Invalid email format or contains a restricted domain',
  })
  public readonly email: string;
}
