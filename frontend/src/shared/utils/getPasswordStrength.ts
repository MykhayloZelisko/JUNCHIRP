import { PasswordStrengthType } from '@/shared/types/password-strength.type';

export function getPasswordStrength(
  password?: string,
  firstName?: string,
  lastName?: string,
  blackList: string[] = [],
): PasswordStrengthType {
  if (!password) {
    return 'none';
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/.test(password);
  const onlyAllowedChars =
    /^[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+$/.test(password);
  const length = password.length;
  const isBlacklisted = blackList?.includes(password);
  const containsNames =
    (firstName && password.includes(firstName)) ??
    (lastName && password.includes(lastName));

  if (
    length >= 12 &&
    length <= 20 &&
    hasLower &&
    hasUpper &&
    hasDigit &&
    hasSpecial &&
    onlyAllowedChars &&
    !isBlacklisted &&
    !containsNames
  ) {
    return 'strong';
  }

  if (
    length >= 8 &&
    length <= 20 &&
    [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length >= 2 &&
    onlyAllowedChars &&
    !isBlacklisted &&
    !containsNames
  ) {
    return 'medium';
  }

  return 'weak';
}
