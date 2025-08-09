import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import { ReactElement, Suspense } from 'react';
import styles from './page.module.scss';
import ConfirmEmailContent from './ConfirmEmailContent/ConfirmEmailContent';
import Image from 'next/image';

export default function ConfirmEmail(): ReactElement {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <div className={styles['confirm-email']}>
          <div className={styles['confirm-email__inner']}>
            <ConfirmEmailContent />
            <Image
              src="/images/bird-1.svg"
              alt="bird"
              width={420}
              height={662}
            />
          </div>
        </div>
      </Suspense>
    </AuthGuard>
  );
}
