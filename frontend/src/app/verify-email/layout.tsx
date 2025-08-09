import React, { ReactElement, Suspense } from 'react';
import BirdBackground from '@/shared/components/BirdBackground/BirdBackground';

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <Suspense fallback={null}>
      <BirdBackground>{children}</BirdBackground>
    </Suspense>
  );
}
