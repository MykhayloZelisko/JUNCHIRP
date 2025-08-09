'use client';

import { useGetMeQuery } from '@/api/authApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useLazyGetProjectRolesListQuery } from '@/api/projectRolesApi';
import { useEffect } from 'react';
import { useLazyGetMyProjectsQuery } from '@/api/usersApi';

export default function DataLoader(): null {
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);
  const skip = loadingStatus !== 'idle';

  useGetMeQuery(undefined, {
    skip,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  const user = useAppSelector(authSelector.selectUser);
  const [loadRoles] = useLazyGetProjectRolesListQuery();
  const [loadProjects] = useLazyGetMyProjectsQuery();

  useEffect(() => {
    if (user?.isVerified) {
      loadRoles(undefined);
      loadProjects(undefined);
    }
  }, [user, loadRoles, loadProjects]);

  return null;
}
