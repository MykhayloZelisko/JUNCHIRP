'use client';

import { ReactElement } from 'react';
import styles from './UserSkeleton.module.scss';

export default function UserSkeleton(): ReactElement {
  return (
    <div className={styles['user-skeleton']}>
      <div className={styles['user-skeleton-1']} />
      <div className={styles['user-skeleton-2']}>
        <div className={styles['user-skeleton-3']} />
        <div className={styles['user-skeleton-4']} />
        <div className={styles['user-skeleton-3']} />
        <div className={styles['user-skeleton-4']} />
      </div>
      <div className={styles['user-skeleton-5']}>
        <div className={styles['user-skeleton-6']} />
        <div className={styles['user-skeleton-6']} />
        <div className={styles['user-skeleton-6']} />
        <div className={styles['user-skeleton-7']} />
        <div className={styles['user-skeleton-7']} />
      </div>
      <div className={styles['user-skeleton-8']}>
        <div className={styles['user-skeleton-9']}>17</div>
      </div>
    </div>
  );
}
