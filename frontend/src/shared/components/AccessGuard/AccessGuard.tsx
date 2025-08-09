'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';

interface AccessGuardProps {
  children: ReactNode;
  checkDataAccess?: () =>
    | { error?: FetchBaseQueryError; isFetching?: boolean }
    | undefined;
  loadingFallback?: ReactNode;
  redirectTo?: string;
}

export default function AccessGuard({
  children,
  checkDataAccess,
  loadingFallback = null,
  redirectTo = '/',
}: AccessGuardProps): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const status = useAppSelector(authSelector.selectLoadingStatus);
  const router = useRouter();

  const accessCheck = checkDataAccess?.();
  const isFetching = accessCheck?.isFetching ?? false;
  const accessError = accessCheck?.error;

  const isLoading = status !== 'loaded' || isFetching;

  const shouldRedirect =
    !user?.isVerified || !user || accessError?.status === 403;

  useEffect(() => {
    if (!isLoading && shouldRedirect) {
      router.push(redirectTo);
    }
  }, [isLoading, shouldRedirect, router, redirectTo]);

  if (isLoading || shouldRedirect) {
    return <>{loadingFallback}</>;
  }

  return <>{children}</>;
}
