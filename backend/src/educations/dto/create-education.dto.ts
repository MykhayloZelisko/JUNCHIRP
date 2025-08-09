import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    example: 'Ivan Franko National University of Lviv',
    description: 'Name of the educational institution',
  })
  @IsString({ message: 'Must be a string' })
  @Length(2, 100, { message: 'Must be between 2 and 100 characters' })
  @Matches(/^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .'’,"-]{2,100}$/, {
    message: 'Institution name is incorrect',
  })
  @IsNotEmpty({ message: 'Institution name is required' })
  public readonly institution: string;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Specialization ID',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Specialization ID is required' })
  public readonly specializationId: string;
}
