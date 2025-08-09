'use client';

import { ReactElement } from 'react';
import styles from './ProfileDetailsItem.module.scss';
import Button from '@/shared/components/Button/Button';
import {
  isEducation,
  isHardSkill,
  isSocial,
  isSoftSkill,
} from '@/shared/utils/typeGuards';
import Edit from '@/assets/icons/edit.svg';
import Trash from '@/assets/icons/trash.svg';
import { socialNetworks } from '@/shared/constants/social-networks';
import Image from 'next/image';

interface ProfileDetailItemProps<T> {
  item: T;
  isEditable?: boolean;
  handleEditItem?: (item: T) => void;
  handleDeleteItem: (item: T) => void;
}

export default function ProfileDetailsItem<T>(
  props: ProfileDetailItemProps<T>,
): ReactElement {
  const { item, isEditable = false, handleEditItem, handleDeleteItem } = props;
  let content = <></>;

  if (isSocial(item)) {
    const matchedNetwork = socialNetworks.find(
      (n) => n.network.toLowerCase() === item.network.toLowerCase(),
    );

    content = (
      <div className={styles['profile-details-item__social']}>
        {matchedNetwork ? (
          <Image
            src={matchedNetwork.icon}
            alt={item.network}
            className={styles['profile-details-item__icon']}
            width={20}
            height={20}
          />
        ) : (
          <div className={styles['profile-details-item__no-icon']}></div>
        )}
        <a
          className={styles['profile-details-item__link']}
          href={item.url}
          target="_blank"
        >
          {item.network}
        </a>
      </div>
    );
  }

  if (isEducation(item)) {
    content = (
      <div className={styles['profile-details-item__education']}>
        <p className={styles['profile-details-item__text']}>
          {item.institution}
        </p>
        <p
          className={`${styles['profile-details-item__text']} ${styles['profile-details-item__text--gray']}`}
        >
          {item.specialization.roleName}
        </p>
      </div>
    );
  }

  if (isHardSkill(item)) {
    content = (
      <p className={styles['profile-details-item__text']}>
        {item.hardSkillName}
      </p>
    );
  }

  if (isSoftSkill(item)) {
    content = (
      <p className={styles['profile-details-item__text']}>
        {item.softSkillName}
      </p>
    );
  }

  return (
    <li className={styles['profile-details-item']}>
      {content}
      <div className={styles['profile-details-item__actions']}>
        {isEditable ? (
          <Button
            size="ssm"
            variant="link"
            icon={<Edit />}
            onClick={() => handleEditItem?.(item)}
          />
        ) : null}
        <Button
          size="ssm"
          variant="link"
          icon={<Trash />}
          onClick={() => handleDeleteItem(item)}
        />
      </div>
    </li>
  );
}
