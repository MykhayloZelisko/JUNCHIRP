'use client';

import { ReactElement, useEffect } from 'react';
import Spinner from '@/shared/components/Spinner/Spinner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmEmailMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import styles from './page.module.scss';

export default function VerifyEmail(): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const [verifyEmail, { isError, isSuccess, error }] =
    useConfirmEmailMutation();

  useEffect(() => {
    verifyEmail({ token, email });
  }, [verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      router.push('/verify-email/success');
    } else if (isError) {
      const errorData = error as (FetchBaseQueryError | SerializedError) & {
        status?: number;
        data: {
          error?: string;
        };
      };
      const resStatus = errorData.status;

      if (resStatus === 400 && errorData.data.error !== 'Validation Error') {
        router.push(`/verify-email/invalid?email=${encodeURIComponent(email)}`);
      } else {
        router.push(`/verify-email/deleted`);
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <div className={styles['verify-email']}>
      <Spinner size={100} />
    </div>
  );
}
