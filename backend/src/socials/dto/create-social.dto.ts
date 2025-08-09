import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { IsValidSocialNetworkUrl } from '../../shared/validators/is-valid-social-network-url.validator';

export class CreateSocialDto {
  @ApiProperty({
    example: 'LinkedIn',
    description: 'Social network name',
  })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @Matches(/^[a-zA-Zа-яА-ЯґҐїЇєЄ' -]{2,50}$/, {
    message: 'Network name is incorrect',
  })
  @IsNotEmpty({ message: 'Network name is required' })
  public readonly network: string;

  @ApiProperty({
    example: 'https://linkedin.com/in/user-125478',
    description: 'Profile url',
  })
  @IsString({ message: 'Must be a string' })
  @Length(10, 255, { message: 'Must be between 10 and 255 characters' })
  @Matches(/^https:\/\/.{2,247}$/, {
    message: 'Profile url is incorrect',
  })
  @IsNotEmpty({ message: 'Profile url is required' })
  @IsValidSocialNetworkUrl()
  public readonly url: string;
}
