import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordNotContainName', async: false })
export class IsPasswordNotContainNameValidator
  implements ValidatorConstraintInterface
{
  public validate(password: string, args: ValidationArguments): boolean {
    const { firstName, lastName } = args.object as {
      firstName: string;
      lastName: string;
    };
    const namePattern = new RegExp(`(${firstName}|${lastName})`, 'i');
    return !namePattern.test(password);
  }

  public defaultMessage(): string {
    return 'Password should not contain first name or last name.';
  }
}

export function IsPasswordNotContainName(
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordNotContainNameValidator,
    });
  };
}
