import RegistrationForm from '@/app/auth/registration/RegistrationForm/RegistrationForm';
import styles from './page.module.scss';
import { ReactElement, Suspense } from 'react';
import SocialButton from '@/shared/components/SocialButton/SocialButton';

export default function Registration(): ReactElement {
  return (
    <Suspense fallback={null}>
      <div className={styles.registration}>
        <RegistrationForm />
        <div className={styles.registration__divider}>
          <div className={styles.registration__line}></div>
          <span className={styles.registration__text}>або</span>
          <div className={styles.registration__line}></div>
        </div>
        <SocialButton
          social="google"
          fullWidth={true}
          message={{
            severity: 'error',
            summary: 'Не вдалося зареєструватись через Google.',
            detail: 'Спробуй ще раз або обери інший спосіб реєстрації.',
            life: 3000,
          }}
        />
      </div>
    </Suspense>
  );
}
