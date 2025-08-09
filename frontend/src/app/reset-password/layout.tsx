import { ReactElement, ReactNode, Suspense } from 'react';

export default function ResetPasswordLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <Suspense fallback={null}>
      <>{children}</>
    </Suspense>
  );
}
