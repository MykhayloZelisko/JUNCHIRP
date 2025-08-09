'use client';

import { ReactElement } from 'react';
import styles from './ProfileBaseInfo.module.scss';
import Image from 'next/image';
import { UserInterface } from '@/shared/interfaces/user.interface';
import Button from '@/shared/components/Button/Button';
import Edit from '@/assets/icons/edit.svg';

interface ProfileBaseInfoProps {
  user: UserInterface;
  handleEditName: () => void;
}

export default function ProfileBaseInfo(
  props: ProfileBaseInfoProps,
): ReactElement {
  const { user, handleEditName } = props;

  return (
    <div className={styles['profile-base-info']}>
      <div className={styles['profile-base-info__inner']}>
        <Image
          className={styles['profile-base-info__image']}
          src={user.avatarUrl}
          alt="bird"
          height={140}
          width={140}
        />
        <div className={styles['profile-base-info__info']}>
          <div className={styles['profile-base-info__name-wrapper']}>
            <p className={styles['profile-base-info__name']}>
              {user.firstName} {user.lastName}
            </p>
            <Button
              color="green"
              variant="secondary-frame"
              icon={<Edit />}
              onClick={handleEditName}
            />
          </div>
          <p className={styles['profile-base-info__email']}>{user.email}</p>
        </div>
      </div>
    </div>
  );
}
