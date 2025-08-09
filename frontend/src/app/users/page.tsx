'use client';

import { ReactElement, useEffect } from 'react';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import styles from './page.module.scss';
import Image from 'next/image';
import UsersFilters from './UsersFilters/UsersFilters';
import UsersList from './UsersList/UsersList';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import { useGetUsersQuery } from '@/api/usersApi';
import UsersListSkeleton from './UsersListSkeleton/UsersListSkeleton';
import { useToast } from '@/hooks/useToast';
import Pagination from '@/shared/components/Pagination/Pagination';

export default function Users(): ReactElement {
  const { filters, updateFilters } = useUsersFilters();
  const toast = useToast();

  const onPageChange = (page: number): void => {
    updateFilters({ page });
  };

  const { data, isLoading, isError } = useGetUsersQuery(filters);

  useEffect(() => {
    if (isError) {
      toast({
        severity: 'error',
        summary: 'Не вдалося завантажити учасників.',
        life: 3000,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (!isLoading && !isError && data?.users.length === 0) {
      toast({
        severity: 'error',
        summary: 'Немає учасників за цими критеріями.',
        life: 3000,
      });
    }
  }, [isLoading, isError, data]);

  return (
    <AuthGuard requireVerified>
      <div className={styles.users}>
        <div className={styles.users__banner}>
          <Image
            className={`${styles.users__image} ${styles['users__image--first']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
          <h2 className={styles.users__title}>Учасники платформи</h2>
          <Image
            className={`${styles.users__image} ${styles['users__image--last']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
        </div>
        <div className={styles.users__container}>
          <UsersFilters />
          {isLoading ? (
            <UsersListSkeleton />
          ) : data?.users.length ? (
            <UsersList users={data.users} />
          ) : null}
          {!!data?.users.length && (
            <Pagination
              total={data.total}
              limit={filters.limit}
              page={filters.page}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
