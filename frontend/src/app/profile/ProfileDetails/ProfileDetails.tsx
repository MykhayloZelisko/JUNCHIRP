'use client';

import { ReactElement, useState } from 'react';
import styles from './ProfileDetails.module.scss';
import Button from '@/shared/components/Button/Button';
import Plus from '@/assets/icons/plus.svg';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import ProfileDetailsItem from './ProfileDetailsItem/ProfileDetailsItem';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { WithIdInterface } from '@/shared/interfaces/with-id.interface';

interface ProfileDetailsProps<
  T extends WithIdInterface =
    | SoftSkillInterface
    | HardSkillInterface
    | EducationInterface
    | SocialInterface,
> {
  title: string;
  isEditable?: boolean;
  items: T[];
  maxSize: number;
  handleAddItem: () => void;
  handleEditItem?: (item: T) => void;
  handleDeleteItem: (item: T) => void;
}

const COLLAPSE_LIMIT = 5;

export default function ProfileDetails<T extends WithIdInterface>(
  props: ProfileDetailsProps<T>,
): ReactElement {
  const {
    title,
    isEditable = false,
    items,
    maxSize,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const visibleItems = isCollapsed ? items.slice(0, COLLAPSE_LIMIT) : items;

  const toggleList = (): void => setIsCollapsed(!isCollapsed);

  return (
    <div className={styles['profile-details']}>
      {items.length ? (
        <div
          className={`${styles['profile-details__inner']} ${styles['profile-details__inner--full']}`}
        >
          <div className={styles['profile-details__content']}>
            <div className={styles['profile-details__header']}>
              <div className={styles['profile-details__title-wrapper']}>
                <div className={styles['profile-details__title']}>{title}</div>
                <div className={styles['profile-details__counter']}>
                  {items.length}{' '}
                  <span className={styles['profile-details__total']}>
                    / {maxSize}
                  </span>
                </div>
              </div>
              <div className={styles['profile-details__divider']}></div>
            </div>
            <ul className={styles['profile-details__list']}>
              {visibleItems.map((item) => (
                <ProfileDetailsItem<T>
                  item={item}
                  isEditable={isEditable}
                  key={item.id}
                  handleEditItem={handleEditItem}
                  handleDeleteItem={handleDeleteItem}
                />
              ))}
            </ul>
            {items.length > 5 ? (
              <Button
                className={styles['profile-details__toggle']}
                size="md"
                variant="link"
                color="black"
                icon={isCollapsed ? <Down /> : <Up />}
                onClick={toggleList}
              />
            ) : null}
          </div>
          <Button
            color="green"
            fullWidth
            icon={<Plus />}
            disabled={items.length === maxSize}
            onClick={handleAddItem}
          >
            Додати
          </Button>
        </div>
      ) : (
        <div
          className={`${styles['profile-details__inner']} ${styles['profile-details__inner--empty']}`}
        >
          <div className={styles['profile-details__title']}>{title}</div>
          <Button
            color="green"
            fullWidth
            icon={<Plus />}
            onClick={handleAddItem}
          >
            Додати
          </Button>
        </div>
      )}
    </div>
  );
}
