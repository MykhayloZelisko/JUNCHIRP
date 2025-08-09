import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ContainsOnlyAllowedCharacters', async: false })
export class ContainsOnlyAllowedCharactersValidator
  implements ValidatorConstraintInterface
{
  public validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const regex = /^[0-9a-zA-Z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;
    return regex.test(value);
  }

  public defaultMessage(): string {
    return 'Password contains forbidden characters';
  }
}

export function ContainsOnlyAllowedCharacters(
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ContainsOnlyAllowedCharactersValidator,
    });
  };
}
