import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneField', async: false })
export class AtLeastOneFieldValidator implements ValidatorConstraintInterface {
  public validate(_: unknown, args: ValidationArguments): boolean {
    const object = args.object as Record<string, unknown>;
    const [fields] = args.constraints as [string[]];

    return fields.some(
      (field) => object[field] !== undefined && object[field] !== null,
    );
  }

  public defaultMessage(args: ValidationArguments): string {
    const [fields] = args.constraints;
    return `At least one of the following fields must be provided: ${fields.join(', ')}`;
  }
}

export function AtLeastOneField(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [fields],
      validator: AtLeastOneFieldValidator,
    });
  };
}
