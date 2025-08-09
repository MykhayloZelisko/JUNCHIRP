import styles from './page.module.scss';
import LoginForm from '@/app/auth/login/LoginForm/LoginForm';
import { ReactElement, Suspense } from 'react';
import SocialButton from '@/shared/components/SocialButton/SocialButton';

export default function Login(): ReactElement {
  return (
    <Suspense fallback={null}>
      <div className={styles.login}>
        <LoginForm />
        <div className={styles.login__divider}>
          <div className={styles.login__line}></div>
          <span className={styles.login__text}>або</span>
          <div className={styles.login__line}></div>
        </div>
        <SocialButton
          social="google"
          fullWidth={true}
          message={{
            severity: 'error',
            summary: 'Не вдалося увійти через Google.',
            detail: 'Спробуй ще раз або обери інший спосіб входу.',
            life: 3000,
          }}
        />
      </div>
    </Suspense>
  );
}
