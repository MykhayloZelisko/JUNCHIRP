'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import { useRouter } from 'next/navigation';

export default function Deleted(): ReactElement {
  const router = useRouter();

  const handleRegistration = (): void => router.push('/auth/registration');

  return (
    <VerificationResultContent
      title="Термін дії посилання завершився"
      titleType="error"
      button={
        <Button color="green" onClick={handleRegistration}>
          Зареєструватись
        </Button>
      }
      content={
        <div>
          <p>
            Термін дії посилання завершився, і твій акаунт було видалено. Для
            доступу до платформи зареєструйся знову.
          </p>
        </div>
      }
    />
  );
}
