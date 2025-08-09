'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface UsersFiltersInterface {
  page: number;
  limit: number;
  activeProjectsCount?: number;
  specializationIds?: string[];
}

interface UsersFiltersResultInterface {
  filters: UsersFiltersInterface;
  updateFilters: (
    newParams: Record<string, string | string[] | number | undefined | null>,
  ) => void;
}

export const useUsersFilters = (): UsersFiltersResultInterface => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useMemo(() => {
    return {
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 5),
      activeProjectsCount: searchParams.get('activeProjectsCount')
        ? Number(searchParams.get('activeProjectsCount'))
        : undefined,
      specializationIds: searchParams.getAll('specializationIds'),
    };
  }, [searchParams]);

  const updateFilters = (
    newParams: Record<string, string | string[] | number | undefined | null>,
  ): void => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        current.delete(key);
      } else if (Array.isArray(value)) {
        current.delete(key);
        value.forEach((v) => current.append(key, String(v)));
      } else {
        current.set(key, String(value));
      }
    });

    router.push(`?${current.toString()}`, { scroll: false });
  };

  return { filters, updateFilters };
};
