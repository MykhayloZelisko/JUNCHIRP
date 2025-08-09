'use client';

import { ReactElement, useState } from 'react';
import styles from './UserDetails.module.scss';
import Button from '@/shared/components/Button/Button';
import Plus from '@/assets/icons/plus.svg';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { useColumns } from '@/hooks/useColumns';
import { WithIdInterface } from '@/shared/interfaces/with-id.interface';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import UserDetailsItem from '@/app/users/[id]/UserDetails/UserDetailsItem/UserDetailsItem';
import { EmailWithIdInterface } from '@/shared/interfaces/email-with-id.interface';

interface UserDetailsProps<
  T extends WithIdInterface =
    | SoftSkillInterface
    | HardSkillInterface
    | EducationInterface
    | (SocialInterface | EmailWithIdInterface),
> {
  title: string;
  items: T[];
  columnsCount?: number;
}

export default function UserDetails<T extends WithIdInterface>({
  title,
  items,
  columnsCount,
}: UserDetailsProps<T>): ReactElement {
  const columns = useColumns({
    fixed: columnsCount,
  });
  const classNameList =
    columns === 1
      ? styles['user-details__list']
      : `${styles['user-details__list']} ${styles['user-details__list--two-columns']}`;
  const classNameContainer =
    columns === 1
      ? styles['user-details']
      : `${styles['user-details']} ${styles['user-details--two-columns']}`;

  return (
    <div className={classNameContainer}>
      <div className={styles['user-details__header']}>
        <p className={styles['user-details__title']}>{title}</p>
        <div className={styles['user-details__border']}></div>
      </div>
      <ul className={classNameList}>
        {items.map((item) => (
          <UserDetailsItem<T> item={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
  // const { title, items } = props;
  // const [isCollapsed, setIsCollapsed] = useState(true);
  // const visibleItems = isCollapsed ? items.slice(0, COLLAPSE_LIMIT) : items;
  //
  // const toggleList = (): void => setIsCollapsed(!isCollapsed);
  //
  // return (
  //   <div className={styles['profile-details']}>
  //     {items.length ? (
  //       <div
  //         className={`${styles['profile-details__inner']} ${styles['profile-details__inner--full']}`}
  //       >
  //         <div className={styles['profile-details__content']}>
  //           <div className={styles['profile-details__header']}>
  //             <div className={styles['profile-details__title-wrapper']}>
  //               <div className={styles['profile-details__title']}>{title}</div>
  //               <div className={styles['profile-details__counter']}>
  //                 {items.length}{' '}
  //                 <span className={styles['profile-details__total']}>
  //                   / {maxSize}
  //                 </span>
  //               </div>
  //             </div>
  //             <div className={styles['profile-details__divider']}></div>
  //           </div>
  //           <div className={styles['profile-details__list']}>
  //             {visibleItems.map((item) => (
  //               <ProfileDetailsItem<T>
  //                 item={item}
  //                 isEditable={isEditable}
  //                 key={item.id}
  //                 handleEditItem={handleEditItem}
  //                 handleDeleteItem={handleDeleteItem}
  //               />
  //             ))}
  //           </div>
  //           {items.length > 5 ? (
  //             <Button
  //               className={styles['profile-details__toggle']}
  //               size="md"
  //               variant="link"
  //               color="black"
  //               icon={isCollapsed ? <Down /> : <Up />}
  //               onClick={toggleList}
  //             />
  //           ) : null}
  //         </div>
  //         <Button
  //           color="green"
  //           fullWidth
  //           icon={<Plus />}
  //           disabled={items.length === maxSize}
  //           onClick={handleAddItem}
  //         >
  //           Додати
  //         </Button>
  //       </div>
  //     ) : (
  //       <div
  //         className={`${styles['profile-details__inner']} ${styles['profile-details__inner--empty']}`}
  //       >
  //         <div className={styles['profile-details__title']}>{title}</div>
  //         <Button
  //           color="green"
  //           fullWidth
  //           icon={<Plus />}
  //           onClick={handleAddItem}
  //         >
  //           Додати
  //         </Button>
  //       </div>
  //     )}
  //   </div>
  // );
}
