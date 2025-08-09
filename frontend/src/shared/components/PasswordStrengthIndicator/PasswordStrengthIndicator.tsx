import React, { ReactElement } from 'react';
import styles from './PasswordStrengthIndicator.module.scss';

type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

const strengthInfoMap = {
  none: {
    classNames: ['', '', ''],
    text: 'Стан паролю',
  },
  weak: {
    classNames: [styles['password-strength__item--weak'], '', ''],
    text: 'Пароль занадто слабкий',
  },
  medium: {
    classNames: [
      styles['password-strength__item--medium'],
      styles['password-strength__item--medium'],
      '',
    ],
    text: 'Можна покращити',
  },
  strong: {
    classNames: [
      styles['password-strength__item--strong'],
      styles['password-strength__item--strong'],
      styles['password-strength__item--strong'],
    ],
    text: 'Надійний пароль',
  },
};

export default function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps): ReactElement {
  const strengthInfo = strengthInfoMap[strength];

  return (
    <div className={styles['password-strength']}>
      <div className={styles['password-strength__list']}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${styles['password-strength__item']} ${strengthInfo.classNames[i] || ''}`}
          ></div>
        ))}
      </div>
      <div className={styles['password-strength__describe']}>
        {strengthInfo.text}
      </div>
    </div>
  );
}
