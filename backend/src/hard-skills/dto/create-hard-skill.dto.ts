import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateHardSkillDto {
  @ApiProperty({
    example: 'TypeScript',
    description: 'Hard skill name',
  })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @Matches(/^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .'\-+_/]{2,50}$/, {
    message: 'Skill name is incorrect',
  })
  @IsNotEmpty({ message: 'Skill name is required' })
  public readonly hardSkillName: string;
}
