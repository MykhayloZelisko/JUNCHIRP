'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import BirdBackground from '@/shared/components/BirdBackground/BirdBackground';
import { useRouter } from 'next/navigation';

export default function Error(): ReactElement {
  const router = useRouter();

  const handleRedirect = (): void => {
    router.push('/request-password-reset');
  };

  return (
    <BirdBackground>
      <VerificationResultContent
        title="Термін дії посилання завершився"
        titleType="error"
        content={
          <div>
            <p>
              Це посилання більше не дійсне. Будь ласка,{' '}
              <Button variant="link" color="green" onClick={handleRedirect}>
                Надішли запит ще раз
              </Button>{' '}
              на нове посилання для відновлення пароля.
            </p>
          </div>
        }
      />
    </BirdBackground>
  );
}
