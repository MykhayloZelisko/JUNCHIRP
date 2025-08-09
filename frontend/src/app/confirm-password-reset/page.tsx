import { ReactElement, Suspense } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import ConfirmPasswordResetContent from './confirm-password-reset-content/ConfirmPasswordResetContent';

export default function ConfirmPasswordReset(): ReactElement {
  return (
    <Suspense fallback={null}>
      <div className={styles['confirm-password-reset']}>
        <div className={styles['confirm-password-reset__inner']}>
          <ConfirmPasswordResetContent />
          <Image src="/images/bird-1.svg" alt="bird" width={420} height={662} />
        </div>
      </div>
    </Suspense>
  );
}
