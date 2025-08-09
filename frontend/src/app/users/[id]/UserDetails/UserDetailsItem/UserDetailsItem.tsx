'use client';

import { ReactElement } from 'react';
import {
  isEducation, isEmailWithId,
  isHardSkill,
  isSocial,
  isSoftSkill,
} from '@/shared/utils/typeGuards';
import { socialNetworks } from '@/shared/constants/social-networks';
import styles from './UserDetailsItem.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import Edit from '@/assets/icons/edit.svg';
import Trash from '@/assets/icons/trash.svg';

interface UserDetailItemProps<T> {
  item: T;
}

export default function UserDetailsItem<T>({
  item,
}: UserDetailItemProps<T>): ReactElement {
  let content = <></>;
  const classNames = [`${styles['user-details-item']}`];

  if (isSocial(item) || isEmailWithId(item)) {
    if (isSocial(item)) {
      const matchedNetwork = socialNetworks.find(
        (n) => n.network.toLowerCase() === item.network.toLowerCase(),
      );

      content = (
        <div className={styles['user-details-item__social']}>
          {matchedNetwork ? (
            <Image
              src={matchedNetwork.icon}
              alt={item.network}
              className={styles['user-details-item__icon']}
              width={20}
              height={20}
            />
          ) : (
            <div className={styles['user-details-item__no-icon']}></div>
          )}
          <a
            className={styles['user-details-item__link']}
            href={item.url}
            target="_blank"
          >
            {item.network}
          </a>
        </div>
      );
    } else if (isEmailWithId(item)) {
      content = (
        <div className={styles['user-details-item__social']}>
          <Image
            src="/images/mail.svg"
            alt="email"
            className={styles['user-details-item__icon']}
            width={20}
            height={20}
          />
          <span className={styles['user-details-item__link']}>
            {item.email}
          </span>
        </div>
      );
    }
  }

  if (isEducation(item)) {
    content = (
      <div className={styles['user-details-item__education']}>
        <p className={styles['user-details-item__text']}>{item.institution}</p>
        <p
          className={`${styles['user-details-item__text']} ${styles['user-details-item__text--gray']}`}
        >
          {item.specialization.roleName}
        </p>
      </div>
    );
  }

  if (isHardSkill(item)) {
    content = (
      <span className={styles['user-details-item__text']}>
        {item.hardSkillName}
      </span>
    );
    classNames.push(`${styles['user-details-item--skill']}`);
  }

  if (isSoftSkill(item)) {
    content = (
      <span className={styles['user-details-item__text']}>
        {item.softSkillName}
      </span>
    );
    classNames.push(`${styles['user-details-item--skill']}`);
  }

  const className = classNames.join(' ');

  return <li className={className}>{content}</li>;
}
