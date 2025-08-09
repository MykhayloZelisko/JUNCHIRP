import { ReactElement } from 'react';
import styles from './page.module.scss';
import RequestPasswordResetForm from './RequestPasswordResetForm/RequestPasswordResetForm';

export default function RequestPasswordReset(): ReactElement {
  return (
    <div className={styles['request-password-reset']}>
      <div className={styles['request-password-reset__content']}>
        <h2 className={styles['request-password-reset__title']}>
          Запит на відновлення пароля
        </h2>
        <p className={styles['request-password-reset__text']}>
          Для відновлення пароля введи свою електронну адресу і ми надішлемо
          інструкції для відновлення доступу.
        </p>
        <RequestPasswordResetForm />
      </div>
    </div>
  );
}
