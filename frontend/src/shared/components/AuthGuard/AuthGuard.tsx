'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';

interface AccessGuardProps {
  children: ReactNode;
  requireVerified?: boolean;
  loadingFallback?: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireVerified = false,
  loadingFallback = null,
  redirectTo = '/',
}: AccessGuardProps): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const status = useAppSelector(authSelector.selectLoadingStatus);
  const router = useRouter();

  const isLoading = status !== 'loaded';

  const shouldRedirect = requireVerified !== user?.isVerified || !user;

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
