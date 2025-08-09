'use client';

import { ReactElement } from 'react';
import styles from './ChangeEmailPopup.module.scss';
import ChangeEmailForm from './ChangeEmailForm/ChangeEmailForm';

interface ConfirmModalProps {
  onClose: () => void;
}

export default function ChangeEmailPopup(
  props: ConfirmModalProps,
): ReactElement {
  const { onClose } = props;

  return (
    <div className={styles['change-email-popup__wrapper']}>
      <div className={styles['change-email-popup']}>
        <div className={styles['change-email-popup__content']}>
          <h3 className={styles['change-email-popup__title']}>
            Змінити e-mail
          </h3>
          <p className={styles['change-email-popup__text']}>
            Будь ласка, введи свій новий e-mail, щоб ми могли надіслати тобі
            лист для підтвердження.
          </p>
        </div>
        <ChangeEmailForm onClose={onClose} />
      </div>
    </div>
  );
}
