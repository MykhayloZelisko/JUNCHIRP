import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDateValidator implements ValidatorConstraintInterface {
  public validate(value: unknown): boolean {
    if (!(value instanceof Date)) {
      return false;
    }
    const now = new Date();
    return value.getTime() > now.getTime();
  }

  public defaultMessage(): string {
    return 'Must be a valid date in the future';
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateValidator,
    });
  };
}
