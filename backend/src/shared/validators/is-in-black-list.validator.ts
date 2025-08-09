import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const BLACK_LIST = [
  'Password1!',
  'Qwerty123!',
  'Welcome123$',
  'Admin@123',
  'Abc123!@#',
  'P@ssw0rd',
  'Monkey123!',
  '1Qaz@wsx',
  'Password@1',
  'Test1234!',
  'Pa$$word1',
  'Hello123$',
  'Qwerty1@',
  'Summer2021!',
  'Winter#2023',
  'ChangeMe1!',
  'Spring2022$',
  'Autumn2020#',
  'Happy2022@',
  'Superman1!',
];

@ValidatorConstraint({ name: 'isPasswordInBlackList', async: false })
export class IsPasswordInBlackListValidator
  implements ValidatorConstraintInterface
{
  public validate(password: string): boolean {
    return !BLACK_LIST.includes(password);
  }

  public defaultMessage(): string {
    return 'Password is in black list.';
  }
}

export function IsPasswordInBlackList(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordInBlackListValidator,
    });
  };
}
