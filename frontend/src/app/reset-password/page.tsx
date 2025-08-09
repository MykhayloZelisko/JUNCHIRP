'use client';

import React, { ReactElement, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useValidateTokenQuery } from '@/api/authApi';
import Spinner from '@/shared/components/Spinner/Spinner';
import BirdBackground from '@/shared/components/BirdBackground/BirdBackground';
import styles from './page.module.scss';

export default function ResetPassword(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { data, isError } = useValidateTokenQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      router.push('/reset-password/error');
      return;
    }

    if (data?.isValid) {
      router.push(
        `/reset-password/new-password?token=${encodeURIComponent(token)}&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}`,
      );
    } else if (isError || data?.isValid === false) {
      router.push('/reset-password/error');
    }
  }, [data, isError, token]);

  return (
    <BirdBackground>
      <div className={styles['reset-password']}>
        <Spinner size={100} />
      </div>
    </BirdBackground>
  );
}
