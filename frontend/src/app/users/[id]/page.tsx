'use client';

import { ReactElement } from 'react';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import styles from './page.module.scss';
import Button from '@/shared/components/Button/Button';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import UserBaseInfo from './UserBaseInfo/UserBaseInfo';
import { useParams } from 'next/navigation';
import { useGetUserByIdQuery } from '@/api/usersApi';
import UserDetails from '@/app/users/[id]/UserDetails/UserDetails';
import UserSkeleton from '@/app/users/[id]/UserSkeleton/UserSkeleton';

export default function User(): ReactElement {
  const params = useParams();
  const userId = params.id as string;
  const { data, isLoading, error } = useGetUserByIdQuery(userId);

  if (isLoading) {
    return <UserSkeleton />;
  }

  if (error) {
    return <></>;
  }

  return (
    <AuthGuard requireVerified>
      <div className={styles.user}>
        <UserBaseInfo user={data} />
        <div className={styles.user__details}>
          <UserDetails
            title="Освіта"
            items={data.educations}
            columnsCount={1}
          />
          <UserDetails title="Hard Skills" items={data.hardSkills} />
          <UserDetails
            title="Контактні дані"
            items={[{ email: data.email, id: data.email }, ...data.socials]}
            columnsCount={1}
          />
          <UserDetails title="Soft Skills" items={data.softSkills} />
        </div>
        <div className={styles.user_4}>
          <div className={styles.user_5}>6</div>
          <div className={styles.user_5}>7</div>
          <div className={styles.user_5}>8</div>
          <div className={styles.user_6}>9</div>
          <div className={styles.user_6}>10</div>
          <div className={styles.user_6}>11</div>
          <div className={styles.user_6}>12</div>
          <div className={styles.user_6}>13</div>
          <div className={styles.user_6}>14</div>
          <div className={styles.user_6}>15</div>
          <div className={styles.user_6}>16</div>
        </div>
        <div className={styles.user__actions}>
          <Button
            size="lg"
            color="green"
            iconPosition="right"
            icon={<ArrowUpRight />}
          >
            Запросити в проєкт
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
