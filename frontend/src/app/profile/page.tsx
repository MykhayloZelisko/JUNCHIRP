'use client';

import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import authSelector from '@/redux/auth/authSelector';
import { ProfileActionType } from '@/shared/types/profile-action.type';
import { useAppSelector } from '@/hooks/reduxHooks';

export default function Profile(): ReactElement | null {
  const [action, setAction] = useState<ProfileActionType>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const user = useAppSelector(authSelector.selectUser);
  const [isBanner, setBanner] = useState(false);

  useEffect(() => {
    if (action && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [action]);

  useEffect(() => {
    if (user && !user.discordId) {
      setBanner(true);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <AuthGuard requireVerified>
      <div className={styles.profile}>
      </div>
    </AuthGuard>
  );
}
