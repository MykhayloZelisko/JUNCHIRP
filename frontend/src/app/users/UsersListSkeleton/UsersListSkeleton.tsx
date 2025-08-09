'use client';

import { ReactElement } from 'react';
import styles from './UsersListSkeleton.module.scss';

export default function UsersListSkeleton(): ReactElement {
  return (
    <div className={styles['users-list-skeleton']}>
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className={styles['users-list-skeleton__item']}></div>
      ))}
    </div>
  );
}
