'use client';

import { ReactElement } from 'react';
import styles from './UsersList.module.scss';
import UserItem from './UserItem/UserItem';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import MyProjectsSelector from '@/redux/myProjects/myProjectsSelector';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';

interface UsersListProps {
  users: UserCardInterface[];
}

export default function UsersList({
  users,
}: UsersListProps): ReactElement | null {
  const currentUser = useAppSelector(authSelector.selectUser);
  const myProjects = useAppSelector(MyProjectsSelector.selectMyOwnedProjects);

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles['users-list']}>
      {users.map((user: UserCardInterface) => (
        <UserItem
          key={user.id}
          user={user}
          currentUser={currentUser}
          myProjects={myProjects}
        />
      ))}
    </div>
  );
}
