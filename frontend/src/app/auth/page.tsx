'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth(): null {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/login');
  }, [router]);

  return null;
}
