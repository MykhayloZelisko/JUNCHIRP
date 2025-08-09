import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'HasTwoGroups', async: false })
export class HasTwoGroupsValidator implements ValidatorConstraintInterface {
  public validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    let groups = 0;
    if (/[0-9]/.test(value)) {
      groups++;
    }
    if (/[a-z]/.test(value)) {
      groups++;
    }
    if (/[A-Z]/.test(value)) {
      groups++;
    }
    if (/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(value)) {
      groups++;
    }

    return groups >= 2;
  }

  public defaultMessage(): string {
    return 'Password must contain at least two groups of characters: uppercase letters, lowercase letters, numbers, or special characters';
  }
}

export function HasTwoGroups(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: HasTwoGroupsValidator,
    });
  };
}
