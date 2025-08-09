import React, { ReactElement } from 'react';
import styles from './layout.module.scss';
import Image from 'next/image';
import TabMenuWrapper from '@/app/auth/TabMenuWrapper/TabMenuWrapper';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <div className={styles['auth-layout']}>
      <div className={styles['auth-layout__brackets']}>
        <Image
          className={styles['auth-layout__image']}
          src="/images/brackets.svg"
          alt="brackets"
          fill
        ></Image>
      </div>
      <div className={styles['auth-layout__routes-wrapper']}>
        <TabMenuWrapper />
        <div>{children}</div>
      </div>
    </div>
  );
}
