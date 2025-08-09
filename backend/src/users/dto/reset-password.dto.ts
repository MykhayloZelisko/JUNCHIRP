import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsPasswordNotContainName } from '../../shared/validators/is-password-not-contain-name.validator';
import { IsPasswordInBlackList } from '../../shared/validators/is-in-black-list.validator';
import { ContainsOnlyAllowedCharacters } from '../../shared/validators/contains-only-allowed-characters.validator';
import { HasTwoGroups } from '../../shared/validators/has-two-groups.validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  @IsString({ message: 'Must be a string' })
  @Length(8, 20, { message: 'Must be between 8 and 20 characters' })
  @ContainsOnlyAllowedCharacters()
  @HasTwoGroups()
  @IsPasswordNotContainName()
  @IsPasswordInBlackList()
  @IsNotEmpty({ message: 'Password is required' })
  public readonly password: string;

  @ApiProperty({ example: 'token', description: 'Reset password token' })
  @IsNotEmpty({ message: 'Token is required' })
  @IsString({ message: 'Must be a string' })
  public readonly token: string;
}
