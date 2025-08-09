import { ReactElement } from 'react';
import styles from './page.module.scss';
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm';

export default function NewPassword(): ReactElement {
  return (
    <div className={styles['new-password']}>
      <div className={styles['new-password__inner']}>
        <h2 className={styles['new-password__title']}>Відновлення пароля</h2>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
