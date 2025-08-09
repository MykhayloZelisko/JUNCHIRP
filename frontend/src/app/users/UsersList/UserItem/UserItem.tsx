'use client';

import { ReactElement, useState } from 'react';
import styles from './UserItem.module.scss';
import { UserInterface } from '@/shared/interfaces/user.interface';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import InvitePopup from '@/shared/components/InvitePopup/InvitePopup';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { useRouter } from 'next/navigation';

interface UserItemProps {
  user: UserCardInterface;
  currentUser: UserInterface;
  myProjects: ProjectCardInterface[];
}

export default function UserItem({
  user,
  currentUser,
  myProjects,
}: UserItemProps): ReactElement {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleRedirect = (): void => {
    router.push(user.id === currentUser.id ? '/profile' : `/users/${user.id}`);
  };

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  return (
    <>
      <div className={styles['user-item']}>
        <div className={styles['user-item__profile']}>
          <Image
            className={styles['user-item__image']}
            src={user.avatarUrl}
            alt="bird"
            height={140}
            width={140}
          />
          <div className={styles['user-item__details']}>
            <h3 className={styles['user-item__title']}>
              {user.firstName} {user.lastName}
            </h3>
            <ul className={styles['user-item__edu-list']}>
              {user.educations.map((edu) => (
                <li className={styles['user-item__edu-item']} key={edu.id}>
                  {edu.specialization.roleName}
                </li>
              ))}
            </ul>
            <p className={styles['user-item__projects-text']}>
              Кількість активних проєктів:{' '}
              <span className={styles['user-item__projects-count']}>
                {user.activeProjectsCount}
              </span>
            </p>
          </div>
        </div>
        <div className={styles['user-item__actions']}>
          <Button
            variant="secondary-frame"
            color="green"
            fullWidth
            onClick={handleRedirect}
          >
            Профіль
          </Button>
          <Button
            color="green"
            fullWidth
            disabled={
              user.activeProjectsCount === 2 ||
              user.id === currentUser.id ||
              myProjects.length === 0
            }
            onClick={openModal}
          >
            Запросити
          </Button>
        </div>
      </div>
      {isModalOpen && <InvitePopup onClose={closeModal} user={user} />}
    </>
  );
}
