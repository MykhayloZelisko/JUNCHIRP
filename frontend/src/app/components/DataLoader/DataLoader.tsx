'use client';

import { useGetMeQuery } from '@/api/authApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';

export default function DataLoader(): null {
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);
  const skip = loadingStatus !== 'idle';

  useGetMeQuery(undefined, {
    skip,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  return null;
}
