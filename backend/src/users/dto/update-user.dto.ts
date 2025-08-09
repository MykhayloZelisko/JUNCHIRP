import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { AtLeastOneField } from '../../shared/validators/at-least-one-field.validator';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['firstName', 'lastName', 'email']),
) {
  @AtLeastOneField(['firstName', 'lastName', 'email'])
  public readonly atLeastOneFieldValidator?: unknown;
}
