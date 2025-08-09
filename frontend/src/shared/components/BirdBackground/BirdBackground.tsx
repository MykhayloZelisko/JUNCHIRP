import { ReactElement, ReactNode } from 'react';
import styles from './BirdBackground.module.scss';
import Image from 'next/image';

export default function BirdBackground({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div className={styles['bird-background']}>
      <div className={styles['bird-background__inner']}>
        {children}
        <div className={styles['bird-background__bird']}>
          <Image src="/images/bird-2.svg" alt="bird" width={420} height={223} />
        </div>
      </div>
    </div>
  );
}
