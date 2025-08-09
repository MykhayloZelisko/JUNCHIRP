'use client';

import { ReactElement } from 'react';
import styles from './UserBaseInfo.module.scss';
import { UserInterface } from '@/shared/interfaces/user.interface';
import Image from 'next/image';

interface UserBaseInfoProps {
  user: UserInterface;
}

export default function UserBaseInfo({
  user,
}: UserBaseInfoProps): ReactElement {
  return (
    <div className={styles['user-base-info']}>
      <div className={styles['user-base-info__header']}>
        <p className={styles['user-base-info__title']}>Ім'я та прізвище</p>
        <div className={styles['user-base-info__border']}></div>
      </div>
      <div className={styles['user-base-info__info']}>
        <Image
          className={styles['user-base-info__image']}
          src={user.avatarUrl}
          alt="bird"
          height={140}
          width={140}
        />
        <div className={styles['user-base-info__user-name']}>
          {user.firstName} {user.lastName}
        </div>
      </div>
    </div>
  );
}
